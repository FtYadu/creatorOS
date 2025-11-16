import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Sidebar } from '@/components/layout/sidebar';
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'CreatorOS AI - Studio Management Platform',
  description: 'AI-powered photography studio management system',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <div className="flex h-screen overflow-hidden">
          <Sidebar />
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
        </div>
        <Toaster
          position="top-right"
          toastOptions={{
            className: 'glass-card border-white/10',
            style: {
              background: 'rgba(26, 26, 26, 0.9)',
              color: '#fff',
              backdropFilter: 'blur(12px)',
            },
            success: {
              iconTheme: {
                primary: '#00F5FF',
                secondary: '#0a0a0a',
              },
            },
          }}
        />
      </body>
    </html>
  );
}
