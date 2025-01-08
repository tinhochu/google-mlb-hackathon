'use client'

import { TooltipProvider } from '@/components/ui/tooltip'
import NextTopLoader from 'nextjs-toploader'
import { ReactNode } from 'react'

const ClientLayout = ({ children }: { children: ReactNode }) => {
  return (
    <TooltipProvider>
      {/* Show a progress bar at the top when navigating between pages */}
      <NextTopLoader color={'#1044b2'} showSpinner={false} />

      {/* Content inside app/page.tsx.js files  */}
      {children}
    </TooltipProvider>
  )
}

export default ClientLayout
