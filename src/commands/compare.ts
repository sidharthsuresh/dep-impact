import chalk from 'chalk';
import ora from 'ora';
import { table } from 'table';
import { fetchNpmMetadata } from '../services/npmDataFetcher';
import { analyzeBundleSize } from '../services/bundleAnalyzer';
import { formatSize } from '../utils/formatter';

export async function comparePackages(package1: string, package2: string): Promise<void> {
  const spinner = ora('Analyzing packages...').start();
  
  try {
    const [pkg1Data, pkg2Data] = await Promise.all([
      analyzePackageData(package1),
      analyzePackageData(package2)
    ]);
    
    spinner.succeed('Analysis complete!');
    
    const headers = ['Metric', package1, package2, 'Difference'];
    const rows = [
      ['Bundle Size', 
       formatSize(pkg1Data.size),
       formatSize(pkg2Data.size),
       formatSizeDiff(pkg1Data.size, pkg2Data.size)
      ],
      ['Gzip Size',
       formatSize(pkg1Data.gzipSize),
       formatSize(pkg2Data.gzipSize),
       formatSizeDiff(pkg1Data.gzipSize, pkg2Data.gzipSize)
      ],
      ['Dependencies',
       pkg1Data.dependencies.length.toString(),
       pkg2Data.dependencies.length.toString(),
       formatDiff(pkg1Data.dependencies.length, pkg2Data.dependencies.length)
      ],
      ['ESM Support',
       pkg1Data.hasESM ? chalk.green('✓') : chalk.red('✗'),
       pkg2Data.hasESM ? chalk.green('✓') : chalk.red('✗'),
       '-'
      ],
      ['Tree-Shakeable',
       pkg1Data.isTreeShakeable ? chalk.green('✓') : chalk.red('✗'),
       pkg2Data.isTreeShakeable ? chalk.green('✓') : chalk.red('✗'),
       '-'
      ]
    ];
    
    console.log(table([headers, ...rows]));
    
  } catch (error) {
    spinner.fail('Comparison failed');
    throw error;
  }
}

async function analyzePackageData(packageName: string) {
  const npmData = await fetchNpmMetadata(packageName);
  const bundleData = await analyzeBundleSize(packageName, 'latest');
  
  return {
    ...npmData,
    ...bundleData
  };
}

function formatSizeDiff(size1: number, size2: number): string {
  const diff = size2 - size1;
  if (diff === 0) return chalk.gray('No difference');
  
  const formattedDiff = formatSize(Math.abs(diff));
  return diff > 0
    ? chalk.red(`+${formattedDiff}`)
    : chalk.green(`-${formattedDiff}`);
}

function formatDiff(val1: number, val2: number): string {
  const diff = val2 - val1;
  if (diff === 0) return chalk.gray('No difference');
  
  return diff > 0
    ? chalk.red(`+${diff}`)
    : chalk.green(`${diff}`);
} 