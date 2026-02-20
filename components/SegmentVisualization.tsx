'use client';

import { SegmentationResult } from '@/lib/analyzer/types';

interface SegmentVisualizationProps {
  segmentation: SegmentationResult;
}

export function SegmentVisualization({ segmentation }: SegmentVisualizationProps) {
  if (segmentation.totalSegments === 0) {
    return null;
  }

  const getSegmentColor = (type: string) => {
    switch (type) {
      case 'alpha':
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800';
      case 'digit':
        return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800';
      case 'symbol':
        return 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800';
      case 'mixed':
        return 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800';
      default:
        return 'bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-800';
    }
  };

  const getLegendColor = (type: string) => {
    switch (type) {
      case 'alpha':
        return 'bg-blue-500';
      case 'digit':
        return 'bg-green-500';
      case 'symbol':
        return 'bg-purple-500';
      case 'mixed':
        return 'bg-orange-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-2">Password Segments</h3>
        <p className="text-xs text-muted-foreground mb-3">
          Password is broken into {segmentation.totalSegments} segment{segmentation.totalSegments !== 1 ? 's' : ''} based on character type transitions.
        </p>
        
        <div className="flex flex-wrap gap-2">
          {segmentation.segments.map((segment, idx) => (
            <div
              key={idx}
              className={`${getSegmentColor(segment.type)} border px-3 py-2 rounded-lg text-sm font-mono transition-all hover:shadow-md cursor-default`}
              title={`Type: ${segment.type}, Entropy: ${segment.entropy.toFixed(2)}, Weak word: ${segment.isWeakWord ? 'Yes' : 'No'}`}
            >
              {segment.text}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-background border border-border rounded-lg p-4">
        <h4 className="text-xs font-semibold text-foreground mb-3 uppercase tracking-wide">Legend</h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-blue-500" />
            <span className="text-xs text-muted-foreground">Letters</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-green-500" />
            <span className="text-xs text-muted-foreground">Digits</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-purple-500" />
            <span className="text-xs text-muted-foreground">Symbols</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-orange-500" />
            <span className="text-xs text-muted-foreground">Mixed</span>
          </div>
        </div>
      </div>
    </div>
  );
}
