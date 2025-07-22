import { useState } from 'react';
import { GitBranch, Search, Loader2 } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { validateGitHubUrl } from '@/lib/analysis';
import { Repository } from '@/lib/types';

interface RepositoryInputProps {
  onRepositorySelected: (repository: Repository) => void;
  isLoading: boolean;
}

export default function RepositoryInput({ onRepositorySelected, isLoading }: RepositoryInputProps) {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');
  const [validating, setValidating] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    setValidating(true);
    setError('');

    try {
      const repository = await validateGitHubUrl(url.trim());
      if (repository) {
        onRepositorySelected(repository);
      } else {
        setError('Please enter a valid GitHub repository URL');
      }
    } catch {
      setError('Failed to validate repository. Please try again.');
    } finally {
      setValidating(false);
    }
  };

  const exampleUrls = [
    'https://github.com/facebook/react',
    'https://github.com/microsoft/vscode',
    'https://github.com/nodejs/node'
  ];

  return (
    <Card className="w-full max-w-2xl mx-auto border-primary/20">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <GitBranch className="h-6 w-6 text-primary" />
          <CardTitle className="text-2xl">Analyze Repository</CardTitle>
        </div>
        <CardDescription>
          Enter a GitHub repository URL to analyze its code for energy efficiency opportunities
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <div className="flex gap-2">
              <Input
                placeholder="https://github.com/username/repository"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                disabled={isLoading || validating}
                className={error ? 'border-destructive' : 'focus:border-primary'}
              />
              <Button 
                type="submit" 
                disabled={!url.trim() || isLoading || validating}
                className="px-6"
              >
                {validating ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Search className="h-4 w-4" />
                )}
              </Button>
            </div>
            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Try these examples:</p>
            <div className="flex flex-wrap gap-2">
              {exampleUrls.map((exampleUrl) => (
                <Button
                  key={exampleUrl}
                  variant="outline"
                  size="sm"
                  type="button"
                  onClick={() => setUrl(exampleUrl)}
                  disabled={isLoading || validating}
                  className="text-xs"
                >
                  {exampleUrl.split('/').slice(-2).join('/')}
                </Button>
              ))}
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}