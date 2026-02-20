'use client';

import { usePolicy, PolicyMode } from '@/lib/context/PolicyContext';

export function PolicyToggle() {
  const { mode, setMode } = usePolicy();

  return (
    <div className="flex items-center gap-4">
      <span className="text-sm font-semibold text-foreground">Policy Mode:</span>
      <div className="flex gap-2 bg-muted rounded-lg p-1">
        {[PolicyMode.CONSUMER, PolicyMode.ENTERPRISE].map(policyMode => (
          <button
            key={policyMode}
            onClick={() => setMode(policyMode)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              mode === policyMode
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {policyMode === PolicyMode.CONSUMER ? '👤 Consumer' : '🏢 Enterprise'}
          </button>
        ))}
      </div>
    </div>
  );
}
