'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown } from 'lucide-react'

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
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'rank',
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Rank
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      return <div className="text-center text-lg font-bold">{row.original.rank}</div>
    },
  },
  {
    id: 'player',
    accessorKey: 'person.fullName',
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Player
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
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
    id: 'position',
    accessorKey: 'person.primaryPosition.abbreviation',
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Position
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
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
    id: 'school',
    accessorKey: 'school.name',
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          School
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      return <div className="font-medium">{row.original?.school?.name || '-'}</div>
    },
  },
  {
    id: 'age',
    accessorKey: 'person.currentAge',
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Age
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      return <div className="font-medium">{row.original.person.currentAge}</div>
    },
  },
  {
    id: 'Height / Weight',
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
    id: 'bats',
    accessorKey: 'person.batSide.code',
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Bats
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
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
    id: 'throws',
    accessorKey: 'person.pitchHand.code',
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Throws
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
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
