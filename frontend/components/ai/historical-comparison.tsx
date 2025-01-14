'use client'

import { Counter } from '@/components/counter'
import GPTTypingEffect from '@/components/gpt-typing-effect'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import apiClient from '@/lib/apiClient'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'

interface Props {
  playersData: any[]
}

function HistoricalComparisonSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Image src="/gemini.svg" alt="Gemini" width={20} height={20} className="animate-spin" />
          <p className="text-xl font-bold">Gemini Historical Comparison</p>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4">
          {Array.from({ length: 3 }).map((_, index) => {
            return (
              <div key={index} className="col-span-1">
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_100px] gap-2">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <Skeleton className="w-10 h-10 rounded-full" />
                      <div className="flex flex-col gap-2">
                        <Skeleton className="w-52 h-7" />
                        <Skeleton className="w-24 h-5" />
                      </div>
                    </div>
                    <div className="pl-[48px] flex flex-col gap-2">
                      <Skeleton className="w-full h-5" />
                      <Skeleton className="w-full h-5" />
                      <Skeleton className="w-24 h-5" />
                    </div>
                  </div>
                  <div className="flex flex-col items-center justify-center gap-2 h-[100px] border-8 border-primary rounded-full">
                    <Skeleton className="w-[100px] h-[100px] rounded-full" />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

function HistoricalComparison({ playersData }: Props) {
  const [players, setPlayers] = useState(playersData ?? [])
  const [fetching, setFetching] = useState(false)

  useEffect(
    function fetchMLBPlayers() {
      const fetchPlayers = async () => {
        // If no players, return
        if (!players || players.length === 0) return

        setFetching(true)

        try {
          // Iterate over players and fetch data
          const playersData = await Promise.all(
            players.map(async (player) => {
              const { data } = await apiClient.get(`/mlb/players?name=${player.name}`)
              console.log({
                ...player,
                ...data[0], // Assuming data[0] is always valid
              })
              return {
                ...player,
                ...data[0], // Assuming data[0] is always valid
              }
            })
          )

          // Save the new Array of players and information aggregating both the player and the information
          setPlayers(playersData)
        } catch (error) {
          console.error('Error fetching player data:', error)
        } finally {
          setFetching(false)
        }
      }

      fetchPlayers()
    },
    [playersData]
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Image src="/gemini.svg" alt="Gemini" width={20} height={20} className={cn(fetching && 'animate-spin')} />
          <p className="text-xl font-bold">Gemini Historical Comparison</p>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4">
          {players.map((player) => {
            return (
              <div key={player?.id} className="col-span-1">
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_100px] gap-2">
                  <div className="flex flex-col gap-2">
                    <Link
                      href={`https://www.mlb.com/player/${player?.nameSlug}`}
                      target="_blank"
                      className="flex items-center gap-2"
                    >
                      <img
                        src={`https://midfield.mlbstatic.com/v1/people/${player?.id}/spots/60?zoom=1.2`}
                        alt={player?.name}
                        width={40}
                        height={40}
                      />
                      <div>
                        <p className="text-lg font-bold">{player?.name}</p>
                        <p className="text-sm font-medium text-muted-foreground">
                          {player?.primaryPosition?.abbreviation}
                        </p>
                      </div>
                    </Link>
                    <div className="pl-[48px]">
                      <GPTTypingEffect text={player?.explanation} className="text-sm" />
                    </div>
                  </div>
                  <div className="flex flex-col items-center justify-center gap-2 h-[100px] border-8 border-primary rounded-full">
                    <p className="[&>span]:text-5xl [&>span]:font-bold [&>span]:text-primary relative">
                      <Counter end={player?.similarityPercentage} />
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

export { HistoricalComparison, HistoricalComparisonSkeleton }
