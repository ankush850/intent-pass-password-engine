'use client';

import { useState, useMemo } from 'react';
import { PasswordInput } from '@/components/PasswordInput';
import { ScoreDisplay } from '@/components/ScoreDisplay';
import { IntentionalityBadge } from '@/components/IntentionalityBadge';
import { DiagnosticsPanel } from '@/components/DiagnosticsPanel';
import { BreakdownChart } from '@/components/BreakdownChart';
import { SegmentVisualization } from '@/components/SegmentVisualization';
import { RadarChartComponent } from '@/components/RadarChart';
import { KeyboardHeatmap } from '@/components/KeyboardHeatmap';
import { EntropyMap } from '@/components/EntropyMap';
import { BreachStatus } from '@/components/BreachStatus';
import { TierBadge } from '@/components/TierBadge';
import { BehavioralClassification } from '@/components/BehavioralClassification';
import { SuggestionsPanel } from '@/components/SuggestionsPanel';
import { AdversarialAnalysisComponent } from '@/components/AdversarialAnalysis';
import { BenchmarkComparison } from '@/components/BenchmarkComparison';
import { PolicyToggle } from '@/components/PolicyToggle';
import { PolicyProvider } from '@/lib/context/PolicyContext';
import { analyzePassword } from '@/lib/analyzer/scorer';
import { classifyPassword } from '@/lib/analyzer/classifier';
import { generateSuggestions } from '@/lib/analyzer/suggestions';
import { analyzeAdversarial } from '@/lib/analyzer/adversarial';
import { createBenchmark } from '@/lib/analyzer/benchmark';

