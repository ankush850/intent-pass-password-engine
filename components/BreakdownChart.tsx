'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ComponentScores } from '@/lib/analyzer/types';

interface BreakdownChartProps {
  scores: ComponentScores;
}

export function BreakdownChart({ scores }: BreakdownChartProps) {
  const data = [
    {
      name: 'Structural\nCoherence',
      value: Math.round(scores.structuralCoherence * 100),
      fullName: 'Structural Coherence',
    },
    {
      name: 'Entropy\nBalance',
      value: Math.round(scores.entropyBalance * 100),
      fullName: 'Entropy Balance',
    },
    {
      name: 'Predictability\nPenalty',
      value: Math.round((1 - scores.predictabilityPenalty) * 100),
      fullName: 'Predictability Score',
    },
    {
      name: 'Random Smash\nPenalty',
      value: Math.round((1 - scores.randomSmashPenalty) * 100),
      fullName: 'Random Smash Score',
    },
    {
      name: 'Visual\nAmbiguity',
      value: Math.round((1 - scores.visualAmbiguity) * 100),
      fullName: 'Visual Clarity',
    },
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border border-border rounded-lg p-2 shadow-lg">
          <p className="text-sm font-medium text-foreground">{payload[0].payload.fullName}</p>
          <p className="text-sm text-primary">{payload[0].value}%</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-background border border-border rounded-xl p-6">
      <h3 className="text-lg font-semibold text-foreground mb-4">Component Scores Breakdown</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 60 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis 
            dataKey="name" 
            tick={{ fontSize: 12 }}
            stroke="hsl(var(--muted-foreground))"
            angle={-45}
            textAnchor="end"
            height={100}
          />
          <YAxis 
            domain={[0, 100]} 
            stroke="hsl(var(--muted-foreground))"
            tick={{ fontSize: 12 }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar 
            dataKey="value" 
            fill="hsl(var(--primary))" 
            radius={[8, 8, 0, 0]}
            animationDuration={500}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
