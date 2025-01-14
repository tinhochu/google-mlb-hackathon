'use client'

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { Pie, PieChart, Sector } from 'recharts'
import { PieSectorDataItem } from 'recharts/types/polar/Pie'

const chartConfig = {} satisfies ChartConfig

export function DebutChart({ data }: { data: any }) {
  const chartData = data?.classes?.map((classLabel: string, index: number) => ({
    label: classLabel === '1' ? 'Yes' : 'No',
    value: data.scores[index],
    fill: `hsl(var(--chart-${index + 1}))`,
  }))

  return (
    <Card className="flex flex-col">
      <CardHeader className="pb-0">
        <CardTitle>
          <p className="text-lg font-bold">Expected Chance of Debut</p>
        </CardTitle>
        <CardDescription>Calculated based on the first Season of the Minor League Season</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer config={chartConfig} className="mx-auto aspect-[3/2] max-h-[250px]">
          <PieChart>
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="label"
              innerRadius={60}
              strokeWidth={5}
              activeIndex={1}
              activeShape={({ outerRadius = 0, ...props }: PieSectorDataItem) => (
                <Sector {...props} outerRadius={outerRadius + 10} />
              )}
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">Expected Chance of Debut</div>
        <div className="leading-none text-center text-muted-foreground">
          This is the chance of debuting in the next 3 years
        </div>
      </CardFooter>
    </Card>
  )
}
