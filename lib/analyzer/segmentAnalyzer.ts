import { SegmentationResult, Segment } from './types';
import { WEAK_SUBSTRINGS } from './constants';

function getCharType(char: string): 'alpha' | 'digit' | 'symbol' {
  if (/[a-zA-Z]/.test(char)) return 'alpha';
  if (/[0-9]/.test(char)) return 'digit';
  return 'symbol';
}

function calculateSegmentEntropy(segment: string): number {
  const freq: Record<string, number> = {};
  for (const char of segment) {
    freq[char] = (freq[char] || 0) + 1;
  }

  let entropy = 0;
  const len = segment.length;
  for (const count of Object.values(freq)) {
    const probability = count / len;
    entropy -= probability * Math.log2(probability);
  }
  return entropy;
}

function isWeakWord(segment: string): boolean {
  const lower = segment.toLowerCase();
  return WEAK_SUBSTRINGS.some(weak => lower.includes(weak));
}

export function segmentPassword(password: string): SegmentationResult {
  if (password.length === 0) {
    return { segments: [], totalSegments: 0 };
  }

  const segments: Segment[] = [];
  let currentSegment = password[0];
  let currentType = getCharType(password[0]);
  let isMixed = false;

  for (let i = 1; i < password.length; i++) {
    const char = password[i];
    const charType = getCharType(char);

    if (charType !== currentType) {
      // Type change detected
      const segmentType: 'alpha' | 'digit' | 'symbol' | 'mixed' = isMixed ? 'mixed' : currentType;
      segments.push({
        text: currentSegment,
        type: segmentType,
        length: currentSegment.length,
        entropy: calculateSegmentEntropy(currentSegment),
        isWeakWord: isWeakWord(currentSegment),
      });

      currentSegment = char;
      currentType = charType;
      isMixed = false;
    } else {
      currentSegment += char;
    }
  }

  // Add the last segment
  if (currentSegment.length > 0) {
    const segmentType: 'alpha' | 'digit' | 'symbol' | 'mixed' = isMixed ? 'mixed' : currentType;
    segments.push({
      text: currentSegment,
      type: segmentType,
      length: currentSegment.length,
      entropy: calculateSegmentEntropy(currentSegment),
      isWeakWord: isWeakWord(currentSegment),
    });
  }

  return {
    segments,
    totalSegments: segments.length,
  };
}
