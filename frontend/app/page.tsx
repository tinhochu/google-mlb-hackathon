import HackathonAlert from '@/components/hackathon-alert'
import { ProspectsCarousel } from '@/components/prospects-carousel'
import { columns } from '@/components/tables/prospects/columns'
import { DataTable } from '@/components/tables/prospects/data-table'
import { Prospect } from '@/types'

async function getProspects(): Promise<{ prospects: Prospect[] }> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/mlb/prospects?year=2024&limit=50&sortBy=rank&order=DESC`,
    {
      cache: 'force-cache',
    }
  )
  const { data } = await response.json()
  return data
}

export default async function HomePage() {
  const data = await getProspects()

  return (
    <div className="">
      <ProspectsCarousel data={data?.prospects || []} />
      <div className="mx-auto max-w-screen-xl min-h-lvh mt-4">
        <HackathonAlert />
        <DataTable columns={columns} initialData={data?.prospects || []} initialYear={'2024'} />
      </div>
    </div>
  )
}
