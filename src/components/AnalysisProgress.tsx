import { useState } from 'react';
import { Loader2, CheckCircle } from '@phosphor-icons/react';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface AnalysisProgressProps {
  isAnalyzing: boolean;
  progress: number;
  stage: string;
}

export default function AnalysisProgress({ isAnalyzing, progress, stage }: AnalysisProgressProps) {
  if (!isAnalyzing && progress === 0) return null;

  const stages = [
    { name: 'Validating Repository', description: 'Checking repository access and structure' },
    { name: 'Cloning Codebase', description: 'Downloading repository contents for analysis' },
    { name: 'Language Detection', description: 'Identifying programming languages and frameworks' },
    { name: 'Static Analysis', description: 'Scanning code for efficiency patterns' },
    { name: 'Impact Calculation', description: 'Computing environmental and cost savings' },
    { name: 'Report Generation', description: 'Preparing optimization recommendations' }
  ];

  const currentStageIndex = Math.floor((progress / 100) * stages.length);
  const currentStage = stages[currentStageIndex] || stages[stages.length - 1];

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          {isAnalyzing ? (
            <Loader2 className="h-6 w-6 text-primary animate-spin" />
          ) : (
            <CheckCircle className="h-6 w-6 text-green-500" />
          )}
          <CardTitle className="text-xl">
            {isAnalyzing ? 'Analyzing Repository' : 'Analysis Complete'}
          </CardTitle>
        </div>
        <CardDescription>
          {isAnalyzing ? currentStage.description : 'Review your optimization recommendations below'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="font-medium">{currentStage.name}</span>
            <span className="text-muted-foreground">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <div className="space-y-2">
          {stages.map((stageItem, index) => {
            const isCompleted = index < currentStageIndex;
            const isCurrent = index === currentStageIndex;
            
            return (
              <div
                key={stageItem.name}
                className={`flex items-center gap-3 p-2 rounded-lg transition-colors ${
                  isCompleted ? 'bg-green-50 text-green-700' :
                  isCurrent ? 'bg-primary/10 text-primary' :
                  'text-muted-foreground'
                }`}
              >
                <div className={`h-2 w-2 rounded-full ${
                  isCompleted ? 'bg-green-500' :
                  isCurrent ? 'bg-primary animate-pulse' :
                  'bg-muted-foreground/30'
                }`} />
                <span className="text-sm font-medium">{stageItem.name}</span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}