"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatSize = formatSize;
exports.formatDependencyInfo = formatDependencyInfo;
const chalk_1 = __importDefault(require("chalk"));
const table_1 = require("table");
function formatSize(bytes) {
    const units = ['B', 'KB', 'MB'];
    let size = bytes;
    let unitIndex = 0;
    while (size >= 1024 && unitIndex < units.length - 1) {
        size /= 1024;
        unitIndex++;
    }
    return `${size.toFixed(1)} ${units[unitIndex]}`;
}
function formatDependencyInfo(deps) {
    const headers = [
        'Package',
        'Version',
        'Bundle Size',
        'Gzip Size',
        'Last Update',
        'ESM',
        'Tree-Shakeable',
        'Dependencies',
        'Alternatives'
    ];
    const rows = deps.map(dep => [
        chalk_1.default.bold(dep.name),
        dep.version,
        formatSize(dep.bundleSize),
        formatSize(dep.gzipSize),
        dep.lastUpdate.toLocaleDateString(),
        dep.hasESM ? chalk_1.default.green('✓') : chalk_1.default.red('✗'),
        dep.isTreeShakeable ? chalk_1.default.green('✓') : chalk_1.default.red('✗'),
        dep.transitiveDependencies.toString(),
        dep.alternatives.join(', ') || '-'
    ]);
    return (0, table_1.table)([headers, ...rows], {
        border: {
            topBody: '─',
            topJoin: '┬',
            topLeft: '┌',
            topRight: '┐',
            bottomBody: '─',
            bottomJoin: '┴',
            bottomLeft: '└',
            bottomRight: '┘',
            bodyLeft: '│',
            bodyRight: '│',
            bodyJoin: '│',
            joinBody: '─',
            joinLeft: '├',
            joinRight: '┤',
            joinJoin: '┼'
        }
    });
}
