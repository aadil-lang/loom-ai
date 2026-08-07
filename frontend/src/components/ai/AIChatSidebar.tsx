'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Send, User, X, Sparkles, LayoutDashboard, Search, FileText, Mic, MicOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { aiService } from '@/services/api/ai.service';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';

export function AIChatSidebar({ 
  isOpen, 
  setIsOpen 
}: { 
  isOpen: boolean; 
  setIsOpen: (o: boolean) => void 
}) {
  const [messages, setMessages] = React.useState<{role: 'user'|'ai', content: string}[]>([]);
  const [input, setInput] = React.useState('');
  const [activeAgent, setActiveAgent] = React.useState('Supervisor');
  const [isTyping, setIsTyping] = React.useState(false);
  
  const pathname = usePathname();
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  const { isListening, supported, permissionDenied, toggleListening } = useSpeechRecognition((transcript) => {
    setInput(prev => prev + (prev ? ' ' : '') + transcript);
  });

  const searchParams = useSearchParams();
  const router = useRouter();

  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  React.useEffect(() => {
    if (searchParams.get('onboarding') === 'true') {
      setIsOpen(true);
      if (messages.length === 0) {
        setMessages([
          { 
            role: 'ai', 
            content: "Welcome to LoomAI! 👋 I'm your AI assistant. To help customize your experience, could you tell me a bit about your business and what kind of fabrics you usually deal with?" 
          }
        ]);
      }
      
      // Clean up the URL so it doesn't trigger again on refresh
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete('onboarding');
      window.history.replaceState({}, '', newUrl.pathname + newUrl.search);
    }
  }, [searchParams, setIsOpen, messages.length]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMsg = input.trim();
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setInput('');
    setIsTyping(true);

    const sessionId = 'session_' + Math.random().toString(36).substr(2, 9);
    
    // Provide some context based on current page
    const context = {
      currentPage: pathname,
    };

    let fullAiResponse = '';
    
    // Temporary placeholder in UI
    setMessages(prev => [...prev, { role: 'ai', content: '' }]);

    await aiService.streamChat(
      userMsg,
      sessionId,
      context,
      (text) => {
        fullAiResponse = text;
        setMessages(prev => {
          const newMsgs = [...prev];
          newMsgs[newMsgs.length - 1] = { role: 'ai', content: fullAiResponse };
          return newMsgs;
        });
      },
      (agentName) => {
        setActiveAgent(agentName);
      }
    );

    setIsTyping(false);
  };

  if (!isOpen) return null;

  const agentColors: Record<string, string> = {
    'Supervisor': 'bg-slate-800',
    'Marketplace': 'bg-emerald-600',
    'Knowledge': 'bg-indigo-600',
    'Buyer': 'bg-blue-600',
    'Supplier': 'bg-orange-600',
    'BusinessAdvisor': 'bg-purple-600',
    'Negotiation': 'bg-rose-600',
  };

  return (
    <motion.div 
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="fixed inset-y-0 right-0 w-[400px] bg-white dark:bg-slate-950 shadow-2xl border-l z-50 flex flex-col"
    >
      {/* Header */}
      <div className="p-4 border-b flex items-center justify-between bg-slate-50 dark:bg-slate-900/50">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
            <Sparkles className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white">LoomAI Assistant</h3>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
              <span className={`h-2 w-2 rounded-full ${agentColors[activeAgent] || 'bg-slate-800'}`} />
              Active Agent: {activeAgent}
            </div>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
          <X className="h-5 w-5" />
        </Button>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-50">
            <Bot className="h-16 w-16 text-slate-300" />
            <p className="text-sm font-medium">How can LoomAI help you today?</p>
            <div className="flex flex-wrap gap-2 justify-center">
              <Badge variant="outline">Find cotton suppliers</Badge>
              <Badge variant="outline">Explain GOTS cert</Badge>
              <Badge variant="outline">Analyze my sales</Badge>
            </div>
          </div>
        )}
        
        {messages.map((m, i) => (
          <div key={`${m.role}-${i}-${(m.content || '').slice(0,20)}`} className={`flex gap-3 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {m.role === 'ai' && (
              <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${agentColors[activeAgent] || 'bg-slate-800'} text-white`}>
                <Bot className="h-4 w-4" />
              </div>
            )}
            
            <div className={`px-4 py-2.5 rounded-2xl max-w-[80%] text-sm ${
              m.role === 'user' 
                ? 'bg-emerald-600 text-white rounded-br-none' 
                : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-bl-none'
            }`}>
              {m.content || (isTyping && i === messages.length -1 ? 'Thinking...' : '')}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t bg-white dark:bg-slate-950">
        <div className="flex gap-2">
          {supported && (
            <div className="flex flex-col items-center">
              <Button
                variant={isListening ? 'destructive' : 'outline'}
                size="icon"
                onClick={toggleListening}
                className={`shrink-0 rounded-xl transition-all h-12 w-12 ${isListening ? 'animate-pulse' : ''}`}
                title={permissionDenied ? 'Microphone permission denied' : 'Voice Search'}
                disabled={permissionDenied}
              >
                {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
              </Button>
              {permissionDenied && (
                <div className="text-xs text-rose-600 mt-1">Microphone permission is required to use voice assistance.</div>
              )}
            </div>
          )}
          <Input 
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder={isListening ? "Listening..." : `Ask ${activeAgent}...`}
            className="rounded-xl h-12 focus-visible:ring-1 focus-visible:ring-emerald-500 bg-slate-50 dark:bg-slate-900 border-none"
            disabled={isTyping || isListening}
          />
          <Button 
            onClick={handleSend} 
            disabled={!input.trim() || isTyping || isListening}
            className="h-12 w-12 rounded-xl bg-emerald-600 hover:bg-emerald-700 shrink-0"
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

const Badge = ({ children, variant }: any) => <span className="text-[10px] px-2 py-1 rounded-full border bg-slate-50 cursor-pointer">{children}</span>;
