'use client';

import React, { createContext, useContext, useState, useMemo, useCallback } from 'react';
import dynamic from 'next/dynamic';

const AIChatSidebar = dynamic(
  () => import('@/components/ui/../ai/AIChatSidebar').then(mod => mod.AIChatSidebar), 
  { ssr: false }
);

interface AIContextType {
  isOpen: boolean;
  openAI: () => void;
  closeAI: () => void;
  toggleAI: () => void;
}

const AIContext = createContext<AIContextType | undefined>(undefined);

export function AIProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [hasOpened, setHasOpened] = useState(false);

  const openAI = useCallback(() => {
    setIsOpen(true);
    setHasOpened(true);
  }, []);
  const closeAI = useCallback(() => setIsOpen(false), []);
  const toggleAI = useCallback(() => {
    setIsOpen(prev => {
      if (!prev) setHasOpened(true);
      return !prev;
    });
  }, []);

  const value = useMemo(() => ({
    isOpen, openAI, closeAI, toggleAI
  }), [isOpen, openAI, closeAI, toggleAI]);

  return (
    <AIContext.Provider value={value}>
      {children}
      {hasOpened && <AIChatSidebar isOpen={isOpen} setIsOpen={setIsOpen} />}
    </AIContext.Provider>
  );
}

export function useAI() {
  const context = useContext(AIContext);
  if (context === undefined) {
    throw new Error('useAI must be used within an AIProvider');
  }
  return context;
}
