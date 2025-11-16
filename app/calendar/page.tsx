'use client';

import { Header } from '@/components/layout/header';
import { Calendar } from 'lucide-react';

export default function CalendarPage() {
  return (
    <div className="min-h-screen">
      <Header title="Calendar" />

      <div className="p-6">
        <div className="glass-card p-12 flex flex-col items-center justify-center min-h-[600px]">
          <Calendar className="w-20 h-20 text-[#00F5FF] mb-6" />
          <h2 className="text-2xl font-bold gradient-text mb-2">Calendar Coming Soon</h2>
          <p className="text-muted-foreground text-center max-w-md">
            Schedule and manage your photography sessions, client meetings, and deadlines all in one place.
          </p>
        </div>
      </div>
    </div>
  );
}
