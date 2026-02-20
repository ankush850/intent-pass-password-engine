'use client';

import { Suggestion } from '@/lib/analyzer/suggestions';

interface SuggestionsPanelProps {
  suggestions: Suggestion[];
}

const impactColors = {
  high: 'bg-red-100 text-red-800 border-red-300',
  medium: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  low: 'bg-blue-100 text-blue-800 border-blue-300',
};

const categoryIcons = {
  structure: '🏗️',
  entropy: '🌀',
  pattern: '🔄',
  memorability: '🧠',
};

export function SuggestionsPanel({ suggestions }: SuggestionsPanelProps) {
  if (suggestions.length === 0) {
    return (
      <div className="bg-green-50 border border-green-300 rounded-lg p-4 text-center">
        <p className="text-sm font-semibold text-green-900">✓ No suggestions needed</p>
        <p className="text-xs text-green-700 mt-1">Your password is well-designed!</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-foreground">Improvement Suggestions</h3>
      {suggestions.map((suggestion, idx) => (
        <div
          key={suggestion.id}
          className={`border rounded-lg p-3 ${impactColors[suggestion.impact]}`}
        >
          <div className="flex items-start gap-2">
            <span className="text-lg">{categoryIcons[suggestion.category]}</span>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h4 className="font-semibold text-sm">{suggestion.title}</h4>
                <span className="text-xs font-bold opacity-70">
                  {suggestion.impact.toUpperCase()} IMPACT
                </span>
              </div>
              <p className="text-xs mt-1 opacity-90">{suggestion.description}</p>
              <div className="mt-2 bg-white/30 rounded px-2 py-1">
                <p className="text-xs font-mono">{suggestion.example}</p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
