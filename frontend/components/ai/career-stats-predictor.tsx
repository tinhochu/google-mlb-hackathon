import { DebutChart } from '@/components/charts/debut-chart'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { model } from '@/lib/gemini'
import Image from 'next/image'
import { Suspense } from 'react'

const prompt = (prospect: any, stats: any) => `
  You are a baseball analyst. You are given a player's stats and you are tasked with predicting their career stats.
  I want you to return a list historical players that are similar to the player in question.
  if possible, I want to make some short comparison between the player in question and the historical players.
  and the percentage chance of the player in question matching the historical players.

  here is the player in question:
  ${JSON.stringify(prospect)}

  here is the player's first season stats in minor league:
  ${JSON.stringify(stats)}

  create a JSON Object with a short synopsis of the player and the historical players. called synopsis.
  add a key called historicalPlayers with a list of historical players, this name and an explanation of how they are similar to the player in question.

  please return JSON output with the following keys:
  - synopsis
  - historicalPlayers
`

function CareerStatsPredictorSkeleton() {
  return (
    <Card className="bg-transparent border-none">
      <CardHeader className="px-0">
        <CardTitle className="flex items-center gap-2">
          <Image src="/gemini.svg" alt="Gemini" width={20} height={20} className="animate-spin" />
          <p className="text-xl font-bold">Vertex Career Stats Predictor</p>
        </CardTitle>
      </CardHeader>
      <CardContent className="px-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="flex flex-col">
            <CardHeader className="pb-0">
              <CardTitle>
                <p className="text-lg font-bold">Expected Chance of Debut</p>
              </CardTitle>
              <CardDescription>Calculated based on the first Season of the Minor League Season</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
              <div className="flex items-center justify-center">
                <Skeleton className="w-[212px] h-[212px] rounded-full" />
              </div>
            </CardContent>
            <CardFooter className="flex-col gap-2 text-sm">
              <div className="flex items-center gap-2 font-medium leading-none">Expected Chance of Debut</div>
              <div className="leading-none text-center text-muted-foreground">
                This is the chance of debuting in the next 3 years
              </div>
            </CardFooter>
          </Card>
          <div className="col-span-1">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="col-span-1 aspect-square">
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <p className="text-lg font-bold text-center">Career WAR</p>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="min-h-24"></CardContent>
                </Card>
              </div>
              <div className="col-span-1 aspect-square">
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-center">
                      <p className="text-lg font-bold text-center">Career H</p>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="min-h-24"></CardContent>
                </Card>
              </div>
              <div className="col-span-1 aspect-square">
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <p className="text-lg font-bold text-center">Career HR</p>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="min-h-24"></CardContent>
                </Card>
              </div>
              <div className="col-span-1 aspect-square">
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <p className="text-lg font-bold text-center">Career BA</p>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="min-h-24"></CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

async function CareerStatsPredictor({ prospect, stats }: { prospect: any; stats: any }) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/vertex`, {
    method: 'POST',
    body: JSON.stringify({
      data: {
        draftYear: prospect?.person?.draftYear,
        pickOverall: prospect?.pickNumber,
        height: prospect?.person?.height,
        weight: prospect?.person?.weight,
        primaryPositon: prospect?.person?.primaryPosition?.abbreviation,
        battingHand: prospect?.person?.batSide?.code,
        throwingHand: prospect?.person?.pitchHand?.code,
        draftTeam: prospect?.team?.name,
        isPitcher: prospect?.person?.primaryPosition?.abbreviation === 'P',
        ...stats?.splits[0]?.stat,
      },
    }),
  })

  const body = await response.json()
  const historicalResults = await model.generateContent(prompt(prospect, stats))

  return (
    <Card className="bg-transparent border-none">
      <CardHeader className="px-0">
        <CardTitle className="flex items-center gap-2">
          <Image src="/gemini.svg" alt="Gemini" width={20} height={20} />
          <p className="text-xl font-bold">Vertex Career Stats Predictor</p>
        </CardTitle>
      </CardHeader>
      <CardContent className="px-0">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="col-span-1 lg:col-span-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <DebutChart data={body.data.mlbDebut} />
              <div className="col-span-1">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="col-span-1 aspect-square">
                    <Card className="h-full">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <p className="text-lg font-bold text-center">Career WAR</p>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="min-h-24"></CardContent>
                    </Card>
                  </div>
                  <div className="col-span-1 aspect-square">
                    <Card className="h-full">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-center">
                          <p className="text-lg font-bold text-center">Career H</p>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="min-h-24"></CardContent>
                    </Card>
                  </div>
                  <div className="col-span-1 aspect-square">
                    <Card className="h-full">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <p className="text-lg font-bold text-center">Career HR</p>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="min-h-24"></CardContent>
                    </Card>
                  </div>
                  <div className="col-span-1 aspect-square">
                    <Card className="h-full">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <p className="text-lg font-bold text-center">Career BA</p>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="min-h-24"></CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-span-1 lg:col-span-4">
            <Suspense fallback={<div>Loading...</div>}>{JSON.stringify(historicalResults.response)}</Suspense>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export { CareerStatsPredictor, CareerStatsPredictorSkeleton }
