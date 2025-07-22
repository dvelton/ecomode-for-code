import { CodeSuggestion, Repository, AnalysisResult } from './types';

// Mock GitHub API
export async function validateGitHubUrl(url: string): Promise<Repository | null> {
  try {
    const urlPattern = /github\.com\/([^\/]+)\/([^\/]+)/;
    const match = url.match(urlPattern);
    
    if (!match) return null;
    
    const [, owner, name] = match;
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      url,
      owner,
      name: name.replace('.git', ''),
      language: 'JavaScript', // Mock language detection
      size: Math.floor(Math.random() * 10000) + 1000
    };
  } catch {
    return null;
  }
}

// Mock code analysis engine
export async function analyzeRepository(repository: Repository): Promise<AnalysisResult> {
  // Simulate analysis time
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  const mockSuggestions: CodeSuggestion[] = [
    {
      id: '1',
      title: 'Replace nested loops with more efficient algorithm',
      description: 'Current O(n²) complexity can be reduced to O(n log n) using sorting',
      category: 'algorithm',
      file: 'src/utils/search.js',
      line: 45,
      originalCode: `// O(n²) approach
for (let i = 0; i < items.length; i++) {
  for (let j = 0; j < items.length; j++) {
    if (items[i].id === items[j].relatedId) {
      matches.push([items[i], items[j]]);
    }
  }
}`,
      refactoredCode: `// O(n log n) approach with Map
const idMap = new Map(items.map(item => [item.id, item]));
const matches = items
  .filter(item => idMap.has(item.relatedId))
  .map(item => [item, idMap.get(item.relatedId)]);`,
      impact: {
        carbon: 0.024,
        water: 0.18,
        energy: 0.012,
        cost: 0.0048
      }
    },
    {
      id: '2',
      title: 'Implement lazy loading for large datasets',
      description: 'Loading all data upfront wastes memory and network resources',
      category: 'memory',
      file: 'src/components/DataTable.js',
      line: 23,
      originalCode: `// Loading all data at once
const [data, setData] = useState([]);

useEffect(() => {
  fetch('/api/data')
    .then(res => res.json())
    .then(setData);
}, []);`,
      refactoredCode: `// Lazy loading with pagination
const [data, setData] = useState([]);
const [page, setPage] = useState(0);

const loadPage = useCallback(async (pageNum) => {
  const res = await fetch(\`/api/data?page=\${pageNum}&limit=50\`);
  const newData = await res.json();
  setData(prev => [...prev, ...newData]);
}, []);`,
      impact: {
        carbon: 0.156,
        water: 1.2,
        energy: 0.078,
        cost: 0.031
      }
    },
    {
      id: '3',
      title: 'Add response caching for API calls',
      description: 'Repeated API calls can be cached to reduce network usage',
      category: 'network',
      file: 'src/services/api.js',
      line: 12,
      originalCode: `// No caching
export async function fetchUserData(id) {
  const response = await fetch(\`/api/users/\${id}\`);
  return response.json();
}`,
      refactoredCode: `// With caching
const cache = new Map();

export async function fetchUserData(id) {
  if (cache.has(id)) {
    return cache.get(id);
  }
  
  const response = await fetch(\`/api/users/\${id}\`);
  const data = await response.json();
  cache.set(id, data);
  return data;
}`,
      impact: {
        carbon: 0.089,
        water: 0.67,
        energy: 0.045,
        cost: 0.018
      }
    },
    {
      id: '4',
      title: 'Optimize image processing with WebP format',
      description: 'Using modern image formats reduces file size and bandwidth',
      category: 'storage',
      file: 'src/utils/images.js',
      line: 67,
      originalCode: `// Using PNG/JPEG only
function processImage(file) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  // ... processing logic
  return canvas.toDataURL('image/png');
}`,
      refactoredCode: `// Using WebP with fallback
function processImage(file) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  // ... processing logic
  
  // Try WebP first, fallback to PNG
  if (canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0) {
    return canvas.toDataURL('image/webp', 0.8);
  }
  return canvas.toDataURL('image/png');
}`,
      impact: {
        carbon: 0.203,
        water: 1.5,
        energy: 0.102,
        cost: 0.041
      }
    }
  ];

  const totalImpact = mockSuggestions.reduce(
    (acc, suggestion) => ({
      carbon: acc.carbon + suggestion.impact.carbon,
      water: acc.water + suggestion.impact.water,
      energy: acc.energy + suggestion.impact.energy,
      cost: acc.cost + suggestion.impact.cost
    }),
    { carbon: 0, water: 0, energy: 0, cost: 0 }
  );

  return {
    repository,
    suggestions: mockSuggestions,
    totalImpact,
    analysisTime: 2847, // ms
    languages: ['JavaScript', 'TypeScript', 'CSS']
  };
}

// Energy calculation utilities
export function calculateScaledImpact(baseImpact: any, scale: number) {
  return {
    carbon: baseImpact.carbon * scale,
    water: baseImpact.water * scale,
    energy: baseImpact.energy * scale,
    cost: baseImpact.cost * scale
  };
}

export function formatImpactValue(value: number, unit: string): string {
  if (value < 0.001) return `<0.001 ${unit}`;
  if (value < 1) return `${value.toFixed(3)} ${unit}`;
  if (value < 10) return `${value.toFixed(2)} ${unit}`;
  if (value < 100) return `${value.toFixed(1)} ${unit}`;
  return `${Math.round(value)} ${unit}`;
}