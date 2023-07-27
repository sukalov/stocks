import './globals.css';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { GlobalNav } from '@/components/global-nav';
import '@total-typescript/ts-reset';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'JaKoTa',
  description: 'Stock data for some Japan, Taiwan and South Korea companies',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider disableTransitionOnChange attribute="class" enableSystem={false} defaultTheme="light">
          <GlobalNav />
          <main className="mt-16 sm:px-16 lg:px-32">{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}
