'use client'

import Logo from '@/components/logo'
import { ModeToggle } from '@/components/mode-toggle'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { SignInButton, SignedIn, SignedOut, UserButton, useUser } from '@clerk/nextjs'
import Link from 'next/link'

export default function Header() {
  const { isLoaded } = useUser()

  return (
    <header>
      <nav className="bg-mlb-primary border-gray-200 px-4 lg:px-6 py-2.5 dark:bg-gray-800">
        <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
          <Logo />
          <div className="flex items-center lg:order-2">
            <div className="flex items-center gap-4">
              {isLoaded ? (
                <>
                  <SignedOut>
                    <SignInButton>
                      <Button>Sign in</Button>
                    </SignInButton>
                  </SignedOut>
                  <SignedIn>
                    <Link href="/favorites" className="underline text-white">
                      My Favorites
                    </Link>
                    <UserButton />
                  </SignedIn>
                </>
              ) : (
                <Skeleton className="w-[100px] h-[36px] rounded bg-primary" />
              )}
              <ModeToggle />
            </div>
          </div>
        </div>
      </nav>
    </header>
  )
}
