import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/lib/auth-context';
import { LayoutWrapper } from '@/components/layout/layout-wrapper';

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
        <AuthProvider>
          <LayoutWrapper>{children}</LayoutWrapper>
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
        </AuthProvider>
      </body>
    </html>
  );
}
