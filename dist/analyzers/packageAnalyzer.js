"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyzePackage = analyzePackage;
const promises_1 = require("fs/promises");
const path_1 = require("path");
const ora_1 = __importDefault(require("ora"));
const npmDataFetcher_1 = require("../services/npmDataFetcher");
const bundleAnalyzer_1 = require("../services/bundleAnalyzer");
async function analyzePackage(projectPath) {
    const spinner = (0, ora_1.default)('Reading package.json...').start();
    try {
        const packageJsonPath = (0, path_1.join)(projectPath, 'package.json');
        const packageJsonContent = await (0, promises_1.readFile)(packageJsonPath, 'utf-8');
        const packageJson = JSON.parse(packageJsonContent);
        const dependencies = {
            ...packageJson.dependencies,
            ...packageJson.devDependencies
        };
        spinner.text = 'Analyzing dependencies...';
        const results = [];
        for (const [name, version] of Object.entries(dependencies)) {
            spinner.text = `Analyzing ${name}...`;
            const [npmData, bundleData] = await Promise.all([
                (0, npmDataFetcher_1.fetchNpmMetadata)(name),
                (0, bundleAnalyzer_1.analyzeBundleSize)(name, version)
            ]);
            results.push({
                name,
                version,
                bundleSize: bundleData.size,
                gzipSize: bundleData.gzipSize,
                lastUpdate: npmData.lastUpdate,
                hasESM: npmData.hasESM,
                isTreeShakeable: bundleData.isTreeShakeable,
                transitiveDependencies: npmData.dependencies.length,
                alternatives: await findAlternatives(name)
            });
        }
        spinner.succeed('Analysis complete!');
        return results;
    }
    catch (error) {
        spinner.fail('Analysis failed');
        throw error;
    }
}
async function findAlternatives(packageName) {
    // Map of known alternatives for popular packages
    const knownAlternatives = {
        'moment': ['date-fns', 'dayjs', 'luxon'],
        'lodash': ['ramda', 'underscore', 'radash'],
        'axios': ['ky', 'got', 'node-fetch'],
        'request': ['node-fetch', 'got', 'undici']
    };
    return knownAlternatives[packageName] || [];
}
