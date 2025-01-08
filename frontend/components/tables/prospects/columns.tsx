'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { ColumnDef } from '@tanstack/react-table'

export type Prospect = {
  id: string
  pickRound: string
  pickNumber: number
  headshotLink: string
  birthDate: string
  lastPlayedDate: string
  mlbDebutDate: string
  scoutingReport: string
  person: {
    id: number
    firstName: string
    lastName: string
    fullName: string
    currentAge: number
    height: string
    weight: number
    birthCity: string
    birthStateProvince: string
    birthCountry: string
    active: boolean
    primaryPosition: {
      code: string
      name: string
      type: string
      abbreviation: string
    }
    batSide?: {
      code: string
      description: string
    }
    pitchHand?: {
      code: string
      description: string
    }
  }
  school?: {
    name: string
    schoolClass: string
    city: string
    state: string
    country: string
  }
  team: {
    id: number
    name: string
    abbreviation: string
    teamName: string
    locationName: string
  }
  rank: number
}

export const columns: ColumnDef<Prospect>[] = [
  {
    accessorKey: 'rank',
    header: 'Rank',
    cell: ({ row }) => {
      return <div className="font-bold">{row.original.rank}</div>
    },
  },
  {
    accessorKey: 'person.fullName',
    header: 'Player',
    cell: ({ row }) => {
      return (
        <div className="flex items-center justify-start gap-2">
          <Avatar className="border border-primary border-2">
            <AvatarImage src={row.original.headshotLink} />
            <AvatarFallback>{row.original.person.fullName.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="font-medium">{row.original.person.fullName}</div>
        </div>
      )
    },
  },
  {
    accessorKey: 'position',
    header: 'Position',
    cell: ({ row }) => {
      return (
        <Tooltip>
          <TooltipTrigger>
            <div className="font-bold">{row.original.person.primaryPosition.abbreviation}</div>
          </TooltipTrigger>
          <TooltipContent>
            <p>{row.original.person.primaryPosition.name}</p>
          </TooltipContent>
        </Tooltip>
      )
    },
  },
  {
    accessorKey: 'school',
    header: 'School',
    cell: ({ row }) => {
      return <div className="font-medium">{row.original?.school?.name || '-'}</div>
    },
  },
  {
    accessorKey: 'person.age',
    header: 'Age',
    cell: ({ row }) => {
      return <div className="font-medium">{row.original.person.currentAge}</div>
    },
  },
  {
    accessorKey: 'heightWeight',
    header: 'Height / Weight',
    cell: ({ row }) => {
      return (
        <div className="font-medium">
          {row.original.person.height} / {`${row.original.person.weight} lbs`}
        </div>
      )
    },
  },
  {
    accessorKey: 'person.batSide',
    header: 'Bats',
    cell: ({ row }) => {
      return (
        <Tooltip>
          <TooltipTrigger>
            <div className="font-bold">{row.original.person.batSide?.code}</div>
          </TooltipTrigger>
          <TooltipContent>
            <p>{row.original.person.batSide?.description}</p>
          </TooltipContent>
        </Tooltip>
      )
    },
  },
  {
    accessorKey: 'person.pitchHand',
    header: 'Throws',
    cell: ({ row }) => {
      return (
        <Tooltip>
          <TooltipTrigger>
            <div className="font-bold">{row.original.person.pitchHand?.code}</div>
          </TooltipTrigger>
          <TooltipContent>
            <p>{row.original.person.pitchHand?.description}</p>
          </TooltipContent>
        </Tooltip>
      )
    },
  },
]
