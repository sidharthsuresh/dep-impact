import axios from 'axios';
import { analyzeBundleSize } from './bundleAnalyzer';

interface VersionData {
  version: string;
  size: number;
  date: Date;
}

export async function analyzeBundleTrend(packageName: string, versionCount: number = 5): Promise<VersionData[]> {
  try {
    const response = await axios.get(`https://registry.npmjs.org/${packageName}`);
    const data = response.data;
    
    // Get the last N versions
    const versions = Object.keys(data.versions)
      .sort((a, b) => new Date(data.time[b]).getTime() - new Date(data.time[a]).getTime())
      .slice(0, versionCount);
    
    const trendData: VersionData[] = [];
    
    for (const version of versions) {
      const bundleData = await analyzeBundleSize(packageName, version);
      trendData.push({
        version,
        size: bundleData.size,
        date: new Date(data.time[version])
      });
    }
    
    return trendData;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`Failed to analyze bundle trend for ${packageName}: ${error.message}`);
    }
    throw error;
  }
} 