import { analyzePackage } from '../analyzers/packageAnalyzer';
import { mockNpmMetadata, mockBundleData } from './mocks';

// Mock the dependencies
jest.mock('../services/npmDataFetcher', () => ({
  fetchNpmMetadata: jest.fn().mockImplementation((name) => mockNpmMetadata[name])
}));

jest.mock('../services/bundleAnalyzer', () => ({
  analyzeBundleSize: jest.fn().mockImplementation((name) => mockBundleData[name])
}));

jest.mock('fs/promises', () => ({
  readFile: jest.fn().mockResolvedValue(JSON.stringify({
    dependencies: {
      'lodash': '^4.17.21',
      'axios': '^1.6.7'
    }
  }))
}));

describe('Package Analyzer', () => {
  it('should analyze package dependencies correctly', async () => {
    const results = await analyzePackage('/test/path');
    
    expect(results).toHaveLength(2);
    expect(results[0]).toMatchObject({
      name: 'lodash',
      version: '^4.17.21',
      bundleSize: expect.any(Number),
      gzipSize: expect.any(Number),
      hasESM: expect.any(Boolean),
      isTreeShakeable: expect.any(Boolean),
      transitiveDependencies: expect.any(Number),
      alternatives: expect.any(Array)
    });
  });

  it('should handle missing package.json', async () => {
    const mockReadFile = require('fs/promises').readFile;
    mockReadFile.mockRejectedValueOnce(new Error('File not found'));
    
    await expect(analyzePackage('/test/path')).rejects.toThrow('File not found');
  });
}); 