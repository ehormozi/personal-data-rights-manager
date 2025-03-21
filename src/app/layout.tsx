'use client';

import localFont from 'next/font/local';
import { usePathname } from 'next/navigation';

import { AuthProvider } from '@/context/auth-context';
import { LoadingProvider } from '@/context/loading-context';

import './globals.css';
import Header from './header';
import Footer from './footer';
import LoaderWrapper from '@/app/dashboard/components/material/loader-wrapper';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const currentPage = pathname === '/' ? 'dashboard' : pathname.slice(1);

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen bg-gray-50 text-gray-900`}
      >
        <LoadingProvider>
          <AuthProvider>
            <LoaderWrapper>
              <Header currentPage={currentPage} />
              <main className="flex flex-1 flex-col">{children}</main>
              <Footer />
            </LoaderWrapper>
          </AuthProvider>
        </LoadingProvider>
      </body>
    </html>
  );
}
