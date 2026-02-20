'use client';

import { BehavioralClass, ClassificationResult } from '@/lib/analyzer/classifier';

interface BehavioralClassificationProps {
  classification: ClassificationResult;
}

const classificationColors = {
  [BehavioralClass.PREDICTABLE]: 'bg-red-100 border-red-300',
  [BehavioralClass.RANDOM]: 'bg-orange-100 border-orange-300',
  [BehavioralClass.PASSPHRASE]: 'bg-green-100 border-green-300',
  [BehavioralClass.COMPLIANCE_HACK]: 'bg-yellow-100 border-yellow-300',
  [BehavioralClass.BALANCED]: 'bg-blue-100 border-blue-300',
};

const classificationIcons = {
  [BehavioralClass.PREDICTABLE]: '⚠️',
  [BehavioralClass.RANDOM]: '🎲',
  [BehavioralClass.PASSPHRASE]: '📖',
  [BehavioralClass.COMPLIANCE_HACK]: '✓',
  [BehavioralClass.BALANCED]: '⚙️',
};

export function BehavioralClassification({ classification }: BehavioralClassificationProps) {
  return (
    <div className={`border-2 rounded-lg p-4 ${classificationColors[classification.classification]}`}>
      <div className="flex items-start gap-3">
        <span className="text-2xl">{classificationIcons[classification.classification]}</span>
        <div className="flex-1">
          <h3 className="font-semibold text-foreground flex items-center gap-2">
            {classification.classification.replace(/_/g, ' ')}
            <span className="text-xs bg-white px-2 py-1 rounded font-mono">
              {classification.confidence}% confidence
            </span>
          </h3>
          <p className="text-sm text-foreground/80 mt-2">{classification.explanation}</p>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-inherit">
        <p className="text-xs font-semibold text-foreground/70 mb-2">Classification Likelihood</p>
        <div className="space-y-2">
          {Object.entries(classification.likelihood).map(([key, value]) => (
            <div key={key} className="flex items-center gap-2">
              <div className="flex-1">
                <div className="h-2 bg-white/50 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600 transition-all"
                    style={{ width: `${value}%` }}
                  />
                </div>
              </div>
              <span className="text-xs font-mono w-10 text-right">{value}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
