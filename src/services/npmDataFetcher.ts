import axios from 'axios';
import { NpmMetadata } from '../types';

const NPM_REGISTRY_URL = 'https://registry.npmjs.org';

export async function fetchNpmMetadata(packageName: string): Promise<NpmMetadata> {
  try {
    const response = await axios.get(`${NPM_REGISTRY_URL}/${packageName}`);
    const data = response.data;
    
    const latestVersion = data['dist-tags'].latest;
    const latestVersionData = data.versions[latestVersion];
    
    // Check for ESM support through various indicators
    const hasESM = Boolean(
      latestVersionData.module ||
      latestVersionData.type === 'module' ||
      latestVersionData.exports
    );
    
    return {
      lastUpdate: new Date(data.time[latestVersion]),
      hasESM,
      dependencies: Object.keys(latestVersionData.dependencies || {})
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`Failed to fetch npm metadata for ${packageName}: ${error.message}`);
    }
    throw error;
  }
} 