import crypto from 'crypto';

export interface BreachCheckResult {
  isBreached: boolean;
  breachCount: number;
  breachNames: string[];
  lastCheckTime: number;
  error?: string;
}

const HIBP_API_BASE = 'https://api.pwnedpasswords.com/range/';
const CACHE_DURATION = 1000 * 60 * 60; // 1 hour

// Simple in-memory cache (note: in production use Redis)
const breachCache = new Map<string, { result: BreachCheckResult; timestamp: number }>();

export async function checkBreachStatus(password: string): Promise<BreachCheckResult> {
  try {
    // Check cache first
    const cached = breachCache.get(password);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.result;
    }

    // Hash the password with SHA-1 for HIBP API
    const hash = crypto.createHash('sha1').update(password).digest('hex').toUpperCase();
    const prefix = hash.substring(0, 5);
    const suffix = hash.substring(5);

    // Call HIBP API with prefix
    const response = await fetch(`${HIBP_API_BASE}${prefix}`, {
      headers: {
        'User-Agent': 'IntentPass-PasswordAnalyzer',
      },
    });

    if (!response.ok) {
      throw new Error(`HIBP API error: ${response.status}`);
    }

    const text = await response.text();
    const lines = text.split('\r\n');

    // Check if our hash suffix is in the response
    let breachCount = 0;
    for (const line of lines) {
      const [hashSuffix, count] = line.split(':');
      if (hashSuffix === suffix) {
        breachCount = parseInt(count, 10);
        break;
      }
    }

    const result: BreachCheckResult = {
      isBreached: breachCount > 0,
      breachCount,
      breachNames: breachCount > 0 ? ['Found in data breaches'] : [],
      lastCheckTime: Date.now(),
    };

    // Cache the result
    breachCache.set(password, { result, timestamp: Date.now() });

    return result;
  } catch (error) {
    console.error('[IntentPass] Breach check error:', error);
    return {
      isBreached: false,
      breachCount: 0,
      breachNames: [],
      lastCheckTime: Date.now(),
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

export function getBreachPenalty(breachResult: BreachCheckResult): number {
  if (!breachResult.isBreached) return 0;
  // Penalize heavily if breached (up to 40 points)
  return Math.min(40, 10 + Math.log(breachResult.breachCount + 1) * 5);
}
