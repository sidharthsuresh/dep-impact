import { writeFile } from 'fs/promises';
import { DependencyInfo } from '../types';

export async function exportReport(deps: DependencyInfo[]): Promise<void> {
  const report = {
    generatedAt: new Date().toISOString(),
    dependencies: deps.map(dep => ({
      ...dep,
      lastUpdate: dep.lastUpdate.toISOString(),
      bundleSizeFormatted: formatBytes(dep.bundleSize),
      gzipSizeFormatted: formatBytes(dep.gzipSize)
    }))
  };

  await writeFile(
    'dep-impact-report.json',
    JSON.stringify(report, null, 2),
    'utf-8'
  );
}

function formatBytes(bytes: number): string {
  const units = ['B', 'KB', 'MB'];
  let size = bytes;
  let unitIndex = 0;
  
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }
  
  return `${size.toFixed(1)} ${units[unitIndex]}`;
} 