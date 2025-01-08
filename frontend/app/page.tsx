import HackathonAlert from '@/components/hackathon-alert'
import { Prospect, columns } from '@/components/tables/prospects/columns'
import { DataTable } from '@/components/tables/prospects/data-table'

async function getProspects(): Promise<{ prospects: Prospect[] }> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/mlb/prospects`, { cache: 'force-cache' })
  const { data } = await response.json()
  return data
}

export default async function HomePage() {
  const data = await getProspects()
  return (
    <div className="pt-8">
      <HackathonAlert />
      <DataTable columns={columns} data={data?.prospects || []} />
    </div>
  )
}
