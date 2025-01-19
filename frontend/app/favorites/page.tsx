import HackathonAlert from '@/components/hackathon-alert'
import { columns } from '@/components/tables/prospects/columns'
import { DataTable } from '@/components/tables/prospects/data-table'
import { getFavoritesByUserClerkId } from '@/db/queries/select'
import { Prospect } from '@/types'
import { currentUser } from '@clerk/nextjs/server'

async function getFavorites(): Promise<{ prospects: any[] }> {
  // Get the Array of Prospects from the user's favorites
  const user = await currentUser()
  const [{ favoriteProspects }] = await getFavoritesByUserClerkId(user?.id as string)

  // iterate over the favoriteProspects array and fetch the prospect data from the MLB API
  const prospects = await Promise.all(
    favoriteProspects.map(async (prospect: any) => {
      const peopleResponse = await fetch(`https://statsapi.mlb.com/api/v1/people/${prospect}`)
      const peopleData = await peopleResponse.json()

      const draftResponse = await fetch(
        `https://statsapi.mlb.com/api/v1/draft/${peopleData.people[0].draftYear}/?playerId=${prospect}`
      )
      const draftData = await draftResponse.json()

      return draftData?.drafts?.rounds[0].picks[0]
    })
  )

  return { prospects }
}

export default async function FavoritesPage() {
  const data = await getFavorites()

  return (
    <div className="">
      <div className="mx-auto max-w-screen-xl min-h-lvh mt-4">
        <HackathonAlert />
        <DataTable isFavorites={true} columns={columns} initialData={data?.prospects || []} heading="My Favorites" />
      </div>
    </div>
  )
}
