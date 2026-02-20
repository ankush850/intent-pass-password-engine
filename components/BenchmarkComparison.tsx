'use client';

import { BenchmarkComparison as BenchmarkComparisonType } from '@/lib/analyzer/benchmark';

interface BenchmarkComparisonProps {
  benchmark: BenchmarkComparisonType;
}

const categoryColors = {
  VERY_STRONG: 'bg-green-600 text-white',
  STRONG: 'bg-green-500 text-white',
  GOOD: 'bg-blue-500 text-white',
  FAIR: 'bg-yellow-500 text-white',
  WEAK: 'bg-orange-500 text-white',
  VERY_WEAK: 'bg-red-600 text-white',
};

export function BenchmarkComparison({ benchmark }: BenchmarkComparisonProps) {
  const systems = [benchmark.intentpass, benchmark.ruleBased, benchmark.zxcvbn];

  return (
    <div className="bg-background border border-border rounded-lg p-4 space-y-4">
      <h3 className="font-semibold text-foreground">System Comparison</h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {systems.map((system, idx) => (
          <div key={idx} className="border border-border rounded-lg p-3 space-y-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase">{system.system}</p>

            <div className={`${categoryColors[system.category]} rounded-lg p-3 text-center`}>
              <p className="text-2xl font-bold">{system.score}</p>
              <p className="text-xs opacity-90">{system.category.replace(/_/g, ' ')}</p>
            </div>

            <div className="space-y-1">
              <p className="text-xs font-semibold text-foreground">Passes:</p>
              {system.passes.length > 0 ? (
                <ul className="text-xs space-y-1">
                  {system.passes.map((pass, i) => (
                    <li key={i} className="flex items-center gap-1">
                      <span className="text-green-600">✓</span>
                      <span className="text-foreground/80">{pass}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-muted-foreground italic">None checked</p>
              )}
            </div>

            <div className="space-y-1">
              <p className="text-xs font-semibold text-foreground">Failures:</p>
              {system.failures.length > 0 ? (
                <ul className="text-xs space-y-1">
                  {system.failures.map((failure, i) => (
                    <li key={i} className="flex items-center gap-1">
                      <span className="text-red-600">✗</span>
                      <span className="text-foreground/80">{failure}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-muted-foreground italic">None</p>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-border pt-4 space-y-2">
        <p className="text-xs font-semibold text-foreground">Key Differences</p>
        <p className="text-xs text-muted-foreground">{benchmark.comparison.intentpassAdvantage}</p>

        {benchmark.comparison.keyDifferences.length > 0 && (
          <ul className="space-y-1">
            {benchmark.comparison.keyDifferences.map((diff, idx) => (
              <li key={idx} className="text-xs text-foreground/80 flex gap-2">
                <span className="text-blue-600">→</span>
                {diff}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
