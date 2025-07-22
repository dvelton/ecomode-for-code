export interface Repository {
  url: string;
  owner: string;
  name: string;
  language: string;
  size: number;
}

export interface CodeSuggestion {
  id: string;
  title: string;
  description: string;
  category: 'algorithm' | 'memory' | 'network' | 'cpu' | 'storage';
  file: string;
  line: number;
  originalCode: string;
  refactoredCode: string;
  impact: {
    carbon: number; // kg CO2 saved
    water: number; // liters saved
    energy: number; // kWh saved
    cost: number; // $ saved
  };
}

export interface AnalysisResult {
  repository: Repository;
  suggestions: CodeSuggestion[];
  totalImpact: {
    carbon: number;
    water: number;
    energy: number;
    cost: number;
  };
  analysisTime: number;
  languages: string[];
}

export interface ScaleSettings {
  runs: number;
  label: string;
}

export interface UserSettings {
  cloudProvider: 'aws' | 'gcp' | 'azure' | 'generic';
  region: string;
  energySource: 'grid' | 'renewable' | 'mixed';
  customRunFrequency?: number;
}