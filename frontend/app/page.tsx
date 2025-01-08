import HackathonAlert from '@/components/hackathon-alert'
import ProspectsTable from '@/components/prospects-table'

export default function Home() {
  return (
    <div className="pt-8">
      <HackathonAlert />
      <ProspectsTable />
    </div>
  )
}
