'use client';

import { Diagnostic } from '@/lib/analyzer/types';

interface DiagnosticsPanelProps {
  diagnostics: Diagnostic[];
}

export function DiagnosticsPanel({ diagnostics }: DiagnosticsPanelProps) {
  const strengths = diagnostics.filter(d => d.type === 'strength');
  const warnings = diagnostics.filter(d => d.type === 'warning');
  const neutral = diagnostics.filter(d => d.type === 'neutral');

  if (diagnostics.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      {warnings.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <svg className="w-4 h-4 text-yellow-600 dark:text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            Issues Found ({warnings.length})
          </h3>
          <div className="space-y-2">
            {warnings.map((diag, idx) => (
              <div key={idx} className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 p-3 rounded-lg text-sm">
                <p className="text-yellow-800 dark:text-yellow-200">{diag.message}</p>
                {diag.pattern && (
                  <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-1 font-mono bg-yellow-100 dark:bg-yellow-900/40 px-2 py-1 rounded w-fit">
                    {diag.pattern}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {strengths.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Strengths ({strengths.length})
          </h3>
          <div className="space-y-2">
            {strengths.map((diag, idx) => (
              <div key={idx} className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 p-3 rounded-lg text-sm text-green-800 dark:text-green-200">
                {diag.message}
              </div>
            ))}
          </div>
        </div>
      )}

      {neutral.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-foreground">Notes ({neutral.length})</h3>
          <div className="space-y-2">
            {neutral.map((diag, idx) => (
              <div key={idx} className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-3 rounded-lg text-sm text-blue-800 dark:text-blue-200">
                {diag.message}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
