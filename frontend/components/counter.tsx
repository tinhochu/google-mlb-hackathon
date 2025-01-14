'use client'

import CountUp from 'react-countup'

function Counter({ end, decimals = 0 }: { end: number; decimals?: number }) {
  return <CountUp end={end} duration={5} decimals={decimals} />
}

export { Counter }
