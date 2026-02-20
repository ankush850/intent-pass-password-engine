'use client';

import { AdversarialAnalysis } from '@/lib/analyzer/adversarial';

interface AdversarialAnalysisProps {
  analysis: AdversarialAnalysis;
}

const getResistanceColor = (percentage: number) => {
  if (percentage >= 80) return 'bg-green-600';
  if (percentage >= 60) return 'bg-blue-600';
  if (percentage >= 40) return 'bg-yellow-600';
  return 'bg-red-600';
};

export function AdversarialAnalysisComponent({ analysis }: AdversarialAnalysisProps) {
  const scenarios = [
    analysis.dictionaryAttack,
    analysis.bruteForce,
    analysis.keyboardWalkAttack,
    analysis.frequencyAnalysis,
    analysis.markovChain,
  ];

  return (
    <div className="bg-background border border-border rounded-lg p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-foreground">Attack Resistance Analysis</h3>
        <div className="text-right">
          <p className="text-xs text-muted-foreground">Overall Resistance</p>
          <p className="text-2xl font-bold text-foreground">{analysis.overallResistance}%</p>
        </div>
      </div>

      <div className="space-y-3">
        {scenarios.map((scenario, idx) => (
          <div key={idx} className="border border-border rounded-lg p-3">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h4 className="font-semibold text-sm text-foreground">{scenario.name}</h4>
                <p className="text-xs text-muted-foreground">{scenario.description}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-lg text-foreground">{scenario.resistancePercentage}%</p>
                <p className="text-xs text-muted-foreground">{scenario.estimatedTime}</p>
              </div>
            </div>

            <div className="mb-2">
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all ${getResistanceColor(scenario.resistancePercentage)}`}
                  style={{ width: `${scenario.resistancePercentage}%` }}
                />
              </div>
            </div>

            <p className="text-xs text-muted-foreground">{scenario.explanation}</p>
          </div>
        ))}
      </div>

      <div className="bg-muted p-3 rounded-lg">
        <p className="text-xs font-semibold text-foreground mb-2">Resistance Summary</p>
        <p className="text-xs text-muted-foreground">
          {analysis.overallResistance >= 80
            ? 'Excellent resistance to common attacks. Your password is well-protected.'
            : analysis.overallResistance >= 60
              ? 'Good resistance overall. Consider addressing the weakest attack vectors.'
              : analysis.overallResistance >= 40
                ? 'Moderate resistance. Several attack types pose significant threats.'
                : 'Low resistance. Your password is vulnerable to common attack methods.'}
        </p>
      </div>
    </div>
  );
}
