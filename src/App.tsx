import { useState, useEffect } from 'react';
import { Leaf, Settings, Github } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { Toaster } from '@/components/ui/sonner';
import { useKV } from '@github/spark/hooks';
import RepositoryInput from '@/components/RepositoryInput';
import AnalysisProgress from '@/components/AnalysisProgress';
import EcoImpactDashboard from '@/components/EcoImpactDashboard';
import SuggestionsPanel from '@/components/SuggestionsPanel';
import { analyzeRepository } from '@/lib/analysis';
import { Repository, AnalysisResult } from '@/lib/types';

type AppState = 'input' | 'analyzing' | 'results';

function App() {
  const [state, setState] = useState<AppState>('input');
  const [currentRepository, setCurrentRepository] = useState<Repository | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [progress, setProgress] = useState(0);
  const [analysisStage, setAnalysisStage] = useState('');
  
  // Persist analysis results
  const [savedResults, setSavedResults] = useKV<AnalysisResult[]>('eco-analysis-results', []);

  const handleRepositorySelected = async (repository: Repository) => {
    setCurrentRepository(repository);
    setState('analyzing');
    setProgress(0);
    
    // Simulate analysis progress
    const stages = [
      'Validating Repository',
      'Cloning Codebase', 
      'Language Detection',
      'Static Analysis',
      'Impact Calculation',
      'Report Generation'
    ];

    let currentProgress = 0;
    const progressInterval = setInterval(() => {
      currentProgress += Math.random() * 15 + 5;
      if (currentProgress > 100) currentProgress = 100;
      
      setProgress(currentProgress);
      const stageIndex = Math.floor((currentProgress / 100) * stages.length);
      setAnalysisStage(stages[stageIndex] || stages[stages.length - 1]);
      
      if (currentProgress >= 100) {
        clearInterval(progressInterval);
      }
    }, 300);

    try {
      const result = await analyzeRepository(repository);
      clearInterval(progressInterval);
      setProgress(100);
      setAnalysisResult(result);
      
      // Save to persistent storage
      setSavedResults(prev => {
        const filtered = prev.filter(r => 
          r.repository.url !== result.repository.url
        );
        return [result, ...filtered].slice(0, 10); // Keep last 10 results
      });
      
      setState('results');
    } catch (error) {
      clearInterval(progressInterval);
      console.error('Analysis failed:', error);
      setState('input');
    }
  };

  const handleStartOver = () => {
    setState('input');
    setCurrentRepository(null);
    setAnalysisResult(null);
    setProgress(0);
    setAnalysisStage('');
  };

  const handleLoadPreviousResult = (result: AnalysisResult) => {
    setAnalysisResult(result);
    setCurrentRepository(result.repository);
    setState('results');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Leaf className="h-8 w-8 text-primary" />
                <div>
                  <h1 className="text-2xl font-bold">EcoMode for Code</h1>
                  <p className="text-sm text-muted-foreground">Optimize code, reduce carbon footprint</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {state === 'results' && (
                <Button variant="outline" onClick={handleStartOver}>
                  Analyze Another
                </Button>
              )}
              <Button variant="ghost" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                  <Github className="h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {state === 'input' && (
          <div className="space-y-8">
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-4xl font-bold mb-4">
                Make Your Code <span className="text-primary">Planet-Friendly</span>
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                Analyze your GitHub repositories for energy efficiency opportunities and reduce your carbon footprint through intelligent code optimizations.
              </p>
            </div>
            
            <RepositoryInput 
              onRepositorySelected={handleRepositorySelected}
              isLoading={state === 'analyzing'}
            />

            {/* Previous Results */}
            {savedResults.length > 0 && (
              <div className="max-w-2xl mx-auto">
                <h3 className="text-lg font-semibold mb-4">Recent Analyses</h3>
                <div className="space-y-2">
                  {savedResults.slice(0, 5).map((result, index) => (
                    <Button
                      key={index}
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={() => handleLoadPreviousResult(result)}
                    >
                      <Github className="h-4 w-4 mr-2" />
                      {result.repository.owner}/{result.repository.name}
                      <span className="ml-auto text-xs text-muted-foreground">
                        {result.suggestions.length} suggestions
                      </span>
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {state === 'analyzing' && (
          <AnalysisProgress 
            isAnalyzing={true}
            progress={progress}
            stage={analysisStage}
          />
        )}

        {state === 'results' && analysisResult && (
          <div className="space-y-12">
            <EcoImpactDashboard analysis={analysisResult} />
            <SuggestionsPanel suggestions={analysisResult.suggestions} />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t bg-card/50 mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-sm text-muted-foreground">
            <p>
              Help reduce the environmental impact of software development, one repository at a time.
            </p>
            <p className="mt-2">
              Built with sustainable development practices in mind.
            </p>
          </div>
        </div>
      </footer>

      <Toaster />
    </div>
  );
}

export default App;