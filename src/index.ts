#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import { analyzePackage } from './analyzers/packageAnalyzer';
import { comparePackages } from './commands/compare';
import { exportReport } from './utils/reportExporter';
import { version } from '../package.json';

const program = new Command();

program
  .name('dep-impact')
  .description('Analyze the impact of your npm dependencies')
  .version(version);

program
  .command('analyze')
  .description('Analyze dependencies in the current project')
  .option('-e, --export', 'Export results to dep-impact-report.json')
  .option('-s, --size-limit <size>', 'Set size limit for dependencies (in KB)')
  .action(async (options) => {
    try {
      const results = await analyzePackage(process.cwd());
      
      if (options.export) {
        await exportReport(results);
        console.log(chalk.green('✨ Report exported to dep-impact-report.json'));
      }
      
      if (options.sizeLimit) {
        const limit = parseInt(options.sizeLimit);
        const oversizedDeps = results.filter(dep => dep.bundleSize > limit * 1024);
        if (oversizedDeps.length > 0) {
          console.error(chalk.red(`❌ Found ${oversizedDeps.length} dependencies exceeding size limit`));
          process.exit(1);
        }
      }
    } catch (error) {
      console.error(chalk.red('Error analyzing package:'), error);
      process.exit(1);
    }
  });

program
  .command('compare <package1> <package2>')
  .description('Compare two npm packages')
  .action(async (package1, package2) => {
    try {
      await comparePackages(package1, package2);
    } catch (error) {
      console.error(chalk.red('Error comparing packages:'), error);
      process.exit(1);
    }
  });

program.parse(); 