'use client';

import { Header } from '@/components/layout/header';
import { Settings } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="min-h-screen">
      <Header title="Settings" />

      <div className="p-6">
        <div className="glass-card p-12 flex flex-col items-center justify-center min-h-[600px]">
          <Settings className="w-20 h-20 text-[#B026FF] mb-6" />
          <h2 className="text-2xl font-bold gradient-text mb-2">Settings Coming Soon</h2>
          <p className="text-muted-foreground text-center max-w-md">
            Configure your preferences, notifications, integrations, and more.
          </p>
        </div>
      </div>
    </div>
  );
}
