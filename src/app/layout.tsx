import './globals.css'
import { Inter } from 'next/font/google'
import { ThemeProvider } from '@/components/theme-provider'
import { ServerThemeProvider } from 'next-themes'
import { GlobalNav } from '@/components/global-nav'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'JaKoTa',
  description: 'Stock data for some Japan, Taiwan and South Korea companies',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ServerThemeProvider disableTransitionOnChange>
      <html lang="en">
          <body className={inter.className}>
            <ThemeProvider disableTransitionOnChange>
              <GlobalNav />
              <main className='mt-16 sm:px-16 lg:px-32'>
                {children}
              </main>
            </ThemeProvider>
          </body>
      </html>
    </ServerThemeProvider>
  )
}
