import { 
  PasswordAnalysisResult, 
  Diagnostic, 
  ComponentScores,
  SegmentationResult,
  PredictabilityAnalysis,
  RandomSmashAnalysis,
  EntropyAnalysis
} from './types';
import { segmentPassword } from './segmentAnalyzer';
import { analyzePredictability } from './predictabilityAnalyzer';
import { analyzeRandomSmash } from './randomSmashAnalyzer';
import { analyzeAmbiguity } from './ambiguityAnalyzer';
import { analyzeEntropy } from './entropyAnalyzer';
import { SCORE_WEIGHTS, INTENTIONALITY_RANGES } from './constants';

function generateDiagnostics(password: string, result: Omit<PasswordAnalysisResult, 'diagnostics'>): Diagnostic[] {
  const diagnostics: Diagnostic[] = [];

  // Positive signals
  if (result.entropy.characterClassDistribution.uppercase > 0) {
    diagnostics.push({
      type: 'strength',
      message: 'Contains uppercase letters for better variety',
    });
  }

  if (result.entropy.characterClassDistribution.symbols > 0) {
    diagnostics.push({
      type: 'strength',
      message: 'Includes special characters for increased complexity',
    });
  }

  if (result.entropy.balanceScore > 0.6) {
    diagnostics.push({
      type: 'strength',
      message: 'Well-balanced character class distribution',
    });
  }

  if (!result.entropy.hasConsecutiveRepetition) {
    diagnostics.push({
      type: 'strength',
      message: 'No problematic character repetition',
    });
  }

  // Warnings
  if (result.predictability.hasAlphabeticalSequence) {
    diagnostics.push({
      type: 'warning',
      message: `Contains alphabetical sequence: ${result.predictability.alphabeticalSequences.join(', ')}`,
      pattern: result.predictability.alphabeticalSequences[0],
    });
  }

  if (result.predictability.hasNumericSequence) {
    diagnostics.push({
      type: 'warning',
      message: `Contains numeric sequence: ${result.predictability.numericSequences.join(', ')}`,
      pattern: result.predictability.numericSequences[0],
    });
  }

  if (result.predictability.hasKeyboardPattern) {
    diagnostics.push({
      type: 'warning',
      message: `Contains keyboard pattern: ${result.predictability.keyboardPatterns.join(', ')}`,
      pattern: result.predictability.keyboardPatterns[0],
    });
  }

  if (result.predictability.hasWeakSubstring) {
    diagnostics.push({
      type: 'warning',
      message: `Contains common word: ${result.predictability.weakSubstrings.join(', ')}`,
      pattern: result.predictability.weakSubstrings[0],
    });
  }

  if (result.entropy.hasConsecutiveRepetition) {
    diagnostics.push({
      type: 'warning',
      message: `Excessive character repetition: ${result.entropy.repetitionPatterns.join(', ')}`,
    });
  }

  if (result.randomSmash.isRandomSmash) {
    diagnostics.push({
      type: 'warning',
      message: 'Pattern suggests random keyboard smashing rather than intentional design',
    });
  }

  if (result.ambiguity.ambiguityRatio > 0.2) {
    diagnostics.push({
      type: 'warning',
      message: 'Contains easily confused characters (like 0/O, 1/l) - may cause entry errors',
    });
  }

  if (password.length < 8) {
    diagnostics.push({
      type: 'warning',
      message: `Length of ${password.length} characters is relatively short - consider extending`,
    });
  }

  if (result.entropy.characterClassDistribution.digits === 0 && result.entropy.characterClassDistribution.symbols === 0) {
    diagnostics.push({
      type: 'warning',
      message: 'Only uses letters - add numbers or symbols for better security',
    });
  }

  return diagnostics;
}

