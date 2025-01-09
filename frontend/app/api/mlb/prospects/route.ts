import * as Sentry from '@sentry/nextjs'
import { NextRequest, NextResponse } from 'next/server'

/**
 * @description Fetches prospects from the MLB API for a given year
 * @param request - The request object
 * @returns The prospects for the given year
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    let year = searchParams.get('year')
    let limit = searchParams.get('limit')
    let offset = searchParams.get('offset')

    // If no year is provided, use last year
    if (!year) {
      year = (new Date().getFullYear() - 1).toString()
    }

    // If no limit is provided, use 100
    if (!limit) {
      limit = '100'
    }

    // If no offset is provided, use 0
    if (!offset) {
      offset = '0'
    }

    // Get prospects for the given year
    const mlbResponse = await fetch(
      `https://statsapi.mlb.com/api/v1/draft/prospects/${year}?limit=${limit}&offset=${offset}&sortBy=rank&order=DESC`,
      { cache: 'force-cache' }
    )
    const mlbData = await mlbResponse.json()

    return NextResponse.json({
      data: {
        prospects: mlbData.prospects,
        totalSize: mlbData.totalSize,
        returnedSize: mlbData.returnedSize,
        queriedSize: mlbData.queriedSize,
        offset: mlbData.offset,
      },
    })
  } catch (error) {
    Sentry.captureException(error)
    return NextResponse.json({ error: 'Failed to fetch prospects' }, { status: 500 })
  }
}