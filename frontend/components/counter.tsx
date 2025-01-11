'use client'

import CountUp from 'react-countup'

function Counter({ end }: { end: number }) {
  return <CountUp end={end} duration={5} />
}

export { Counter }
