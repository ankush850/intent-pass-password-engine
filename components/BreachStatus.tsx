'use client';

import { useEffect, useState } from 'react';
import { checkBreachStatus, type BreachCheckResult } from '@/lib/analyzer/breachChecker';

interface BreachStatusProps {
  password: string;
  onBreachCheck?: (result: BreachCheckResult) => void;
}

export function BreachStatus({ password, onBreachCheck }: BreachStatusProps) {
  const [result, setResult] = useState<BreachCheckResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [lastPassword, setLastPassword] = useState('');

  useEffect(() => {
    if (!password || password.length < 4 || password === lastPassword) return;

    const checkBreaches = async () => {
      setLoading(true);
      const breachResult = await checkBreachStatus(password);
      setResult(breachResult);
      setLastPassword(password);
      onBreachCheck?.(breachResult);
    };

    const timer = setTimeout(() => {
      checkBreaches();
    }, 500); // Debounce

    return () => clearTimeout(timer);
  }, [password, onBreachCheck, lastPassword]);

  if (!result || loading) {
    return (
      <div className="bg-muted border border-border rounded-lg p-3 flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
        <span className="text-sm text-muted-foreground">Checking breach status...</span>
      </div>
    );
  }

  return (
    <div
      className={`border rounded-lg p-3 flex items-start gap-3 ${
        result.isBreached
          ? 'bg-destructive/10 border-destructive/50'
          : 'bg-green-500/10 border-green-600/50'
      }`}
    >
      <div className="flex-shrink-0 mt-0.5">
        {result.isBreached ? (
          <div className="w-5 h-5 rounded-full bg-destructive text-white flex items-center justify-center text-xs font-bold">
            !
          </div>
        ) : (
          <div className="w-5 h-5 rounded-full bg-green-600 text-white flex items-center justify-center text-xs font-bold">
            ✓
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-foreground">
          {result.isBreached ? 'Breach Exposure Detected' : 'No Breach Exposure Found'}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          {result.isBreached
            ? `This password appears in ${result.breachCount} known data breaches. Consider changing it immediately.`
            : 'This password has not been found in any known data breaches.'}
        </p>
        {result.error && (
          <p className="text-xs text-amber-600 mt-1">
            Note: {result.error} — Assuming safe for now.
          </p>
        )}
      </div>
    </div>
  );
}
