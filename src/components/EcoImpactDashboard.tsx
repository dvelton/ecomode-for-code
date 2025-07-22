import { Leaf, Droplets, Zap, DollarSign } from '@phosphor-icons/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { calculateScaledImpact, formatImpactValue } from '@/lib/analysis';
import { AnalysisResult, ScaleSettings } from '@/lib/types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface EcoImpactDashboardProps {
  analysis: AnalysisResult;
}

const SCALE_OPTIONS: ScaleSettings[] = [
  { runs: 100, label: '100 runs' },
  { runs: 10000, label: '10K runs' },
  { runs: 1000000, label: '1M runs' }
];

const CHART_COLORS = ['oklch(0.45 0.15 142)', 'oklch(0.55 0.12 240)', 'oklch(0.75 0.18 130)', 'oklch(0.65 0.2 25)'];

export default function EcoImpactDashboard({ analysis }: EcoImpactDashboardProps) {
  const { totalImpact, suggestions } = analysis;

  const createScaleData = (scale: number) => {
    const scaled = calculateScaledImpact(totalImpact, scale);
    return [
      { name: 'Carbon', value: scaled.carbon, unit: 'kg CO₂', icon: Leaf, color: CHART_COLORS[0] },
      { name: 'Water', value: scaled.water, unit: 'liters', icon: Droplets, color: CHART_COLORS[1] },
      { name: 'Energy', value: scaled.energy, unit: 'kWh', icon: Zap, color: CHART_COLORS[2] },
      { name: 'Cost', value: scaled.cost, unit: '$', icon: DollarSign, color: CHART_COLORS[3] }
    ];
  };

  const categoryData = suggestions.reduce((acc, suggestion) => {
    const category = suggestion.category;
    if (!acc[category]) {
      acc[category] = { carbon: 0, count: 0 };
    }
    acc[category].carbon += suggestion.impact.carbon;
    acc[category].count += 1;
    return acc;
  }, {} as Record<string, { carbon: number; count: number }>);

  const pieData = Object.entries(categoryData).map(([category, data]) => ({
    name: category,
    value: data.carbon,
    count: data.count
  }));

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-2">Environmental Impact Analysis</h2>
        <p className="text-muted-foreground">
          Potential savings from implementing {suggestions.length} optimization suggestions
        </p>
      </div>

      <Tabs defaultValue="100" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          {SCALE_OPTIONS.map((scale) => (
            <TabsTrigger key={scale.runs} value={scale.runs.toString()}>
              {scale.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {SCALE_OPTIONS.map((scale) => {
          const scaleData = createScaleData(scale.runs);
          
          return (
            <TabsContent key={scale.runs} value={scale.runs.toString()} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {scaleData.map((metric) => {
                  const Icon = metric.icon;
                  return (
                    <Card key={metric.name} className="border-l-4" style={{ borderLeftColor: metric.color }}>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{metric.name} Saved</CardTitle>
                        <Icon className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold" style={{ color: metric.color }}>
                          {formatImpactValue(metric.value, metric.unit)}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Per {scale.label.toLowerCase()}
                        </p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Impact by Metric</CardTitle>
                    <CardDescription>Comparative savings across all categories</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={scaleData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip 
                          formatter={(value: number, name: string) => [
                            formatImpactValue(value, scaleData.find(d => d.name === name)?.unit || ''),
                            name
                          ]}
                        />
                        <Bar dataKey="value" fill="oklch(0.45 0.15 142)" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Savings by Category</CardTitle>
                    <CardDescription>Carbon footprint reduction by optimization type</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip 
                          formatter={(value: number) => [
                            `${formatImpactValue(value * scale.runs, 'kg CO₂')}`,
                            'Carbon Saved'
                          ]}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Repository Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-4 text-sm">
                    <div>
                      <span className="font-medium">Repository:</span> {analysis.repository.owner}/{analysis.repository.name}
                    </div>
                    <div>
                      <span className="font-medium">Primary Language:</span> {analysis.repository.language}
                    </div>
                    <div>
                      <span className="font-medium">Analysis Time:</span> {(analysis.analysisTime / 1000).toFixed(1)}s
                    </div>
                    <div>
                      <span className="font-medium">Languages Found:</span>{' '}
                      {analysis.languages.map((lang) => (
                        <Badge key={lang} variant="secondary" className="ml-1">
                          {lang}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
}