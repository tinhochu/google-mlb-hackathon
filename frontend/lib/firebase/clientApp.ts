'use client'

import firebaseConfig from '@/firebaseConfig'
import { getApps, initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'

export const firebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]
export const auth = getAuth(firebaseApp)
