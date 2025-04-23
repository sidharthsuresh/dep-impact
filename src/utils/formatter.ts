import chalk from 'chalk';
import { table } from 'table';
import { DependencyInfo } from '../types';

export function formatSize(bytes: number): string {
  const units = ['B', 'KB', 'MB'];
  let size = bytes;
  let unitIndex = 0;
  
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }
  
  return `${size.toFixed(1)} ${units[unitIndex]}`;
}

export function formatDependencyInfo(deps: DependencyInfo[]): string {
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
    chalk.bold(dep.name),
    dep.version,
    formatSize(dep.bundleSize),
    formatSize(dep.gzipSize),
    dep.lastUpdate.toLocaleDateString(),
    dep.hasESM ? chalk.green('✓') : chalk.red('✗'),
    dep.isTreeShakeable ? chalk.green('✓') : chalk.red('✗'),
    dep.transitiveDependencies.toString(),
    dep.alternatives.join(', ') || '-'
  ]);

  return table([headers, ...rows], {
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