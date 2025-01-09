import HackathonAlert from '@/components/hackathon-alert'
import { Prospect, columns } from '@/components/tables/prospects/columns'
import { DataTable } from '@/components/tables/prospects/data-table'

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
  // const data = await getProspects()
  const data = {
    prospects: [],
  }

  return (
    <div className="pt-8">
      <HackathonAlert />
      <h1 className="text-2xl font-bold mb-4">Prospects</h1>
      <DataTable columns={columns} data={data?.prospects || []} />
    </div>
  )
}
