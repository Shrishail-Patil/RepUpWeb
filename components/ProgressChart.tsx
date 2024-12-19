'use client'

import { Line, LineChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'

const data = [
  { date: '2023-01-01', weight: 80, strength: 100 },
  { date: '2023-02-01', weight: 78, strength: 110 },
  { date: '2023-03-01', weight: 76, strength: 120 },
  { date: '2023-04-01', weight: 75, strength: 130 },
  { date: '2023-05-01', weight: 74, strength: 140 },
]

export default function ProgressChart() {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Your Progress</CardTitle>
        <CardDescription>Track your weight and strength over time</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            weight: {
              label: 'Weight (kg)',
              color: 'hsl(var(--chart-1))',
            },
            strength: {
              label: 'Strength (arbitrary units)',
              color: 'hsl(var(--chart-2))',
            },
          }}
          className="h-[300px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="weight" stroke="var(--color-weight)" name="Weight" />
              <Line yAxisId="right" type="monotone" dataKey="strength" stroke="var(--color-strength)" name="Strength" />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}