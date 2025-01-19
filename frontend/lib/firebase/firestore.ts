import firebaseConfig from '@/firebaseConfig'
import { initializeApp } from 'firebase/app'
import {
  Firestore,
  Timestamp,
  addDoc,
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  onSnapshot,
  orderBy,
  query,
  runTransaction,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore'

let db: Firestore | null = null

function getDb(): Firestore {
  if (!db) {
    const app = initializeApp(firebaseConfig)
    db = getFirestore(app)
  }
  return db
}

export async function getFavoriteProspectsByUserId(userId: string): Promise<{ id: string }[]> {
  try {
    const db = getDb() // Use the singleton instance

    const userDocRef = doc(db, `users/${userId}`)
    const userDocSnap = await getDoc(userDocRef)

    if (userDocSnap.exists()) {
      const data = userDocSnap.data()
      return data.favoriteProspects || []
    } else {
      console.log(`No document found for userId: ${userId}`)
      return []
    }
  } catch (error) {
    console.error('Error getting favorite prospects: ', error)
    throw error // Rethrow the error for the caller to handle
  }
}
