'use client';

import React, { createContext, useContext, useState } from 'react';

export enum PolicyMode {
  CONSUMER = 'CONSUMER',
  ENTERPRISE = 'ENTERPRISE',
}

export interface Policy {
  mode: PolicyMode;
  minLength: number;
  requireUppercase: boolean;
  requireLowercase: boolean;
  requireNumbers: boolean;
  requireSpecialChars: boolean;
  forbidDictionary: boolean;
  forbidSequences: boolean;
  forbidKeyboardWalks: boolean;
  forbidRepeatingChars: boolean;
  maxRepeatLength: number;
  minEntropy: number;
  enforceIntentionality: boolean;
  minIntentionalityScore: number;
}

const CONSUMER_POLICY: Policy = {
  mode: PolicyMode.CONSUMER,
  minLength: 8,
  requireUppercase: false,
  requireLowercase: false,
  requireNumbers: false,
  requireSpecialChars: false,
  forbidDictionary: false,
  forbidSequences: false,
  forbidKeyboardWalks: false,
  forbidRepeatingChars: false,
  maxRepeatLength: 4,
  minEntropy: 30,
  enforceIntentionality: false,
  minIntentionalityScore: 0,
};

const ENTERPRISE_POLICY: Policy = {
  mode: PolicyMode.ENTERPRISE,
  minLength: 14,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSpecialChars: true,
  forbidDictionary: true,
  forbidSequences: true,
  forbidKeyboardWalks: true,
  forbidRepeatingChars: true,
  maxRepeatLength: 2,
  minEntropy: 60,
  enforceIntentionality: true,
  minIntentionalityScore: 50,
};

interface PolicyContextType {
  policy: Policy;
  mode: PolicyMode;
  setMode: (mode: PolicyMode) => void;
  checkPassword: (password: string, score: number, entropy: number) => { passes: boolean; violations: string[] };
}

const PolicyContext = createContext<PolicyContextType | undefined>(undefined);

export function PolicyProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<PolicyMode>(PolicyMode.CONSUMER);

  const policy = mode === PolicyMode.CONSUMER ? CONSUMER_POLICY : ENTERPRISE_POLICY;

  const checkPassword = (password: string, score: number, entropy: number) => {
    const violations: string[] = [];

    if (password.length < policy.minLength) {
      violations.push(`Password must be at least ${policy.minLength} characters`);
    }

    if (policy.requireUppercase && !/[A-Z]/.test(password)) {
      violations.push('Must contain uppercase letter');
    }

    if (policy.requireLowercase && !/[a-z]/.test(password)) {
      violations.push('Must contain lowercase letter');
    }

    if (policy.requireNumbers && !/\d/.test(password)) {
      violations.push('Must contain number');
    }

    if (policy.requireSpecialChars && !/[!@#$%^&*()_+\-=\[\]{};:'",.<>?]/.test(password)) {
      violations.push('Must contain special character');
    }

    if (entropy < policy.minEntropy) {
      violations.push(`Entropy must be at least ${policy.minEntropy}`);
    }

    if (policy.enforceIntentionality && score < policy.minIntentionalityScore) {
      violations.push(`Intentionality score must be at least ${policy.minIntentionalityScore}`);
    }

    return {
      passes: violations.length === 0,
      violations,
    };
  };

  return (
    <PolicyContext.Provider value={{ policy, mode, setMode, checkPassword }}>
      {children}
    </PolicyContext.Provider>
  );
}

export function usePolicy() {
  const context = useContext(PolicyContext);
  if (!context) {
    throw new Error('usePolicy must be used within PolicyProvider');
  }
  return context;
}
