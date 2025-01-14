import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const name = searchParams.get('name')

  if (!name) {
    return NextResponse.json({ message: 'Name is required' }, { status: 400 })
  }

  const players = await fetch(`https://statsapi.mlb.com/api/v1/people/search/?names=${name}`)
  const playersData = await players.json()

  return NextResponse.json({
    data: playersData.people,
  })
}
