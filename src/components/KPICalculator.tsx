import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calculator, Info } from 'lucide-react';
import { HQ_STAFF_KPIS, FIELD_UNIT_KPIS, DIVISION_HEAD_KPIS, KPIDefinition } from '@/types/kpi';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface KPICalculatorProps {
  role: 'hq_staff' | 'field_unit' | 'division_head';
  onCalculate?: (score: number, breakdown: Record<string, number>) => void;
}

export default function KPICalculator({ role, onCalculate }: KPICalculatorProps) {
  const kpis = role === 'hq_staff' ? HQ_STAFF_KPIS : 
               role === 'field_unit' ? FIELD_UNIT_KPIS : 
               DIVISION_HEAD_KPIS;

  const [scores, setScores] = useState<Record<string, number>>(
    kpis.reduce((acc, kpi) => ({ ...acc, [kpi.id]: 0 }), {})
  );
  const [finalScore, setFinalScore] = useState<number | null>(null);
  const [breakdown, setBreakdown] = useState<Record<string, number>>({});

  const calculateScore = () => {
    let total = 0;
    const calculationBreakdown: Record<string, number> = {};

    kpis.forEach((kpi) => {
      const score = scores[kpi.id] || 0;
      const weightedScore = (score * kpi.weight) / 100;
      total += weightedScore;
      calculationBreakdown[kpi.name] = weightedScore;
    });

    setFinalScore(total);
    setBreakdown(calculationBreakdown);
    onCalculate?.(total, calculationBreakdown);
  };

  const updateScore = (kpiId: string, value: string) => {
    const numValue = parseFloat(value) || 0;
    setScores({ ...scores, [kpiId]: numValue });
  };

  const getRoleTitle = () => {
    if (role === 'hq_staff') return 'HQ Staff KPI Calculator';
    if (role === 'field_unit') return 'Field Unit KPI Calculator';
    return 'Division Head KPI Calculator';
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 bg-gradient-to-br from-primary to-accent rounded-lg">
          <Calculator className="h-5 w-5 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold" style={{ fontFamily: 'Roboto, sans-serif' }}>
            {getRoleTitle()}
          </h3>
          <p className="text-sm text-muted-foreground">
            Interactive scoring calculator with weighted formula
          </p>
        </div>
      </div>

      <div className="space-y-4 mb-6">
        {kpis.map((kpi) => (
          <div key={kpi.id} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Label htmlFor={kpi.id} className="font-medium">
                  {kpi.name}
                </Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p className="text-xs">{kpi.description}</p>
                      <p className="text-xs mt-1 font-semibold">
                        Weight: {kpi.weight}% | Target: {kpi.targetValue} {kpi.unit}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <span className="text-sm font-semibold text-primary">{kpi.weight}%</span>
            </div>
            <div className="flex items-center gap-2">
              <Input
                id={kpi.id}
                type="number"
                min="0"
                max="100"
                value={scores[kpi.id] || ''}
                onChange={(e) => updateScore(kpi.id, e.target.value)}
                placeholder={`Enter score (Target: ${kpi.targetValue})`}
                className="flex-1"
              />
              <span className="text-sm text-muted-foreground min-w-[60px]">
                {kpi.unit}
              </span>
            </div>
          </div>
        ))}
      </div>

      <Button 
        onClick={calculateScore} 
        className="w-full mb-6"
        size="lg"
      >
        <Calculator className="h-4 w-4 mr-2" />
        Calculate Final KPI Score
      </Button>

      {finalScore !== null && (
        <div className="space-y-4">
          <div className="p-6 bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg border-2 border-primary/20">
            <p className="text-sm text-muted-foreground mb-2">Final KPI Score</p>
            <p className={`text-4xl font-bold ${getScoreColor(finalScore)}`}>
              {finalScore.toFixed(2)}
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Formula: Σ(Score × Weight) ÷ 100
            </p>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-semibold mb-3">Score Breakdown:</p>
            {Object.entries(breakdown).map(([name, value]) => (
              <div key={name} className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">{name}</span>
                <span className="font-semibold">{value.toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="p-4 bg-muted/50 rounded-lg">
            <p className="text-xs text-muted-foreground">
              <strong>Example:</strong> If File Disposal = 95 (20% weight), TAT = 80 (15% weight), 
              the calculation would be: (95 × 0.20) + (80 × 0.15) = 19 + 12 = 31 points
            </p>
          </div>
        </div>
      )}
    </Card>
  );
}