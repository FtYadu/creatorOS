'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useInboxStore } from '@/lib/stores/inbox-store';
import { ParsedDataDisplay } from './parsed-data-display';

export function EmailParser() {
  const [emailText, setEmailText] = useState('');
  const { parseEmail, isLoading, currentParsedData, clearCurrent } = useInboxStore();

  const handleAnalyze = () => {
    if (emailText.trim()) {
      parseEmail(emailText);
    }
  };

  const handleClear = () => {
    setEmailText('');
    clearCurrent();
  };

  return (
    <div className="space-y-6">
      <div className="glass-card p-6">
        <h2 className="text-xl font-bold mb-4">Email Inquiry Parser</h2>
        <Textarea
          value={emailText}
          onChange={(e) => setEmailText(e.target.value)}
          placeholder="Paste client email or inquiry here...

Example: Hi! My name is Sarah and I'm planning my wedding for next March at Atlantis The Palm. We're looking for a photographer who can capture both traditional and contemporary shots. Our budget is around AED 20,000. We need full day coverage. Can you also provide a highlight video?"
          className="min-h-[200px] glass-card border-white/20 focus:border-[#00F5FF] transition-colors resize-none"
          disabled={isLoading}
        />
        <div className="flex gap-3 mt-4">
          <Button
            onClick={handleAnalyze}
            disabled={!emailText.trim() || isLoading}
            className="flex-1 bg-gradient-to-r from-[#00F5FF] to-[#B026FF] hover:opacity-90 transition-opacity"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              'Analyze Inquiry'
            )}
          </Button>
          {(emailText || currentParsedData) && (
            <Button
              onClick={handleClear}
              variant="outline"
              className="glass-button"
              disabled={isLoading}
            >
              Clear
            </Button>
          )}
        </div>
      </div>

      <AnimatePresence>
        {currentParsedData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <ParsedDataDisplay />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
