"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.exportReport = exportReport;
const promises_1 = require("fs/promises");
async function exportReport(deps) {
    const report = {
        generatedAt: new Date().toISOString(),
        dependencies: deps.map(dep => ({
            ...dep,
            lastUpdate: dep.lastUpdate.toISOString(),
            bundleSizeFormatted: formatBytes(dep.bundleSize),
            gzipSizeFormatted: formatBytes(dep.gzipSize)
        }))
    };
    await (0, promises_1.writeFile)('dep-impact-report.json', JSON.stringify(report, null, 2), 'utf-8');
}
function formatBytes(bytes) {
    const units = ['B', 'KB', 'MB'];
    let size = bytes;
    let unitIndex = 0;
    while (size >= 1024 && unitIndex < units.length - 1) {
        size /= 1024;
        unitIndex++;
    }
    return `${size.toFixed(1)} ${units[unitIndex]}`;
}
