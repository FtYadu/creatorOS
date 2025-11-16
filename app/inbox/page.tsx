'use client';

import { Header } from '@/components/layout/header';
import { EmailParser } from '@/components/inbox/email-parser';

export default function InboxPage() {
  return (
    <div className="min-h-screen">
      <Header title="Inbox" />

      <div className="p-6">
        <EmailParser />
      </div>
    </div>
  );
}
