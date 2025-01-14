import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const pathSegments = url.pathname.split('/')
    const prospectId = pathSegments[pathSegments.length - 1]

    const teamId = url.searchParams.get('teamId')
    const year = url.searchParams.get('year')

    // Fetch both the prospect and their stats concurrently
    const [prospectResponse, prospectStatsResponse, prospectImgBackgroundResponse, teamResponse] = await Promise.all([
      fetch(`https://statsapi.mlb.com/api/v1/draft/${year}?playerId=${prospectId}`),
      fetch(
        `https://statsapi.mlb.com/api/v1/people/${prospectId}/stats?stats=yearByYear,career,yearByYearAdvanced,careerAdvanced&leagueListId=milb_all`
      ),
      fetch(
        `https://img.mlbstatic.com/mlb-photos/image/upload/d_people:generic:action:hero:milb:current.jpg/w_2000,q_auto,f_auto/v1/people/${prospectId}/action/hero/milb/current`
      ),
      fetch(`https://statsapi.mlb.com/api/v1/teams/${teamId}`),
    ])

    const prospect = await prospectResponse.json()
    const prospectStats = await prospectStatsResponse.json()
    const { teams } = await teamResponse.json()

    // Return the prospect and their stats
    return NextResponse.json({
      prospect: prospect.drafts.rounds[0].picks[0],
      prospectStats: prospectStats.stats[0],
      prospectImgBackground:
        prospectImgBackgroundResponse.status !== 200
          ? null
          : `https://img.mlbstatic.com/mlb-photos/image/upload/d_people:generic:action:hero:milb:current.jpg/w_2000,q_auto,f_auto/v1/people/${prospectId}/action/hero/milb/current`,
      team: teams[0],
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ message: 'Error fetching prospect', error }, { status: 500 })
  }
}
