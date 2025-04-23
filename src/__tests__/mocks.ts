export const mockNpmMetadata = {
  'lodash': {
    lastUpdate: new Date('2021-04-02'),
    hasESM: false,
    dependencies: []
  },
  'axios': {
    lastUpdate: new Date('2023-01-01'),
    hasESM: true,
    dependencies: ['follow-redirects']
  }
};

export const mockBundleData = {
  'lodash': {
    size: 531200,
    gzipSize: 71000,
    isTreeShakeable: false
  },
  'axios': {
    size: 120000,
    gzipSize: 35000,
    isTreeShakeable: true
  }
}; 