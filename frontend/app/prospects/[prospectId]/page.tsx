import { getProspectById } from '@/lib/firebase/firestore'
import { getAuthenticatedAppForUser } from '@/lib/firebase/serverApp'
import { currentUser } from '@clerk/nextjs/server'
import { getFirestore } from 'firebase/firestore'

export default async function ProspectPage({ params }: { params: { prospectId: string } }) {
  const { prospectId } = await params
  const user = await currentUser()

  const { firebaseServerApp } = await getAuthenticatedAppForUser()
  const prospect = await getProspectById(getFirestore(firebaseServerApp, 'database'), '0O5Kww29fK4qCYK9Hido')

  console.log({ prospect, user, prospectId })
  return <div>ProspectPage</div>
}
