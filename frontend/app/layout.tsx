import ClientLayout from '@/components/client-layout'
import { Footer } from '@/components/footer'
import Header from '@/components/header'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/toaster'
import config from '@/config'
import { cn } from '@/lib/utils'
import { ClerkProvider } from '@clerk/nextjs'
import { OpenPanelComponent } from '@openpanel/nextjs'
import { Analytics } from '@vercel/analytics/react'
import type { Metadata } from 'next'
import { Work_Sans } from 'next/font/google'

import './globals.css'

const workSans = Work_Sans({
  variable: '--font-work-sans',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: config.appName,
  description: config.appName,
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider>
      <OpenPanelComponent clientId={process.env.NEXT_PUBLIC_OPENPANEL_CLIENT_ID!} trackScreenViews={true} />
      <html lang="en" suppressHydrationWarning>
        <body className={cn(workSans.variable, workSans.className, 'antialiased bg-primary-foreground')}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <ClientLayout>
              <Header />
              <main>{children}</main>
              <Footer />
              <Toaster />
            </ClientLayout>
            <Analytics />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
