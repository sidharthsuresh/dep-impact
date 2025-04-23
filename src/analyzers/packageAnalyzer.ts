import { readFile } from 'fs/promises';
import { join } from 'path';
import ora from 'ora';
import { fetchNpmMetadata } from '../services/npmDataFetcher';
import { analyzeBundleSize } from '../services/bundleAnalyzer';
import { DependencyInfo, PackageJson } from '../types';
import { formatSize } from '../utils/formatter';

export async function analyzePackage(projectPath: string): Promise<DependencyInfo[]> {
  const spinner = ora('Reading package.json...').start();
  
  try {
    const packageJsonPath = join(projectPath, 'package.json');
    const packageJsonContent = await readFile(packageJsonPath, 'utf-8');
    const packageJson: PackageJson = JSON.parse(packageJsonContent);
    
    const dependencies = {
      ...packageJson.dependencies,
      ...packageJson.devDependencies
    };
    
    spinner.text = 'Analyzing dependencies...';
    
    const results: DependencyInfo[] = [];
    
    for (const [name, version] of Object.entries(dependencies)) {
      spinner.text = `Analyzing ${name}...`;
      
      const [npmData, bundleData] = await Promise.all([
        fetchNpmMetadata(name),
        analyzeBundleSize(name, version)
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
    
  } catch (error) {
    spinner.fail('Analysis failed');
    throw error;
  }
}

async function findAlternatives(packageName: string): Promise<string[]> {
  // Map of known alternatives for popular packages
  const knownAlternatives: Record<string, string[]> = {
    'moment': ['date-fns', 'dayjs', 'luxon'],
    'lodash': ['ramda', 'underscore', 'radash'],
    'axios': ['ky', 'got', 'node-fetch'],
    'request': ['node-fetch', 'got', 'undici']
  };
  
  return knownAlternatives[packageName] || [];
} 