function HomeContent() {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordHistory, setPasswordHistory] = useState<string[]>([]);

  // Memoize analysis to avoid re-computing on every render
  const analysis = useMemo(() => {
    return analyzePassword(password);
  }, [password]);

  const classification = useMemo(() => {
    if (password.length === 0) return null;
    return classifyPassword(password, analysis);
  }, [password, analysis]);

  const suggestions = useMemo(() => {
    if (!classification || password.length === 0) return [];
    return generateSuggestions(password, analysis, classification.classification);
  }, [password, analysis, classification]);

  const adversarial = useMemo(() => {
    if (password.length === 0) return null;
    return analyzeAdversarial(password, analysis);
  }, [password, analysis]);

  const benchmark = useMemo(() => {
    if (password.length === 0) return null;
    return createBenchmark(password, analysis, analysis.overallScore);
  }, [password, analysis]);

  const radarMetrics = useMemo(() => {
    if (password.length === 0) {
      return {
        structuralIntegrity: 0,
        entropyQuality: 0,
        patternAvoidance: 0,
        intentionalityIndex: 0,
        resilienceScore: 0,
        behavioralBalance: 0,
      };
    }

    return {
      structuralIntegrity: analysis.componentScores.structuralCoherence * 100,
      entropyQuality: analysis.entropy.balanceScore * 100,
      patternAvoidance: Math.max(0, 100 - analysis.componentScores.predictabilityPenalty * 100),
      intentionalityIndex: Math.max(0, (analysis.intentionalityIndex + 1) * 50),
      resilienceScore: adversarial ? adversarial.overallResistance : 50,
      behavioralBalance: classification ? classification.confidence : 50,
    };
  }, [password, analysis, adversarial, classification]);

  const handlePasswordChange = (value: string) => {
    setPassword(value);
  };

  const handleToggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleBreachCheck = () => {
    // Callback for breach checking
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <div className="relative overflow-hidden py-16 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10" />
        <div className="relative max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div />
            <PolicyToggle />
            <div />
          </div>

          <div className="text-center space-y-4 mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-balance">
              IntentPass
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-balance">
              Analyze your password's intentionality, structural coherence, and actual strength beyond traditional complexity rules.
            </p>
          </div>

          {/* Main Input Section */}
          <div className="max-w-2xl mx-auto mb-12">
            <PasswordInput
              value={password}
              onChange={handlePasswordChange}
              showPassword={showPassword}
              onToggleShow={handleToggleShowPassword}
            />
          </div>

          {/* Empty State */}
          {password.length === 0 ? (
            <div className="max-w-4xl mx-auto">
              <div className="bg-muted/50 border border-border rounded-xl p-12 text-center">
                <div className="space-y-3">
                  <div className="text-4xl">🔐</div>
                  <h2 className="text-xl font-semibold text-foreground">Enter a password to begin</h2>
                  <p className="text-muted-foreground">
                    Start typing above to see real-time analysis of your password's strength, patterns, and intentionality.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Results Section */}
              <div className="max-w-4xl mx-auto space-y-8">
                {/* Score and Intentionality */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <ScoreDisplay score={analysis.overallScore} />
                  <IntentionalityBadge 
                    index={analysis.intentionalityIndex}
                    category={analysis.intentionalityCategory}
                  />
                </div>

                {/* Chart Breakdown */}
                <BreakdownChart scores={analysis.componentScores} />

                {/* Segments Visualization */}
                <SegmentVisualization segmentation={analysis.segmentation} />

                {/* Diagnostics Panel */}
                <DiagnosticsPanel diagnostics={analysis.diagnostics} />

                {/* Breach Status Check */}
                <BreachStatus password={password} onBreachCheck={handleBreachCheck} />

                {/* Tier Badge and Classification */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="flex justify-center">
                    <TierBadge intentionalityIndex={Math.max(0, (analysis.intentionalityIndex + 1) * 50)} />
                  </div>
                  {classification && (
                    <BehavioralClassification classification={classification} />
                  )}
                </div>

                {/* Radar Chart */}
                <RadarChartComponent metrics={radarMetrics} />

                {/* Entropy Distribution Map */}
                <EntropyMap password={password} segments={analysis.segmentation.segments} />

                {/* Keyboard Heatmap */}
                <KeyboardHeatmap 
                  password={password} 
                  keyboardWalkCount={analysis.predictability.keyboardPatterns.length}
                />

                {/* Suggestions Panel */}
                {suggestions.length > 0 && (
                  <SuggestionsPanel suggestions={suggestions} />
                )}

                {/* Adversarial Analysis */}
                {adversarial && (
                  <AdversarialAnalysisComponent analysis={adversarial} />
                )}

                {/* Benchmark Comparison */}
                {benchmark && (
                  <BenchmarkComparison benchmark={benchmark} />
                )}

                {/* Detailed Analysis Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Character Distribution */}
                  <div className="bg-background border border-border rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-foreground mb-4">Character Distribution</h3>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm text-muted-foreground">Uppercase</span>
                          <span className="text-sm font-medium text-foreground">
                            {analysis.entropy.characterClassDistribution.uppercase}
                          </span>
                        </div>
                        <div className="h-2 bg-border rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-500 transition-all"
                            style={{
                              width: `${Math.min(100, (analysis.entropy.characterClassDistribution.uppercase / password.length) * 100)}%`,
                            }}
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm text-muted-foreground">Lowercase</span>
                          <span className="text-sm font-medium text-foreground">
                            {analysis.entropy.characterClassDistribution.lowercase}
                          </span>
                        </div>
                        <div className="h-2 bg-border rounded-full overflow-hidden">
                          <div
                            className="h-full bg-green-500 transition-all"
                            style={{
                              width: `${Math.min(100, (analysis.entropy.characterClassDistribution.lowercase / password.length) * 100)}%`,
                            }}
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm text-muted-foreground">Digits</span>
                          <span className="text-sm font-medium text-foreground">
                            {analysis.entropy.characterClassDistribution.digits}
                          </span>
                        </div>
                        <div className="h-2 bg-border rounded-full overflow-hidden">
                          <div
                            className="h-full bg-yellow-500 transition-all"
                            style={{
                              width: `${Math.min(100, (analysis.entropy.characterClassDistribution.digits / password.length) * 100)}%`,
                            }}
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm text-muted-foreground">Symbols</span>
                          <span className="text-sm font-medium text-foreground">
                            {analysis.entropy.characterClassDistribution.symbols}
                          </span>
                        </div>
                        <div className="h-2 bg-border rounded-full overflow-hidden">
                          <div
                            className="h-full bg-purple-500 transition-all"
                            style={{
                              width: `${Math.min(100, (analysis.entropy.characterClassDistribution.symbols / password.length) * 100)}%`,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Entropy Metrics */}
                  <div className="bg-background border border-border rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-foreground mb-4">Entropy Metrics</h3>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-muted-foreground">Balance Score</span>
                          <span className="text-sm font-semibold text-primary">
                            {Math.round(analysis.entropy.balanceScore * 100)}%
                          </span>
                        </div>
                        <div className="h-2 bg-border rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary transition-all"
                            style={{ width: `${analysis.entropy.balanceScore * 100}%` }}
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-muted-foreground">Entropy Value</span>
                          <span className="text-sm font-semibold text-primary">
                            {analysis.entropy.entropyValue.toFixed(2)}
                          </span>
                        </div>
                        <div className="h-2 bg-border rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary transition-all"
                            style={{ width: `${analysis.entropy.entropyValue * 100}%` }}
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-muted-foreground">Pronounceability</span>
                          <span className="text-sm font-semibold text-primary">
                            {Math.round(analysis.randomSmash.pronounceability * 100)}%
                          </span>
                        </div>
                        <div className="h-2 bg-border rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary transition-all"
                            style={{ width: `${analysis.randomSmash.pronounceability * 100}%` }}
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-muted-foreground">Ambiguity Ratio</span>
                          <span className="text-sm font-semibold text-primary">
                            {Math.round(analysis.ambiguity.ambiguityRatio * 100)}%
                          </span>
                        </div>
                        <div className="h-2 bg-border rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary transition-all"
                            style={{ width: `${analysis.ambiguity.ambiguityRatio * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Raw Metrics */}
                <div className="bg-muted/50 border border-border rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-4">Raw Analysis Data</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Total Segments</p>
                      <p className="text-2xl font-bold text-primary">{analysis.segmentation.totalSegments}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Vowel/Consonant</p>
                      <p className="text-lg font-semibold text-foreground">
                        {analysis.randomSmash.vowelToConsonantRatio.toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Password Length</p>
                      <p className="text-2xl font-bold text-primary">{analysis.length}</p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/30 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center text-sm text-muted-foreground">
          <p>IntentPass © 2026 — Analyze passwords beyond traditional complexity rules</p>
        </div>
      </footer>
    </main>
  );
}

export default function Home() {
  return (
    <PolicyProvider>
      <HomeContent />
    </PolicyProvider>
  );
}
