'use client';

import localFont from 'next/font/local';
import ReduxProvider from '../store/Providers';
import './globals.css';
import Header from './header';
import Footer from './footer';
import { usePathname } from 'next/navigation';
import { AuthProvider } from '@/context/auth-context';

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
        <ReduxProvider>
          <AuthProvider>
            <Header currentPage={currentPage} />
            <main className="flex flex-1 flex-col">{children}</main>
            <Footer />
          </AuthProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
