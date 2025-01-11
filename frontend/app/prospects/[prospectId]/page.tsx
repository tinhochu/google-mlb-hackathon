import { ScoutingReportGrades, ScoutingReportGradesSkeleton } from '@/components/ai/scouting-report-grades'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getProspectById } from '@/lib/firebase/firestore'
import { getAuthenticatedAppForUser } from '@/lib/firebase/serverApp'
import { currentUser } from '@clerk/nextjs/server'
import { getFirestore } from 'firebase/firestore'
import { ArrowLeft } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { Suspense } from 'react'

export default async function ProspectPage({
  params,
  searchParams,
}: {
  params: { prospectId: string }
  searchParams: { teamId: string; year: string }
}) {
  const { prospectId } = await params
  const { teamId, year } = await searchParams
  const user = await currentUser()

  const { firebaseServerApp } = await getAuthenticatedAppForUser()
  const prospect = await getProspectById(getFirestore(firebaseServerApp, 'database'), prospectId)
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/mlb/prospects/${prospectId}?teamId=${teamId}&year=${year}`
  )
  const data = await response.json()

  return (
    <div className="min-h-lvh relative bg-primary-foreground">
      <div
        style={{ backgroundImage: `url(${data.prospectImgBackground})` }}
        className="h-[300px] w-full relative flex items-center justify-center"
      >
        <div className="absolute bottom-0 left-0 h-full w-full bg-gradient-to-b from-black/60 to-black/60"></div>

        <div className="max-w-screen-xl mx-auto w-full z-10">
          <div className="flex flex-col">
            <Link href={`/`} className="mb-4 inline-block">
              <Button variant="link" className="text-white pl-0">
                <ArrowLeft className="w-6 h-6" /> Back
              </Button>
            </Link>

            <div className="flex justify-between gap-4">
              <div className="flex gap-4 justify-between">
                <div className="grow-0 w-[125px] aspect-square bg-white shadow border-4 relative">
                  <Image
                    src={
                      data?.prospectImgHeadshot ??
                      `https://img.mlbstatic.com/mlb-photos/image/upload/d_people:generic:headshot:silo:current.png/w_400,q_auto:best/v1/people/${data.prospect.person.id}/headshot/draft/current`
                    }
                    alt={data?.prospect?.person?.fullName ?? ''}
                    fill
                  />
                </div>
                <div className="flex flex-col gap-2 mt-4">
                  <h1 className="text-3xl text-white font-bold">{data.prospect?.person?.fullName ?? ''}</h1>
                  <p className="text-2xl text-white font-bold">
                    {data.prospect?.person?.primaryPosition?.abbreviation} <span className="font-normal">|</span> B/T:{' '}
                    {data.prospect?.person?.batSide?.code} / {data.prospect?.person?.pitchHand?.code}{' '}
                    <span className="font-normal">|</span> {data.prospect?.person?.height} /{' '}
                    {data.prospect?.person?.weight}
                  </p>
                  <div className="flex gap-2 items-center">
                    <Avatar className="border border-primary border-2 p-1 bg-white">
                      <AvatarImage src={`https://www.mlbstatic.com/team-logos/${data.team.id}.svg`} />
                      <AvatarFallback>{data.team?.abbreviation}</AvatarFallback>
                    </Avatar>
                    <p className="text-xl text-white font-bold">{data.team?.name}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-screen-xl mx-auto w-full py-8">
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-8">
            <div className="flex flex-col gap-4">
              <Suspense fallback={<ScoutingReportGradesSkeleton />}>
                <ScoutingReportGrades prospect={data.prospect} stats={data.prospectStats} />
              </Suspense>
            </div>
          </div>
          <div className="col-span-4">
            <Card>
              <CardHeader>
                <CardTitle>Drafted</CardTitle>
              </CardHeader>
              <CardContent>asd</CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
