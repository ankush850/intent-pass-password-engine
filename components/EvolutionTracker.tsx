'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export interface PasswordVersion {
  version: number;
  password: string;
  score: number;
  entropy: number;
  intentionality: number;
  timestamp: Date;
}

interface EvolutionTrackerProps {
  versions: PasswordVersion[];
}

export function EvolutionTracker({ versions }: EvolutionTrackerProps) {
  if (versions.length < 2) {
    return (
      <div className="bg-muted border border-border rounded-lg p-4 text-center">
        <p className="text-sm text-muted-foreground">
          Create multiple password versions to track evolution over time
        </p>
      </div>
    );
  }

  const data = versions.map((v, idx) => ({
    version: `V${idx + 1}`,
    score: v.score,
    entropy: v.entropy,
    intentionality: Math.max(0, (v.intentionality + 1) * 50),
  }));

  return (
    <div className="bg-background border border-border rounded-lg p-4">
      <h3 className="font-semibold text-foreground mb-4">Password Evolution</h3>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="version"
              tick={{ fill: 'hsl(var(--foreground))', fontSize: 12 }}
            />
            <YAxis
              tick={{ fill: 'hsl(var(--foreground))', fontSize: 12 }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--background))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '0.5rem',
              }}
              labelStyle={{ color: 'hsl(var(--foreground))' }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="score"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              dot={{ fill: 'hsl(var(--primary))', r: 4 }}
              name="Overall Score"
            />
            <Line
              type="monotone"
              dataKey="entropy"
              stroke="hsl(var(--amber-500))"
              strokeWidth={2}
              dot={{ fill: 'hsl(var(--amber-500))', r: 4 }}
              name="Entropy"
            />
            <Line
              type="monotone"
              dataKey="intentionality"
              stroke="hsl(var(--green-600))"
              strokeWidth={2}
              dot={{ fill: 'hsl(var(--green-600))', r: 4 }}
              name="Intentionality"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 pt-4 border-t border-border space-y-2">
        <h4 className="text-xs font-semibold text-foreground">Version Comparison</h4>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="bg-muted p-2 rounded">
            <p className="text-muted-foreground">Score Improvement</p>
            <p className="font-bold text-foreground">
              +{Math.round(data[data.length - 1].score - data[0].score)}
            </p>
          </div>
          <div className="bg-muted p-2 rounded">
            <p className="text-muted-foreground">Entropy Growth</p>
            <p className="font-bold text-foreground">
              +{Math.round(data[data.length - 1].entropy - data[0].entropy)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
