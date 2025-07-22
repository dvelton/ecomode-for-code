import { useState } from 'react';
import { Copy, ExternalLink, Leaf, TrendingUp, Code, Check } from '@phosphor-icons/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CodeSuggestion } from '@/lib/types';
import { formatImpactValue } from '@/lib/analysis';

interface SuggestionsPanelProps {
  suggestions: CodeSuggestion[];
}

const CATEGORY_CONFIG = {
  algorithm: { label: 'Algorithm', color: 'bg-blue-100 text-blue-800', icon: TrendingUp },
  memory: { label: 'Memory', color: 'bg-green-100 text-green-800', icon: Leaf },
  network: { label: 'Network', color: 'bg-purple-100 text-purple-800', icon: ExternalLink },
  cpu: { label: 'CPU', color: 'bg-orange-100 text-orange-800', icon: Code },
  storage: { label: 'Storage', color: 'bg-indigo-100 text-indigo-800', icon: Code }
};

export default function SuggestionsPanel({ suggestions }: SuggestionsPanelProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const categories = Object.keys(CATEGORY_CONFIG) as Array<keyof typeof CATEGORY_CONFIG>;
  const categorizedSuggestions = categories.reduce((acc, category) => {
    acc[category] = suggestions.filter(s => s.category === category);
    return acc;
  }, {} as Record<string, CodeSuggestion[]>);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-2">Optimization Suggestions</h2>
        <p className="text-muted-foreground">
          {suggestions.length} recommendations to reduce your code's environmental impact
        </p>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="all">All ({suggestions.length})</TabsTrigger>
          {categories.map((category) => (
            <TabsTrigger key={category} value={category}>
              {CATEGORY_CONFIG[category].label} ({categorizedSuggestions[category].length})
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {suggestions.map((suggestion) => (
            <SuggestionCard 
              key={suggestion.id} 
              suggestion={suggestion} 
              copiedId={copiedId}
              onCopy={copyToClipboard}
            />
          ))}
        </TabsContent>

        {categories.map((category) => (
          <TabsContent key={category} value={category} className="space-y-4">
            {categorizedSuggestions[category].length > 0 ? (
              categorizedSuggestions[category].map((suggestion) => (
                <SuggestionCard 
                  key={suggestion.id} 
                  suggestion={suggestion} 
                  copiedId={copiedId}
                  onCopy={copyToClipboard}
                />
              ))
            ) : (
              <Card className="text-center py-8">
                <CardContent>
                  <p className="text-muted-foreground">
                    No {CATEGORY_CONFIG[category].label.toLowerCase()} optimizations found
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

interface SuggestionCardProps {
  suggestion: CodeSuggestion;
  copiedId: string | null;
  onCopy: (text: string, id: string) => void;
}

function SuggestionCard({ suggestion, copiedId, onCopy }: SuggestionCardProps) {
  const categoryConfig = CATEGORY_CONFIG[suggestion.category];
  const Icon = categoryConfig.icon;

  return (
    <Card className="border-l-4 border-l-primary">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Icon className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">{suggestion.title}</CardTitle>
            </div>
            <CardDescription className="text-base">
              {suggestion.description}
            </CardDescription>
            <div className="flex items-center gap-2">
              <Badge className={categoryConfig.color}>
                {categoryConfig.label}
              </Badge>
              <Badge variant="outline">
                {suggestion.file}:{suggestion.line}
              </Badge>
            </div>
          </div>
          <div className="text-right space-y-1">
            <div className="text-sm font-medium text-primary">
              {formatImpactValue(suggestion.impact.carbon, 'kg CO₂')} saved
            </div>
            <div className="text-xs text-muted-foreground">
              {formatImpactValue(suggestion.impact.cost, '$')} cost reduction
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-destructive">Current Code</h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onCopy(suggestion.originalCode, `${suggestion.id}-original`)}
                className="h-8 w-8 p-0"
              >
                {copiedId === `${suggestion.id}-original` ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
            <pre className="bg-muted p-3 rounded-lg text-sm font-mono overflow-x-auto border border-destructive/20">
              <code>{suggestion.originalCode}</code>
            </pre>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-primary">Optimized Code</h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onCopy(suggestion.refactoredCode, `${suggestion.id}-refactored`)}
                className="h-8 w-8 p-0"
              >
                {copiedId === `${suggestion.id}-refactored` ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
            <pre className="bg-muted p-3 rounded-lg text-sm font-mono overflow-x-auto border border-primary/20">
              <code>{suggestion.refactoredCode}</code>
            </pre>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t">
          <div className="text-center">
            <div className="text-lg font-semibold text-green-600">
              {formatImpactValue(suggestion.impact.carbon, '')}
            </div>
            <div className="text-xs text-muted-foreground">kg CO₂ saved</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-blue-600">
              {formatImpactValue(suggestion.impact.water, '')}
            </div>
            <div className="text-xs text-muted-foreground">liters saved</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-yellow-600">
              {formatImpactValue(suggestion.impact.energy, '')}
            </div>
            <div className="text-xs text-muted-foreground">kWh saved</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-green-600">
              {formatImpactValue(suggestion.impact.cost, '$')}
            </div>
            <div className="text-xs text-muted-foreground">cost saved</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}