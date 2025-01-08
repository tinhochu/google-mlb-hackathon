'use client'

import { Button } from '@/components/ui/button'
import { Home } from 'lucide-react'
import Error from 'next/error'
import Link from 'next/link'

export default function ErrorPage({ error, reset }: { error: Error & { message?: string }; reset: () => void }) {
  return (
    <>
      <div className="h-dvh w-full flex flex-col justify-center items-center text-center gap-6 p-6">
        <p className="font-medium md:text-xl md:font-semibold">Something went wrong 🥲</p>

        <p className="text-red-500">{error?.message}</p>

        <div className="flex flex-wrap gap-4 justify-center">
          <Button className="btn btn-sm" onClick={reset}>
            Refresh
          </Button>
          <Link href="/" className="">
            <Button>
              <Home />
              Home
            </Button>
          </Link>
        </div>
      </div>
    </>
  )
}
