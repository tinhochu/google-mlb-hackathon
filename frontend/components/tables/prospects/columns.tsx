'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { Prospect } from '@/types'
import { ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown } from 'lucide-react'
import Link from 'next/link'

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
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="pl-0 pr-0"
        >
          Rank
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      return <div className="text-lg font-bold">{row.original.rank}</div>
    },
  },
  {
    id: 'player',
    accessorKey: 'person.fullName',
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')} className="pl-0">
          Player
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      return (
        <Link
          href={`/prospects/${row.original.person.id}?teamId=${row.original.team?.id ?? ''}&year=${row.original.year}`}
          className="flex items-center justify-start gap-2"
        >
          <Avatar className="border border-primary border-2">
            <AvatarImage src={row.original.headshotLink} />
            <AvatarFallback>{row.original.person.fullName.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="font-medium">{row.original.person.fullName}</div>
        </Link>
      )
    },
  },
  {
    id: 'position',
    accessorKey: 'person.primaryPosition.abbreviation',
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')} className="pl-0">
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
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')} className="pl-0">
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
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')} className="pl-0">
          Current Age
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
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')} className="pl-0">
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
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')} className="pl-0">
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
