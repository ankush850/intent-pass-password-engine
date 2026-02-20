'use client';

import { Radar, RadarChart as RechartRadar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

export interface RadarMetrics {
  structuralIntegrity: number;
  entropyQuality: number;
  patternAvoidance: number;
  intentionalityIndex: number;
  resilienceScore: number;
  behavioralBalance: number;
}

interface RadarChartProps {
  metrics: RadarMetrics;
}

export function RadarChartComponent({ metrics }: RadarChartProps) {
  const data = [
    {
      name: 'Structural Integrity',
      value: metrics.structuralIntegrity,
      fullMark: 100,
    },
    {
      name: 'Entropy Quality',
      value: metrics.entropyQuality,
      fullMark: 100,
    },
    {
      name: 'Pattern Avoidance',
      value: metrics.patternAvoidance,
      fullMark: 100,
    },
    {
      name: 'Intentionality',
      value: metrics.intentionalityIndex,
      fullMark: 100,
    },
    {
      name: 'Resilience',
      value: metrics.resilienceScore,
      fullMark: 100,
    },
    {
      name: 'Behavioral Balance',
      value: metrics.behavioralBalance,
      fullMark: 100,
    },
  ];

  return (
    <div className="w-full h-96 bg-background border border-border rounded-lg p-4">
      <h3 className="text-sm font-semibold text-foreground mb-4">Password Quality Radar</h3>
      <ResponsiveContainer width="100%" height="100%">
        <RechartRadar data={data}>
          <PolarGrid stroke="hsl(var(--border))" />
          <PolarAngleAxis 
            dataKey="name" 
            tick={{ fill: 'hsl(var(--foreground))', fontSize: 12 }}
          />
          <PolarRadiusAxis 
            angle={90} 
            domain={[0, 100]}
            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
          />
          <Radar 
            name="Score" 
            dataKey="value" 
            stroke="hsl(var(--primary))" 
            fill="hsl(var(--primary))" 
            fillOpacity={0.6}
          />
        </RechartRadar>
      </ResponsiveContainer>
    </div>
  );
}
