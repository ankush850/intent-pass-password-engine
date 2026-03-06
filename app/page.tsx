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
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Header */}
      <header className="relative border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg">
                <span className="text-2xl">🔐</span>
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  IntentPass
                </h1>
                <p className="text-xs text-muted-foreground">Advanced Password Analysis</p>
              </div>
            </div>
            <PolicyToggle />
          </div>
        </div>
      </header>

      {/* Landing Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-5xl mx-auto text-center space-y-8 relative z-10">
          {/* Main Heading */}
          <div className="space-y-4">
            <h2 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight text-foreground">
              Welcome to IntentPass
            </h2>
            <p className="text-3xl sm:text-4xl md:text-5xl font-light text-muted-foreground">
              Discover Your Password's True Strength
            </p>
          </div>

          {/* Description */}
          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            IntentPass analyzes password strength using intelligent pattern detection,
            structural analysis, and real-world attack simulations.
          </p>

          {/* CTA Button */}
          <div className="pt-8">
            <button
              onClick={() => {
                document.getElementById('analyzer')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white transition-all duration-300 bg-gradient-to-r from-primary to-primary/60 rounded-full hover:shadow-2xl hover:shadow-primary/50 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
            >
              <span>Start Analysis</span>
              <svg
                className="w-5 h-5 ml-2 -mr-1 transition-transform group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </button>
          </div>

          {/* Trust Indicators */}
          <div className="pt-16 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="space-y-2">
              <div className="text-3xl font-bold text-primary">Real-Time</div>
              <div className="text-sm text-muted-foreground">Instant Analysis</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-primary">Pattern Detection</div>
              <div className="text-sm text-muted-foreground">Advanced Algorithms</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-primary">Security Score</div>
              <div className="text-sm text-muted-foreground">Modern Standards</div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background to-muted">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="group p-8 rounded-2xl bg-card/50 border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/20">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Real-Time Analysis</h3>
              <p className="text-muted-foreground leading-relaxed">
                Analyze password patterns instantly as you type. Get immediate feedback on security metrics and potential vulnerabilities.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group p-8 rounded-2xl bg-card/50 border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/20">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Pattern Detection</h3>
              <p className="text-muted-foreground leading-relaxed">
                Detect weak patterns, keyboard walks, and predictable structures that traditional checkers miss.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group p-8 rounded-2xl bg-card/50 border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/20">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Security Scoring</h3>
              <p className="text-muted-foreground leading-relaxed">
                Generate a comprehensive security score based on modern attack models and adversarial simulations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Password Analyzer Section */}
      <section id="analyzer" className="relative py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
              Password Analyzer
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Enter your password below to unlock comprehensive security insights
            </p>
          </div>

          {/* Main Input Section */}
          <div className="max-w-3xl mx-auto mb-16">
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/30 via-primary/20 to-primary/30 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
              <div className="relative">
                <PasswordInput
                  value={password}
                  onChange={handlePasswordChange}
                  showPassword={showPassword}
                  onToggleShow={handleToggleShowPassword}
                />
              </div>
            </div>
          </div>

          {/* Empty State */}
          {password.length === 0 ? (
            <div className="max-w-4xl mx-auto">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 rounded-3xl blur-2xl" />
                <div className="relative bg-card/80 backdrop-blur-xl border border-border/50 rounded-3xl p-12 text-center shadow-2xl">
                  <div className="space-y-4">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 mb-4">
                      <span className="text-5xl">🔒</span>
                    </div>
                    <h3 className="text-2xl font-bold text-foreground">Ready to Analyze</h3>
                    <p className="text-muted-foreground max-w-md mx-auto">
                      Start typing your password above to unlock comprehensive insights into its strength, patterns, and security characteristics.
                    </p>
                    <div className="flex flex-wrap justify-center gap-3 pt-4">
                      <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/10">
                        <span className="text-lg">✨</span>
                        <span className="text-sm font-medium">Real-time Analysis</span>
                      </div>
                      <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/10">
                        <span className="text-lg">🎯</span>
                        <span className="text-sm font-medium">Pattern Detection</span>
                      </div>
                      <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/10">
                        <span className="text-lg">🛡️</span>
                        <span className="text-sm font-medium">Security Scoring</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Results Section */}
              <div className="max-w-7xl mx-auto pb-16">
                {/* Key Metrics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  <div className="lg:col-span-2">
                    <div className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
                      <ScoreDisplay score={analysis.overallScore} />
                    </div>
                  </div>
                  <div>
                    <div className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
                      <IntentionalityBadge 
                        index={analysis.intentionalityIndex}
                        category={analysis.intentionalityCategory}
                      />
                    </div>
                  </div>
                </div>

                {/* Main Analysis Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                  <div className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-2xl p-6 shadow-lg">
                    <BreakdownChart scores={analysis.componentScores} />
                  </div>
                  <div className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-2xl p-6 shadow-lg">
                    <RadarChartComponent metrics={radarMetrics} />
                  </div>
                </div>

                {/* Segment Visualization & Diagnostics */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                  <div className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-2xl p-6 shadow-lg">
                    <SegmentVisualization segmentation={analysis.segmentation} />
                  </div>
                  <div className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-2xl p-6 shadow-lg">
                    <DiagnosticsPanel diagnostics={analysis.diagnostics} />
                  </div>
                </div>

                {/* Behavioral Analysis */}
                <div className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-2xl p-6 shadow-lg mb-8">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="flex flex-col items-center justify-center">
                      <TierBadge intentionalityIndex={Math.max(0, (analysis.intentionalityIndex + 1) * 50)} />
                    </div>
                    {classification && (
                      <BehavioralClassification classification={classification} />
                    )}
                  </div>
                </div>

                {/* Advanced Visualizations */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                  <div className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-2xl p-6 shadow-lg">
                    <EntropyMap password={password} segments={analysis.segmentation.segments} />
                  </div>
                  <div className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-2xl p-6 shadow-lg">
                    <KeyboardHeatmap 
                      password={password} 
                      keyboardWalkCount={analysis.predictability.keyboardPatterns.length}
                    />
                  </div>
                </div>

                {/* Security Checks */}
                <div className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-2xl p-6 shadow-lg mb-8">
                  <BreachStatus password={password} onBreachCheck={handleBreachCheck} />
                </div>

                {/* Suggestions & Analysis */}
                {suggestions.length > 0 && (
                  <div className="mb-8">
                    <SuggestionsPanel suggestions={suggestions} />
                  </div>
                )}

                {/* Advanced Analysis Cards */}
                {adversarial && (
                  <div className="mb-8">
                    <div className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-2xl p-6 shadow-lg">
                      <AdversarialAnalysisComponent analysis={adversarial} />
                    </div>
                  </div>
                )}

                {benchmark && (
                  <div className="mb-8">
                    <div className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-2xl p-6 shadow-lg">
                      <BenchmarkComparison benchmark={benchmark} />
                    </div>
                  </div>
                )}

                {/* Detailed Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {/* Character Distribution */}
                  <div className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-2xl p-6 shadow-lg">
                    <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
                      <span className="text-xl">📊</span>
                      Character Distribution
                    </h3>
                    <div className="space-y-4">
                      {[
                        { label: 'Uppercase', value: analysis.entropy.characterClassDistribution.uppercase, color: 'bg-blue-500' },
                        { label: 'Lowercase', value: analysis.entropy.characterClassDistribution.lowercase, color: 'bg-green-500' },
                        { label: 'Digits', value: analysis.entropy.characterClassDistribution.digits, color: 'bg-yellow-500' },
                        { label: 'Symbols', value: analysis.entropy.characterClassDistribution.symbols, color: 'bg-purple-500' },
                      ].map((char) => (
                        <div key={char.label}>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm text-muted-foreground">{char.label}</span>
                            <span className="text-sm font-medium text-foreground">{char.value}</span>
                          </div>
                          <div className="h-3 bg-border/50 rounded-full overflow-hidden">
                            <div
                              className={`h-full ${char.color} transition-all duration-500`}
                              style={{
                                width: `${Math.min(100, (char.value / password.length) * 100)}%`,
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Entropy Metrics */}
                  <div className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-2xl p-6 shadow-lg">
                    <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
                      <span className="text-xl">🎲</span>
                      Entropy Metrics
                    </h3>
                    <div className="space-y-4">
                      {[
                        { label: 'Balance Score', value: `${Math.round(analysis.entropy.balanceScore * 100)}%`, raw: analysis.entropy.balanceScore },
                        { label: 'Entropy Value', value: analysis.entropy.entropyValue.toFixed(2), raw: analysis.entropy.entropyValue },
                        { label: 'Pronounceability', value: `${Math.round(analysis.randomSmash.pronounceability * 100)}%`, raw: analysis.randomSmash.pronounceability },
                        { label: 'Ambiguity Ratio', value: `${Math.round(analysis.ambiguity.ambiguityRatio * 100)}%`, raw: analysis.ambiguity.ambiguityRatio },
                      ].map((metric) => (
                        <div key={metric.label}>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm text-muted-foreground">{metric.label}</span>
                            <span className="text-sm font-semibold text-primary">{metric.value}</span>
                          </div>
                          <div className="h-3 bg-border/50 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-primary to-primary/60 transition-all duration-500"
                              style={{ width: `${metric.raw * 100}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 border border-primary/20 rounded-2xl p-6 shadow-lg">
                  <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
                    <span className="text-xl">⚡</span>
                    Quick Stats
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wide">Total Segments</p>
                      <p className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                        {analysis.segmentation.totalSegments}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wide">Vowel/Consonant</p>
                      <p className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                        {analysis.randomSmash.vowelToConsonantRatio.toFixed(2)}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wide">Password Length</p>
                      <p className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                        {analysis.length}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-muted/30 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
                <span className="text-lg">🔐</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">IntentPass</p>
                <p className="text-xs text-muted-foreground">© 2026 Advanced Password Analysis</p>
              </div>
            </div>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                Real-time Analysis
              </span>
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                Pattern Detection
              </span>
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-purple-500" />
                Security Scoring
              </span>
            </div>
          </div>
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
