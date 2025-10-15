import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { InfoIcon } from 'lucide-react';
import { KPIDefinition } from '@/types/kpi';

interface KPICardProps {
  kpi: KPIDefinition;
  currentValue: number;
  icon?: React.ReactNode;
}

export function KPICard({ kpi, currentValue, icon }: KPICardProps) {
  const progressPercentage = (currentValue / kpi.targetValue) * 100;
  const isOnTrack = currentValue >= kpi.targetValue * 0.9;
  const isExcellent = currentValue >= kpi.targetValue;

  return (
    <Card className="p-5 hover:shadow-lg transition-all duration-200 border-l-4" 
          style={{ 
            borderLeftColor: isExcellent ? 'hsl(var(--pie-green))' : isOnTrack ? 'hsl(var(--pie-blue))' : 'hsl(var(--pie-orange))'
          }}>
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2 flex-1">
            {icon && <div className="p-2 bg-primary/10 rounded-lg">{icon}</div>}
            <div className="flex-1">
              <h4 className="font-semibold text-base leading-tight" style={{ fontFamily: 'Roboto, sans-serif' }}>
                {kpi.name}
              </h4>
              <p className="text-xs text-muted-foreground mt-0.5">
                Weight: {kpi.weight}% • {kpi.type === 'quantitative' ? 'Quantitative' : 'Qualitative'}
              </p>
            </div>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="p-1.5 hover:bg-muted rounded-md transition-colors">
                  <InfoIcon className="h-4 w-4 text-muted-foreground" />
                </button>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs" side="left">
                <p className="text-sm">{kpi.description}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Current: <strong>{currentValue}{kpi.unit}</strong></span>
            <span className="text-muted-foreground">Target: <strong>{kpi.targetValue}{kpi.unit}</strong></span>
          </div>
          <Progress value={Math.min(100, progressPercentage)} className="h-2" />
          <div className="flex items-center justify-between text-xs">
            <span className={isExcellent ? 'text-green-600 font-medium' : isOnTrack ? 'text-blue-600 font-medium' : 'text-orange-600 font-medium'}>
              {isExcellent ? '✓ Target Achieved' : isOnTrack ? '→ On Track' : '⚠ Needs Improvement'}
            </span>
            <span className="text-muted-foreground">{Math.round(progressPercentage)}%</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
