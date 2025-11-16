'use client';

import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

interface StatsCardProps {
  title: string;
  value: number;
  change: number;
  icon: LucideIcon;
  prefix?: string;
  suffix?: string;
  delay?: number;
}

export function StatsCard({
  title,
  value,
  change,
  icon: Icon,
  prefix = '',
  suffix = '',
  delay = 0
}: StatsCardProps) {
  const [count, setCount] = useState(0);
  const isPositive = change >= 0;

  useEffect(() => {
    let startTime: number;
    const duration = 1000;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);

      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(value * easeOutQuart));

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(value);
      }
    };

    const timer = setTimeout(() => {
      requestAnimationFrame(animate);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay: delay / 1000,
        type: 'spring',
        stiffness: 300,
        damping: 30
      }}
      className="glass-card p-6"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-muted-foreground mb-2">{title}</p>
          <h3 className="text-3xl font-bold mb-2">
            {prefix}
            {count.toLocaleString()}
            {suffix}
          </h3>
          <div className="flex items-center gap-2">
            <span
              className={`text-sm font-medium ${
                isPositive ? 'text-green-400' : 'text-red-400'
              }`}
            >
              {isPositive ? '↑' : '↓'} {Math.abs(change)}%
            </span>
            <span className="text-xs text-muted-foreground">vs last month</span>
          </div>
        </div>
        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#00F5FF]/20 to-[#B026FF]/20 flex items-center justify-center">
          <Icon className="w-6 h-6 text-[#00F5FF]" />
        </div>
      </div>
    </motion.div>
  );
}
