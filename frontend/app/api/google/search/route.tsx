import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('query')

    const googleResponse = await fetch(
      `https://customsearch.googleapis.com/customsearch/v1?key=${process.env.GOOGLE_CUSTOM_SEARCH_API_KEY}&q=${query} -site:ebay.com&sort=date&cx=${process.env.GOOGLE_CUSTOM_SEARCH_ENGINE_ID}`
    )

    const data = await googleResponse.json()

    return NextResponse.json({
      data: {
        results: data?.items ?? [],
      },
    })
  } catch (error) {
    return NextResponse.json(
      {
        data: {
          results: [],
        },
      },
      { status: 500 }
    )
  }
}
