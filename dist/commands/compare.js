"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.comparePackages = comparePackages;
const chalk_1 = __importDefault(require("chalk"));
const ora_1 = __importDefault(require("ora"));
const table_1 = require("table");
const npmDataFetcher_1 = require("../services/npmDataFetcher");
const bundleAnalyzer_1 = require("../services/bundleAnalyzer");
const formatter_1 = require("../utils/formatter");
async function comparePackages(package1, package2) {
    const spinner = (0, ora_1.default)('Analyzing packages...').start();
    try {
        const [pkg1Data, pkg2Data] = await Promise.all([
            analyzePackageData(package1),
            analyzePackageData(package2)
        ]);
        spinner.succeed('Analysis complete!');
        const headers = ['Metric', package1, package2, 'Difference'];
        const rows = [
            ['Bundle Size',
                (0, formatter_1.formatSize)(pkg1Data.size),
                (0, formatter_1.formatSize)(pkg2Data.size),
                formatSizeDiff(pkg1Data.size, pkg2Data.size)
            ],
            ['Gzip Size',
                (0, formatter_1.formatSize)(pkg1Data.gzipSize),
                (0, formatter_1.formatSize)(pkg2Data.gzipSize),
                formatSizeDiff(pkg1Data.gzipSize, pkg2Data.gzipSize)
            ],
            ['Dependencies',
                pkg1Data.dependencies.length.toString(),
                pkg2Data.dependencies.length.toString(),
                formatDiff(pkg1Data.dependencies.length, pkg2Data.dependencies.length)
            ],
            ['ESM Support',
                pkg1Data.hasESM ? chalk_1.default.green('✓') : chalk_1.default.red('✗'),
                pkg2Data.hasESM ? chalk_1.default.green('✓') : chalk_1.default.red('✗'),
                '-'
            ],
            ['Tree-Shakeable',
                pkg1Data.isTreeShakeable ? chalk_1.default.green('✓') : chalk_1.default.red('✗'),
                pkg2Data.isTreeShakeable ? chalk_1.default.green('✓') : chalk_1.default.red('✗'),
                '-'
            ]
        ];
        console.log((0, table_1.table)([headers, ...rows]));
    }
    catch (error) {
        spinner.fail('Comparison failed');
        throw error;
    }
}
async function analyzePackageData(packageName) {
    const npmData = await (0, npmDataFetcher_1.fetchNpmMetadata)(packageName);
    const bundleData = await (0, bundleAnalyzer_1.analyzeBundleSize)(packageName, 'latest');
    return {
        ...npmData,
        ...bundleData
    };
}
function formatSizeDiff(size1, size2) {
    const diff = size2 - size1;
    if (diff === 0)
        return chalk_1.default.gray('No difference');
    const formattedDiff = (0, formatter_1.formatSize)(Math.abs(diff));
    return diff > 0
        ? chalk_1.default.red(`+${formattedDiff}`)
        : chalk_1.default.green(`-${formattedDiff}`);
}
function formatDiff(val1, val2) {
    const diff = val2 - val1;
    if (diff === 0)
        return chalk_1.default.gray('No difference');
    return diff > 0
        ? chalk_1.default.red(`+${diff}`)
        : chalk_1.default.green(`${diff}`);
}
