import { Avatar } from '@/components/ui/avatar'
import { getProspectById } from '@/lib/firebase/firestore'
import { getAuthenticatedAppForUser } from '@/lib/firebase/serverApp'
import { currentUser } from '@clerk/nextjs/server'
import { getFirestore } from 'firebase/firestore'
import Image from 'next/image'

export default async function ProspectPage({ params }: { params: { prospectId: string } }) {
  const { prospectId } = await params
  const user = await currentUser()

  const { firebaseServerApp } = await getAuthenticatedAppForUser()
  const prospect = await getProspectById(getFirestore(firebaseServerApp, 'database'), prospectId)
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/mlb/prospects/${prospectId}`)
  const data = await response.json()

  return (
    <div className="min-h-lvh relative">
      <div style={{ backgroundImage: `url(${data.prospectImgBackground})` }} className="h-[250px] w-full relative">
        <div className="absolute bottom-0 left-0 h-full w-full bg-gradient-to-b from-transparent to-black/70"></div>
      </div>
      <div className="max-w-screen-xl mx-auto h-[0px]">
        <div className="flex gap-4 -translate-y-3/4">
          <div className="grow-0 h-[200px] aspect-[2/3] bg-white shadow border-4 relative">
            <Image src={data.prospectImgHeadshot} alt={data.prospect.fullName} fill />
          </div>
          <div className="flex flex-col gap-2 mt-4">
            <h1 className="text-3xl text-white font-bold">{data.prospect.fullName}</h1>
            <p className="text-2xl text-white font-bold">
              {data.prospect.primaryPosition.abbreviation} | B/T: {data.prospect.batSide.code} /{' '}
              {data.prospect.pitchHand.code} | {data.prospect.height} / {data.prospect.weight}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
