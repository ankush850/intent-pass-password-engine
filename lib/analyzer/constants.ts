/**
 * Constants for password analysis
 */

export const WEAK_SUBSTRINGS = [
  'password',
  'admin',
  'welcome',
  'login',
  'user',
  'pass',
  'pwd',
  'test',
  '123456',
  '12345',
  '1234',
  'qwerty',
  'abc',
  'letmein',
  'monkey',
  'dragon',
  'master',
  'sunshine',
  'princess',
  'football',
];

export const KEYBOARD_PATTERNS = {
  qwerty: ['qwerty', 'werty', 'ertyu', 'rtyui', 'tyuiop', 'yuiop', 'uiop'],
  asdf: ['asdf', 'asdfgh', 'sdfgh', 'dfgh', 'fghjkl', 'ghjkl', 'hjkl'],
  zxcv: ['zxcv', 'xcvbn', 'cvbn', 'vbn'],
  vertical: ['12345', '23456', '34567', '45678', '56789'],
  diagonals: ['1qaz', '2wsx', '3edc', '4rfv', '5tgb', '6yhn', '7ujm'],
};

export const CONFUSABLE_CHARS = {
  '1': ['l', 'I', 'L'],
  '0': ['O', 'o'],
  'l': ['1', 'I', 'L'],
  'I': ['1', 'l', 'L'],
  'O': ['0', 'o'],
};

export const VOWELS = new Set(['a', 'e', 'i', 'o', 'u', 'A', 'E', 'I', 'O', 'U']);

export const CONSONANTS = new Set([
  'b', 'c', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'm',
  'n', 'p', 'q', 'r', 's', 't', 'v', 'w', 'x', 'y', 'z',
  'B', 'C', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'M',
  'N', 'P', 'Q', 'R', 'S', 'T', 'V', 'W', 'X', 'Y', 'Z',
]);

// Weights for component scores in final calculation
export const SCORE_WEIGHTS = {
  structuralCoherence: 0.25,
  predictabilityPenalty: 0.25,
  randomSmashPenalty: 0.2,
  entropyBalance: 0.2,
  visualAmbiguity: 0.1,
};

// Thresholds for various detections
export const THRESHOLDS = {
  minSequenceLength: 3,
  minWeakSubstringLength: 4,
  minKeyboardPatternLength: 3,
  maxConsecutiveRepetition: 2,
  vowelRatioLow: 0.15,
  vowelRatioHigh: 0.5,
  pronounceabilityThreshold: 0.3,
  randomSmashThreshold: 0.6,
};

// Intentionality index ranges
export const INTENTIONALITY_RANGES = {
  structured: { min: 0.5, max: 1.0 },
  hack: { min: 0.0, max: 0.5 },
  chaotic: { min: -1.0, max: 0.0 },
};

// Keyboard layout for adjacency detection
export const KEYBOARD_LAYOUT = {
  '1': ['2', 'q'],
  '2': ['1', '3', 'q', 'w', 'e'],
  '3': ['2', '4', 'w', 'e', 'r'],
  '4': ['3', '5', 'e', 'r', 't'],
  '5': ['4', '6', 'r', 't', 'y'],
  '6': ['5', '7', 't', 'y', 'u'],
  '7': ['6', '8', 'y', 'u', 'i'],
  '8': ['7', '9', 'u', 'i', 'o'],
  '9': ['8', '0', 'i', 'o', 'p'],
  '0': ['9', 'o', 'p'],
  'q': ['1', '2', 'w', 'a'],
  'w': ['2', '3', 'q', 'e', 'a', 's', 'd'],
  'e': ['3', '4', 'w', 'r', 's', 'd', 'f'],
  'r': ['4', '5', 'e', 't', 'd', 'f', 'g'],
  't': ['5', '6', 'r', 'y', 'f', 'g', 'h'],
  'y': ['6', '7', 't', 'u', 'g', 'h', 'j'],
  'u': ['7', '8', 'y', 'i', 'h', 'j', 'k'],
  'i': ['8', '9', 'u', 'o', 'j', 'k', 'l'],
  'o': ['9', '0', 'i', 'p', 'k', 'l'],
  'p': ['0', 'o', 'l'],
  'a': ['q', 'w', 's', 'z'],
  's': ['w', 'e', 'a', 'd', 'z', 'x', 'c'],
  'd': ['e', 'r', 's', 'f', 'x', 'c', 'v'],
  'f': ['r', 't', 'd', 'g', 'c', 'v', 'b'],
  'g': ['t', 'y', 'f', 'h', 'v', 'b', 'n'],
  'h': ['y', 'u', 'g', 'j', 'b', 'n', 'm'],
  'j': ['u', 'i', 'h', 'k', 'n', 'm'],
  'k': ['i', 'o', 'j', 'l', 'm'],
  'l': ['o', 'p', 'k'],
  'z': ['a', 's', 'x'],
  'x': ['s', 'd', 'z', 'c'],
  'c': ['d', 'f', 'x', 'v'],
  'v': ['f', 'g', 'c', 'b'],
  'b': ['g', 'h', 'v', 'n'],
  'n': ['h', 'j', 'b', 'm'],
  'm': ['j', 'k', 'n'],
};
