import { Card } from '@/components/ui/card';
import { BookOpen, TrendingUp, Award, Scale } from 'lucide-react';
import { KPI_CORE_CONCEPTS } from '@/types/kpi';

export function CoreConceptsCard() {
  const concepts = [
    { key: 'kpi', icon: Award, color: 'hsl(var(--pie-blue))' },
    { key: 'quantitative', icon: TrendingUp, color: 'hsl(var(--pie-green))' },
    { key: 'qualitative', icon: BookOpen, color: 'hsl(var(--pie-purple))' },
    { key: 'weightage', icon: Scale, color: 'hsl(var(--pie-orange))' }
  ];

  return (
    <Card className="p-6 bg-gradient-to-br from-background to-muted/20">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2.5 bg-primary/10 rounded-lg">
          <BookOpen className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h3 className="text-xl font-bold" style={{ fontFamily: 'Roboto, sans-serif' }}>Core Concepts</h3>
          <p className="text-sm text-muted-foreground">Understanding Performance Metrics</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {concepts.map(({ key, icon: Icon, color }) => {
          const concept = KPI_CORE_CONCEPTS[key as keyof typeof KPI_CORE_CONCEPTS];
          return (
            <div key={key} className="p-4 rounded-lg border bg-card hover:shadow-md transition-shadow">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg" style={{ backgroundColor: `${color}20` }}>
                  <Icon className="h-5 w-5" style={{ color }} />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-sm mb-1.5" style={{ fontFamily: 'Roboto, sans-serif' }}>
                    {concept.title}
                  </h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {concept.description}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
