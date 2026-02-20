'use client';

import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface EntropyMapProps {
  password: string;
  segments: Array<{
    type: string;
    text: string;
    entropy: number;
  }>;
}

export function EntropyMap({ password, segments }: EntropyMapProps) {
  const data = useMemo(() => {
    return segments.map((seg, idx) => ({
      name: `Seg ${idx + 1}`,
      entropy: Math.round(seg.entropy * 10) / 10,
      type: seg.type,
      chars: seg.text.length,
    }));
  }, [segments]);

  const totalEntropy = useMemo(() => {
    return data.reduce((sum, d) => sum + d.entropy, 0);
  }, [data]);

  const getColor = (entropy: number) => {
    if (entropy > 5) return 'hsl(var(--primary))';
    if (entropy > 3) return 'hsl(var(--amber-500))';
    return 'hsl(var(--destructive))';
  };

  return (
    <div className="bg-background border border-border rounded-lg p-4">
      <h3 className="text-sm font-semibold text-foreground mb-4">Entropy Distribution</h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="name" 
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
              <Bar dataKey="entropy" radius={[8, 8, 0, 0]}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getColor(entry.entropy)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="space-y-3">
          <div className="bg-muted p-3 rounded-lg">
            <p className="text-xs text-muted-foreground mb-1">Total Entropy</p>
            <p className="text-2xl font-bold text-foreground">{totalEntropy.toFixed(1)} bits</p>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-foreground">Segment Breakdown</h4>
            {data.map((seg, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 flex-1">
                  <div className="w-2 h-2 rounded" style={{ backgroundColor: getColor(seg.entropy) }} />
                  <span className="text-muted-foreground">{segments[idx].type}</span>
                </div>
                <div className="flex gap-2">
                  <span className="font-mono text-foreground">{seg.chars}c</span>
                  <span className="font-mono font-semibold" style={{ color: getColor(seg.entropy) }}>
                    {seg.entropy.toFixed(1)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="text-xs text-muted-foreground mt-4 p-2 bg-muted rounded">
            <p>Higher entropy per segment indicates better randomness and unpredictability.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
