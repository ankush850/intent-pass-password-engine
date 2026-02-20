'use client';

import { useMemo } from 'react';

interface KeyboardHeatmapProps {
  password: string;
  keyboardWalkCount: number;
}

const QWERTY_ROWS = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['Z', 'X', 'C', 'V', 'B', 'N', 'M'],
];

const NUMPAD = [
  ['7', '8', '9'],
  ['4', '5', '6'],
  ['1', '2', '3'],
  ['0'],
];

export function KeyboardHeatmap({ password, keyboardWalkCount }: KeyboardHeatmapProps) {
  const keyFrequency = useMemo(() => {
    const freq = new Map<string, number>();
    password.toUpperCase().split('').forEach(char => {
      freq.set(char, (freq.get(char) || 0) + 1);
    });
    return freq;
  }, [password]);

  const maxFrequency = Math.max(...Array.from(keyFrequency.values()), 1);

  const getKeyColor = (key: string) => {
    const count = keyFrequency.get(key) || 0;
    if (count === 0) return 'bg-muted text-muted-foreground';
    
    const intensity = count / maxFrequency;
    if (intensity > 0.7) return 'bg-destructive text-destructive-foreground';
    if (intensity > 0.4) return 'bg-yellow-500 text-white';
    return 'bg-green-600 text-white';
  };

  const renderKeyboard = (rows: string[][], label: string) => (
    <div className="mb-6">
      <h4 className="text-xs font-semibold text-foreground mb-2">{label}</h4>
      <div className="flex flex-col gap-1">
        {rows.map((row, idx) => (
          <div key={idx} className="flex gap-1 justify-center">
            {row.map(key => (
              <button
                key={key}
                disabled
                className={`w-8 h-8 rounded text-xs font-bold transition-all ${getKeyColor(key)} border border-border`}
              >
                {key}
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="bg-background border border-border rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-foreground">Keyboard Usage Heatmap</h3>
        {keyboardWalkCount > 0 && (
          <span className="text-xs bg-destructive text-destructive-foreground px-2 py-1 rounded">
            {keyboardWalkCount} walks detected
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          {renderKeyboard(QWERTY_ROWS, 'QWERTY Layout')}
          <div className="text-xs text-muted-foreground space-y-1">
            <p>Total chars: {password.length}</p>
            <p>Unique chars: {keyFrequency.size}</p>
          </div>
        </div>

        <div>
          {renderKeyboard(NUMPAD, 'Numpad')}
          <div className="flex gap-2 mt-4 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded bg-green-600" />
              <span className="text-muted-foreground">Low freq</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded bg-yellow-500" />
              <span className="text-muted-foreground">Medium</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded bg-destructive" />
              <span className="text-muted-foreground">High freq</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
