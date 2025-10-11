import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calculator } from 'lucide-react';
import KPICalculator from '@/components/KPICalculator';
import KPIAnalytics from '@/components/KPIAnalytics';
import { expandedTimelineData, expandedDistributionData, expandedCategoryBreakdown, expandedStatistics } from '@/data/expandedKPIData';

export default function KPIScoring() {
  const [selectedRole, setSelectedRole] = useState<'hq_staff' | 'field_unit' | 'division_head'>('hq_staff');

  const analyticsData = {
    timeline: expandedTimelineData[selectedRole],
    distribution: expandedDistributionData[selectedRole],
    categoryBreakdown: expandedCategoryBreakdown[selectedRole],
    stats: expandedStatistics[selectedRole]
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 space-y-6 max-w-7xl">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-primary to-accent rounded-xl shadow-lg">
            <Calculator className="h-7 w-7 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              KPI Scoring System
            </h1>
            <p className="text-muted-foreground">
              Comprehensive scoring calculator with analytics & backend integration
            </p>
          </div>
        </div>

        <Tabs defaultValue="calculator" className="space-y-6">
          <TabsList className="grid grid-cols-3 w-full max-w-xl">
            <TabsTrigger value="calculator">Calculator</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="roles">By Role</TabsTrigger>
          </TabsList>

          <TabsContent value="calculator" className="space-y-6">
            <KPICalculator role={selectedRole} />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <KPIAnalytics data={analyticsData} role={selectedRole} />
          </TabsContent>

          <TabsContent value="roles" className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div onClick={() => setSelectedRole('hq_staff')} className="cursor-pointer">
              <KPICalculator role="hq_staff" />
            </div>
            <div onClick={() => setSelectedRole('field_unit')} className="cursor-pointer">
              <KPICalculator role="field_unit" />
            </div>
            <div onClick={() => setSelectedRole('division_head')} className="cursor-pointer">
              <KPICalculator role="division_head" />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
