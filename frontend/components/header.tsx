'use client'

import { ModeToggle } from '@/components/mode-toggle'
import Spinner from '@/components/spinner'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useUserSession } from '@/hooks/use-user-session'
import { signInWithGoogle, signOut } from '@/lib/firebase/auth'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

export default function Header({ initialUser }: any) {
  const { user, isUserFetched } = useUserSession(initialUser)
  const [isLoading, setIsLoading] = useState(false)

  const handleSignOut = (event: any) => {
    event.preventDefault()
    signOut()
  }

  const handleSignIn = async (event: any) => {
    try {
      event.preventDefault()
      setIsLoading(true)
      await signInWithGoogle()
      setIsLoading(false)
    } catch (error) {
      console.error('Sign in failed:', error)
      setIsLoading(false)
    }
  }

  return (
    <header>
      <nav className="bg-mlb-primary border-gray-200 px-4 lg:px-6 py-2.5 dark:bg-gray-800">
        <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
          <Link href="/" className="flex flex-col">
            <div className="flex items-center">
              <Image
                src="/mlb-logo.svg"
                className="mr-3 h-6 sm:h-9"
                alt="MLB™ P3: Prospect Potential Predictor"
                width={65}
                height={36}
              />
              <span className="self-center text-4xl text-white font-semibold whitespace-nowrap">P3</span>
            </div>
            <span className="text-white text-xs font-medium">Prospect Potential Predictor</span>
          </Link>
          <div className="flex items-center lg:order-2">
            <div className="flex items-center gap-2">
              {!isUserFetched ? (
                <Skeleton className="w-[100px] h-[36px] rounded bg-primary" />
              ) : (
                <>
                  {user ? (
                    <div className="flex items-center gap-2">
                      <Link href="/dashboard">
                        <Button variant="link" className="text-white">
                          Dashboard
                        </Button>
                      </Link>
                      <Button onClick={handleSignOut}>{'Sign out'}</Button>
                    </div>
                  ) : (
                    <Button className="text-white font-medium" onClick={handleSignIn} disabled={isLoading}>
                      {isLoading ? <Spinner /> : 'Sign in'}
                    </Button>
                  )}
                </>
              )}
              <ModeToggle />
            </div>
          </div>
        </div>
      </nav>
    </header>
  )
}
