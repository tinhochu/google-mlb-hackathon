// enforces that this code can only be called on the server
// https://nextjs.org/docs/app/building-your-application/rendering/composition-patterns#keeping-server-only-code-out-of-the-client-environment
import firebaseConfig from '@/firebaseConfig'
import { initializeServerApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { headers } from 'next/headers'
import 'server-only'

export async function getAuthenticatedAppForUser() {
  const headersList = await headers()
  const authHeader = headersList.get('Authorization')
  const idToken = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split('Bearer ')[1] : undefined

  const firebaseServerApp = initializeServerApp(
    firebaseConfig,
    idToken
      ? {
          authIdToken: idToken,
        }
      : {}
  )

  const auth = getAuth(firebaseServerApp)
  await auth.authStateReady()

  return { firebaseServerApp, currentUser: auth.currentUser }
}
