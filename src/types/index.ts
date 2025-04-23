export interface PackageJson {
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
}

export interface DependencyInfo {
  name: string;
  version: string;
  bundleSize: number;
  gzipSize: number;
  lastUpdate: Date;
  hasESM: boolean;
  isTreeShakeable: boolean;
  transitiveDependencies: number;
  alternatives: string[];
}

export interface BundleAnalysis {
  size: number;
  gzipSize: number;
  isTreeShakeable: boolean;
}

export interface NpmMetadata {
  lastUpdate: Date;
  hasESM: boolean;
  dependencies: string[];
} 