function calculateComponentScores(
  segmentation: SegmentationResult,
  predictability: PredictabilityAnalysis,
  randomSmash: RandomSmashAnalysis,
  entropy: EntropyAnalysis
): ComponentScores {
  // Structural coherence: based on segmentation quality and balance
  let structuralCoherence = entropy.balanceScore * 0.6 + (segmentation.totalSegments > 1 ? 0.4 : 0);
  structuralCoherence = Math.min(structuralCoherence, 1.0);

  return {
    structuralCoherence,
    predictabilityPenalty: predictability.predictabilityScore,
    randomSmashPenalty: randomSmash.randomSmashScore,
    entropyBalance: entropy.balanceScore,
    visualAmbiguity: entropy.entropyValue === 0 ? 0 : entropy.entropyValue * 0.3 + entropy.balanceScore * 0.7, // Use entropy value but weight balance higher
  };
}

export function analyzePassword(password: string): PasswordAnalysisResult {
  if (password.length === 0) {
    return {
      password,
      length: 0,
      overallScore: 0,
      componentScores: {
        structuralCoherence: 0,
        predictabilityPenalty: 0,
        randomSmashPenalty: 0,
        entropyBalance: 0,
        visualAmbiguity: 0,
      },
      intentionalityIndex: 0,
      intentionalityCategory: 'chaotic',
      segmentation: { segments: [], totalSegments: 0 },
      predictability: {
        hasAlphabeticalSequence: false,
        alphabeticalSequences: [],
        hasNumericSequence: false,
        numericSequences: [],
        hasKeyboardPattern: false,
        keyboardPatterns: [],
        hasWeakSubstring: false,
        weakSubstrings: [],
        predictabilityScore: 0,
      },
      randomSmash: {
        vowelToConsonantRatio: 0.5,
        pronounceability: 0,
        adjacencyRandomness: 0.5,
        isRandomSmash: false,
        randomSmashScore: 0,
      },
      ambiguity: {
        confusableCount: 0,
        totalAmbiguousChars: 0,
        ambiguityRatio: 0,
        ambiguityScore: 0,
      },
      entropy: {
        hasConsecutiveRepetition: false,
        repetitionPatterns: [],
        characterClassDistribution: { uppercase: 0, lowercase: 0, digits: 0, symbols: 0 },
        balanceScore: 0,
        entropyValue: 0,
      },
      diagnostics: [],
    };
  }

  // Perform all analyses
  const segmentation = segmentPassword(password);
  const predictability = analyzePredictability(password);
  const randomSmash = analyzeRandomSmash(password);
  const ambiguity = analyzeAmbiguity(password);
  const entropy = analyzeEntropy(password);
  const componentScores = calculateComponentScores(segmentation, predictability, randomSmash, entropy);

  // Calculate overall score
  let overallScore = 100;
  overallScore -= componentScores.predictabilityPenalty * 25;
  overallScore -= componentScores.randomSmashPenalty * 20;
  overallScore -= (1 - componentScores.entropyBalance) * 20;
  overallScore -= componentScores.visualAmbiguity * 10;
  overallScore += componentScores.structuralCoherence * 25;

  overallScore = Math.max(0, Math.min(100, Math.round(overallScore)));

  // Calculate intentionality index
  const intentionalityIndex = componentScores.structuralCoherence - 
    (predictability.predictabilityScore + randomSmash.randomSmashScore) / 2;

  let intentionalityCategory: 'structured' | 'hack' | 'chaotic';
  if (intentionalityIndex >= INTENTIONALITY_RANGES.structured.min) {
    intentionalityCategory = 'structured';
  } else if (intentionalityIndex >= INTENTIONALITY_RANGES.hack.min) {
    intentionalityCategory = 'hack';
  } else {
    intentionalityCategory = 'chaotic';
  }

  const result: PasswordAnalysisResult = {
    password,
    length: password.length,
    overallScore,
    componentScores,
    intentionalityIndex: Math.max(-1, Math.min(1, intentionalityIndex)),
    intentionalityCategory,
    segmentation,
    predictability,
    randomSmash,
    ambiguity,
    entropy,
    diagnostics: [],
  };

  // Generate diagnostics after we have all analysis data
  result.diagnostics = generateDiagnostics(password, result);

  return result;
}
