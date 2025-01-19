'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { PAGINATION_SIZE } from '@/constants'
import apiClient from '@/lib/apiClient'
import { useAutoAnimate } from '@formkit/auto-animate/react'
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  initialData: TData[]
  initialYear?: string
  heading: string
  isFavorites?: boolean
}

export function DataTable<TData, TValue>({
  columns,
  initialData,
  initialYear,
  heading,
  isFavorites = false,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})
  const [year, setYear] = useState(initialYear ?? '2024')
  const [data, setData] = useState(initialData ?? [])
  const [fetching, setFetching] = useState(false)
  const [parent] = useAutoAnimate<HTMLDivElement>()

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  useEffect(
    function fetchProspects() {
      const fetchProspects = async () => {
        setFetching(true)
        const response = await apiClient.get(`/mlb/prospects?year=${year}`)
        setTimeout(() => {
          setData(response?.data?.prospects || [])
          setFetching(false)
        }, 500)
      }

      if (!isFavorites) {
        fetchProspects()
      }
    },
    [year]
  )

  useEffect(function initialFetch() {
    const fetchProspects = async () => {
      setFetching(true)
      const response = await apiClient.get(`/mlb/prospects?year=${year}`)
      setTimeout(() => {
        setYear(response?.data?.year || '2024')
        setData(response?.data?.prospects || [])
        setFetching(false)
      }, 500)
    }

    if (!isFavorites) {
      fetchProspects()
    }
  }, [])

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">
        {heading} {!isFavorites && year}
      </h2>
      <div className="flex items-center justify-between pb-4 gap-4">
        <div className="flex items-center gap-2">
          <Input
            placeholder="Filter Players..."
            value={(table.getColumn('player')?.getFilterValue() as string) ?? ''}
            onChange={(event) => table.getColumn('player')?.setFilterValue(event.target.value)}
            className="max-w-md"
          />
          {!isFavorites && (
            <Select
              onValueChange={(value) => {
                setYear(value)
              }}
              value={year}
            >
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Select Year" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 10 }, (_, i) => i + 2015)
                  .reverse()
                  .map((item) => (
                    <SelectItem key={item} value={item.toString()}>
                      {item}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
            Previous
          </Button>
          <Button variant="outline" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
            Next
          </Button>
          <Select
            value={table.getState().pagination.pageSize.toString()}
            onValueChange={(value) => {
              table.setPageSize(Number(value))
            }}
          >
            <SelectTrigger className="">
              <SelectValue placeholder="Page Size" />
            </SelectTrigger>
            <SelectContent>
              {PAGINATION_SIZE.items.map((item) => (
                <SelectItem key={item.value} value={item.value.toString()}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <Card className="overflow-hidden relative">
        <Table className="" ref={parent}>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {fetching && (
          <div className="absolute inset-0 bg-white/50 flex items-center justify-center transition-opacity duration-300 opacity-100 w-full h-full top-0 left-0">
            <Loader2 className="animate-spin" size={32} />
          </div>
        )}
      </Card>
      <div className="flex items-center justify-between space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length} row(s)
          selected.
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
            Previous
          </Button>
          <Button variant="outline" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
            Next
          </Button>
          <Select
            value={table.getState().pagination.pageSize.toString()}
            onValueChange={(value) => {
              table.setPageSize(Number(value))
            }}
          >
            <SelectTrigger className="">
              <SelectValue placeholder="Page Size" />
            </SelectTrigger>
            <SelectContent>
              {PAGINATION_SIZE.items.map((item) => (
                <SelectItem key={item.value} value={item.value.toString()}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}
