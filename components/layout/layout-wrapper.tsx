'use client';

import { usePathname } from 'next/navigation';
import { Sidebar } from './sidebar';

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Auth pages don't need sidebar
  const authPages = ['/login', '/register', '/auth'];
  const isAuthPage = authPages.some(page => pathname?.startsWith(page));

  if (isAuthPage) {
    return <main className="flex-1">{children}</main>;
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
