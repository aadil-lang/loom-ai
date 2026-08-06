'use client';

import * as React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { useAI } from '@/context/AIContext';

interface AIContextBannerProps {
  title: string;
  description: string;
  suggestedPrompt: string;
}

export function AIContextBanner({ title, description, suggestedPrompt }: AIContextBannerProps) {
  const { openAI } = useAI();

  return (
    <div 
      onClick={() => {
        // We could also pre-fill the chat input here, but opening it is a good start
        openAI();
      }}
      className="group cursor-pointer relative overflow-hidden rounded-2xl border border-emerald-100 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/40 dark:to-teal-900/40 p-4 transition-all hover:shadow-md hover:border-emerald-200"
    >
      <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-emerald-500/10 blur-2xl group-hover:bg-emerald-500/20 transition-all" />
      
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-start gap-4">
          <div className="mt-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/50 p-2 text-emerald-600 dark:text-emerald-400">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-emerald-900 dark:text-emerald-100">{title}</h4>
            <p className="text-xs text-emerald-700/80 dark:text-emerald-300/80 mt-1 max-w-sm">
              {description}
            </p>
          </div>
        </div>
        
        <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm group-hover:bg-white dark:group-hover:bg-slate-800 transition-colors">
          "{suggestedPrompt}" <ArrowRight className="h-3 w-3 ml-1 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </div>
  );
}
