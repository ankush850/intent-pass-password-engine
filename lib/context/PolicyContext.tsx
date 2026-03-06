'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

export enum PolicyMode {
  CONSUMER = 'CONSUMER',
  ENTERPRISE = 'ENTERPRISE',
}

interface PolicyContextType {
  mode: PolicyMode;
  setMode: (mode: PolicyMode) => void;
}

const PolicyContext = createContext<PolicyContextType | undefined>(undefined);

interface PolicyProviderProps {
  children: ReactNode;
}

export function PolicyProvider({ children }: PolicyProviderProps) {
  const [mode, setMode] = useState<PolicyMode>(PolicyMode.CONSUMER);

  return (
    <PolicyContext.Provider value={{ mode, setMode }}>
      {children}
    </PolicyContext.Provider>
  );
}

export function usePolicy() {
  const context = useContext(PolicyContext);
  if (context === undefined) {
    throw new Error('usePolicy must be used within a PolicyProvider');
  }
  return context;
}
