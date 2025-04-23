import axios from 'axios';
import { BundleAnalysis } from '../types';

const BUNDLEPHOBIA_API = 'https://bundlephobia.com/api/size';

export async function analyzeBundleSize(packageName: string, version: string): Promise<BundleAnalysis> {
  try {
    const response = await axios.get(`${BUNDLEPHOBIA_API}?package=${packageName}@${version}`);
    const data = response.data;
    
    return {
      size: data.size,
      gzipSize: data.gzip,
      isTreeShakeable: data.hasJSModule || data.hasJSNext || data.hasSideEffects === false
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`Failed to analyze bundle size for ${packageName}@${version}: ${error.message}`);
    }
    throw error;
  }
} 