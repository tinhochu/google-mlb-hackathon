import * as Sentry from '@sentry/nextjs'
import { NextRequest, NextResponse } from 'next/server'

/**
 * @description Fetches prospects from the MLB API for a given year
 * @param request - The request object
 * @returns The prospects for the given year
 */
export async function GET(request: NextRequest) {
  try {
    const url = 'https://data-graph.mlb.com/graphql'
    const params = {
      operationName: 'GetFeed',
      variables: {
        limit: 3,
        language: `EN_US`,
        skip: 0,
        slug: 'sel-mlb-homepage-mixed-feed',
      },
      extensions: {
        persistedQuery: {
          version: 1,
          sha256Hash: '4a8b515d4ecbaf86596fe4c97f6751530aa5ce78c85570cb5670ab45ad3f6265',
        },
      },
    }

    const queryParams = new URLSearchParams({
      operationName: params.operationName,
      variables: JSON.stringify(params.variables),
      extensions: JSON.stringify(params.extensions),
    })

    const mlbResponse = await fetch(`${url}?${queryParams}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    const mlbData = await mlbResponse.json()

    return NextResponse.json({
      data: {
        news: mlbData.data || [],
      },
    })
  } catch (error) {
    Sentry.captureException(error)
    return NextResponse.json({ error: 'Failed to fetch prospects' }, { status: 500 })
  }
}
