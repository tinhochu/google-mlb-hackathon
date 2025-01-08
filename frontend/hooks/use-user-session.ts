'use client'

import firebaseConfig from '@/firebaseConfig'
import { onAuthStateChanged } from '@/lib/firebase/auth'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

function useUserSession(initialUser: any) {
  // The initialUser comes from the server via a server component
  const [user, setUser] = useState(initialUser)
  const [isUserFetched, setIsUserFetched] = useState(false)
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
      setIsUserFetched(true)
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

  return { user, isUserFetched }
}

export { useUserSession }
