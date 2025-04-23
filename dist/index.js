#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const chalk_1 = __importDefault(require("chalk"));
const packageAnalyzer_1 = require("./analyzers/packageAnalyzer");
const compare_1 = require("./commands/compare");
const reportExporter_1 = require("./utils/reportExporter");
const package_json_1 = require("../package.json");
const program = new commander_1.Command();
program
    .name('dep-impact')
    .description('Analyze the impact of your npm dependencies')
    .version(package_json_1.version);
program
    .command('analyze')
    .description('Analyze dependencies in the current project')
    .option('-e, --export', 'Export results to dep-impact-report.json')
    .option('-s, --size-limit <size>', 'Set size limit for dependencies (in KB)')
    .action(async (options) => {
    try {
        const results = await (0, packageAnalyzer_1.analyzePackage)(process.cwd());
        if (options.export) {
            await (0, reportExporter_1.exportReport)(results);
            console.log(chalk_1.default.green('✨ Report exported to dep-impact-report.json'));
        }
        if (options.sizeLimit) {
            const limit = parseInt(options.sizeLimit);
            const oversizedDeps = results.filter(dep => dep.bundleSize > limit * 1024);
            if (oversizedDeps.length > 0) {
                console.error(chalk_1.default.red(`❌ Found ${oversizedDeps.length} dependencies exceeding size limit`));
                process.exit(1);
            }
        }
    }
    catch (error) {
        console.error(chalk_1.default.red('Error analyzing package:'), error);
        process.exit(1);
    }
});
program
    .command('compare <package1> <package2>')
    .description('Compare two npm packages')
    .action(async (package1, package2) => {
    try {
        await (0, compare_1.comparePackages)(package1, package2);
    }
    catch (error) {
        console.error(chalk_1.default.red('Error comparing packages:'), error);
        process.exit(1);
    }
});
program.parse();
