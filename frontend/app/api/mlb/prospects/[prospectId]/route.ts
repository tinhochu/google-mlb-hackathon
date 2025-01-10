import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest, { params }: { params: { prospectId: string } }) {
  try {
    // Get the prospectId from the params
    const { prospectId } = await params

    // Fetch both the prospect and their stats concurrently
    const [prospectResponse, prospectStatsResponse, prospectImgHeadshotResponse, prospectImgBackgroundResponse] =
      await Promise.all([
        fetch(`https://statsapi.mlb.com/api/v1/people/${prospectId}`),
        fetch(
          `https://statsapi.mlb.com/api/v1/people/${prospectId}/stats?stats=yearByYear,career,yearByYearAdvanced,careerAdvanced&leagueListId=milb_all`
        ),
        fetch(
          `https://img.mlbstatic.com/mlb-photos/image/upload/c_fill,g_auto/w_180/v1/people/${prospectId}/headshot/milb/current`
        ),
        fetch(
          `https://img.mlbstatic.com/mlb-photos/image/upload/d_people:generic:action:hero:milb:current.jpg/w_2000,q_auto,f_auto/v1/people/${prospectId}/action/hero/milb/current`
        ),
      ])

    const prospect = await prospectResponse.json()
    const prospectStats = await prospectStatsResponse.json()

    // Return the prospect and their stats
    return NextResponse.json({
      prospect: prospect.people[0],
      prospectStats: prospectStats.stats[0],
      prospectImgHeadshot:
        prospectImgHeadshotResponse.status !== 200
          ? null
          : `https://img.mlbstatic.com/mlb-photos/image/upload/c_fill,g_auto/w_180/v1/people/${prospectId}/headshot/milb/current`,
      prospectImgBackground:
        prospectImgBackgroundResponse.status !== 200
          ? null
          : `https://img.mlbstatic.com/mlb-photos/image/upload/d_people:generic:action:hero:milb:current.jpg/w_2000,q_auto,f_auto/v1/people/${prospectId}/action/hero/milb/current`,
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ message: 'Error fetching prospect', error }, { status: 500 })
  }
}
