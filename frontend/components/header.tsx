'use client'

import Spinner from '@/components/spinner'
import { Button } from '@/components/ui/button'
import firebaseConfig from '@/firebaseConfig'
import { signInWithGoogle, signOut } from '@/lib/firebase/auth'
import { onAuthStateChanged } from '@/lib/firebase/auth'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

function useUserSession(initialUser: any) {
  // The initialUser comes from the server via a server component
  const [user, setUser] = useState(initialUser)
  const router = useRouter()

  // Register the service worker that sends auth state back to server
  // The service worker is built with npm run build-service-worker
  // useEffect(() => {
  //   if ('serviceWorker' in navigator) {
  //     const serializedFirebaseConfig = encodeURIComponent(JSON.stringify(firebaseConfig))
  //     const serviceWorkerUrl = `/auth-service-worker.js?firebaseConfig=${serializedFirebaseConfig}`

  //     navigator.serviceWorker
  //       .register(serviceWorkerUrl)
  //       .then((registration) => console.log('scope is: ', registration.scope))
  //   }
  // }, [])

  useEffect(() => {
    const unsubscribe = onAuthStateChanged((authUser) => {
      setUser(authUser)
    })

    return () => unsubscribe()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    onAuthStateChanged((authUser) => {
      if (user === undefined) return

      // refresh when user changed to ease testing
      if (user?.email !== authUser?.email) {
        router.refresh()
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  return user
}

export default function Header({ initialUser }: any) {
  const user = useUserSession(initialUser)
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
          <a href="/" className="flex flex-col">
            <div className="flex items-center">
              <img src="/mlb-logo.svg" className="mr-3 h-6 sm:h-9" alt="MLB™ P3: Prospect Potential Predictor" />
              <span className="self-center text-4xl text-white font-semibold whitespace-nowrap">P3</span>
            </div>
            <span className="text-white text-xs font-medium">Prospect Potential Predictor</span>
          </a>
          <div className="flex items-center lg:order-2">
            {user ? (
              <div className="flex items-center gap-2">
                <Link href="/dashboard">
                  <Button variant="link">Dashboard</Button>
                </Link>
                <Button onClick={handleSignOut}>{'Sign out'}</Button>
              </div>
            ) : (
              <Button className="text-white font-medium" onClick={handleSignIn} disabled={isLoading}>
                {isLoading ? <Spinner /> : 'Sign in'}
              </Button>
            )}
          </div>
        </div>
      </nav>
    </header>
  )
}
