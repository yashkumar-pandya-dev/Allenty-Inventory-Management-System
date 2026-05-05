"use client";
import './globals.css';
import Sidebar from '../components/Sidebar';
import { usePathname } from 'next/navigation';
import { ThemeProvider } from '../context/ThemeContext';

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const isAuthPage = pathname === '/' || pathname === '/forgot-password' || pathname?.startsWith('/reset-password');

  return (
    <html lang="en" suppressHydrationWarning>
      <body className="flex min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-200">
        <ThemeProvider>
          {!isAuthPage && <Sidebar />}
          <main className={`flex-1 ${!isAuthPage ? 'p-8 overflow-y-auto' : ''}`}>
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
