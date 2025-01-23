import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import Image from 'next/image'
import Link from 'next/link'

function LatestGoogleNewsSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Image src="/gemini.svg" alt="Gemini" width={20} height={20} className="animate-spin" />
          <p className="text-xl font-bold">Latest Google News</p>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div className="grid grid-cols-1 lg:grid-cols-6 gap-4" key={index}>
              <div className="col-span-1 lg:col-span-1">
                <div className="aspect-square relative rounded-md overflow-hidden">
                  <Skeleton className="w-[146px] h-[146px]" />
                </div>
              </div>
              <div className="col-span-1 lg:col-span-5">
                <div className="flex flex-col gap-2">
                  <Skeleton className="w-full h-[20px]" />
                  <Skeleton className="w-full h-[20px]" />
                  <Skeleton className="w-full h-[20px]" />
                  <Skeleton className="w-full h-[20px]" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function LatestGoogleNewsItem({ item }: { item: any }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-6 gap-4">
      <div className="col-span-1 lg:col-span-1">
        <div className="aspect-square relative rounded-md overflow-hidden">
          <Image
            src={item?.pagemap?.cse_thumbnail?.[0]?.src ?? '/default-news.jpeg'}
            alt={item?.title ?? ''}
            fill
            className="object-cover absolute"
          />
        </div>
      </div>
      <div className="col-span-1 lg:col-span-5">
        <Link href={item.link} target="_blank" className="text-3xl font-bold">
          {item.title}
        </Link>
        <div dangerouslySetInnerHTML={{ __html: item.htmlSnippet }} />
      </div>
    </div>
  )
}

async function LatestGoogleNews({ prospect }: { prospect: any }) {
  const news = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/google/search?query=mlb+${prospect.person.fullName}+${prospect.team.name}+draft+${prospect.year}`
  )
  const { data } = await news.json()

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Image src="/gemini.svg" alt="Gemini" width={20} height={20} />
          <p className="text-xl font-bold">Latest Google News</p>
        </CardTitle>
        <CardDescription>
          {
            "We used Google's Custom Search to find the latest news about the player. We used the player's name, team, and draft year to search for the latest news."
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 lg:grid-cols-1 gap-4">
          {data.results?.map((item: any) => <LatestGoogleNewsItem item={item} key={item.link} />)}
        </div>
      </CardContent>
    </Card>
  )
}

export { LatestGoogleNews, LatestGoogleNewsSkeleton }
