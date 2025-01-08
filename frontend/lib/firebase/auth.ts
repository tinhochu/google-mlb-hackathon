import { auth } from '@/lib/firebase/clientApp'
import { GoogleAuthProvider, User, onAuthStateChanged as _onAuthStateChanged, signInWithPopup } from 'firebase/auth'

export function onAuthStateChanged(cb: (user: User | null) => void) {
  return _onAuthStateChanged(auth, cb)
}

export async function signInWithGoogle() {
  const provider = new GoogleAuthProvider()

  try {
    await signInWithPopup(auth, provider)
  } catch (error) {
    console.error('Error signing in with Google', error)
    throw error
  }
}

export async function signOut() {
  try {
    return auth.signOut()
  } catch (error) {
    console.error('Error signing out with Google', error)
    throw error
  }
}
