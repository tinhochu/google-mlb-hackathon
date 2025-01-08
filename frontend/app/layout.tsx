import ClientLayout from '@/components/client-layout'
import Header from '@/components/header'
import { Toaster } from '@/components/ui/toaster'
import { getAuthenticatedAppForUser } from '@/lib/firebase/serverApp'
import { cn } from '@/lib/utils'
import type { Metadata } from 'next'
import { Work_Sans } from 'next/font/google'

import './globals.css'

const workSans = Work_Sans({
  variable: '--font-work-sans',
  subsets: ['latin'],
})

// * Force next.js to treat this route as server-side rendered
// * Without this line, during the build process, next.js will treat this route as static and build a static HTML file for it
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'MLB™ P3: Prospect Potential Predictor',
  description: 'MLB™ P3: Prospect Potential Predictor',
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const { currentUser } = await getAuthenticatedAppForUser()

  return (
    <html lang="en">
      <body className={cn(workSans.variable, workSans.className, 'antialiased')}>
        <ClientLayout>
          <Header initialUser={currentUser?.toJSON()} />
          <main className="mx-auto max-w-screen-xl min-h-lvh">{children}</main>
          <Toaster />
        </ClientLayout>
      </body>
    </html>
  )
}
