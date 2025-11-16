'use client';

import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';

interface LeadScoreProps {
  score: number;
}

export function LeadScore({ score }: LeadScoreProps) {
  const percentage = (score / 10) * 100;

  const getScoreColor = () => {
    if (score >= 7) return 'text-green-400';
    if (score >= 4) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreBg = () => {
    if (score >= 7) return 'from-green-400/20 to-green-400/0';
    if (score >= 4) return 'from-yellow-400/20 to-yellow-400/0';
    return 'from-red-400/20 to-red-400/0';
  };

  const getRecommendation = () => {
    if (score >= 7) return 'High Priority - Follow up immediately';
    if (score >= 4) return 'Medium Priority - Respond within 24 hours';
    return 'Low Priority - Standard follow-up';
  };

  const getRecommendationBadge = () => {
    if (score >= 7) return 'high-priority';
    if (score >= 4) return 'medium-priority';
    return 'low-priority';
  };

  return (
    <div className="glass-card p-6">
      <h2 className="text-xl font-bold mb-6">Lead Qualification Score</h2>

      <div className="flex items-center gap-8">
        <div className="relative w-32 h-32">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="64"
              cy="64"
              r="56"
              stroke="rgba(255, 255, 255, 0.1)"
              strokeWidth="8"
              fill="none"
            />
            <motion.circle
              cx="64"
              cy="64"
              r="56"
              stroke={score >= 7 ? '#10b981' : score >= 4 ? '#f59e0b' : '#ef4444'}
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
              initial={{ strokeDasharray: '0 352' }}
              animate={{ strokeDasharray: `${(352 * percentage) / 100} 352` }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center flex-col">
            <motion.span
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.3 }}
              className={`text-4xl font-bold ${getScoreColor()}`}
            >
              {score}
            </motion.span>
            <span className="text-xs text-muted-foreground">out of 10</span>
          </div>
        </div>

        <div className="flex-1">
          <div className="space-y-3">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Score Breakdown</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Budget Potential</span>
                  <div className="flex gap-1">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className={`w-2 h-2 rounded-full ${
                          i <= Math.ceil((score / 10) * 3)
                            ? 'bg-[#00F5FF]'
                            : 'bg-white/10'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Timeline Clarity</span>
                  <div className="flex gap-1">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className={`w-2 h-2 rounded-full ${
                          i <= Math.ceil((score / 10) * 3)
                            ? 'bg-[#00F5FF]'
                            : 'bg-white/10'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Requirements Detail</span>
                  <div className="flex gap-1">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className={`w-2 h-2 rounded-full ${
                          i <= Math.ceil((score / 10) * 3)
                            ? 'bg-[#00F5FF]'
                            : 'bg-white/10'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-white/10">
              <p className="text-sm text-muted-foreground mb-2">Recommendation</p>
              <Badge
                className={`${
                  score >= 7
                    ? 'bg-green-400/20 text-green-400 border-green-400/30'
                    : score >= 4
                    ? 'bg-yellow-400/20 text-yellow-400 border-yellow-400/30'
                    : 'bg-red-400/20 text-red-400 border-red-400/30'
                } border`}
              >
                {getRecommendation()}
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
