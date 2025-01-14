'use client'

import dynamic from 'next/dynamic'

const GaugeComponent = dynamic(() => import('react-gauge-component'), { ssr: false })

function GaugeChart({ value, lowerLimit, upperLimit }: { value: number; lowerLimit: number; upperLimit: number }) {
  return (
    <div className="-mt-8">
      <GaugeComponent
        type="semicircle"
        arc={{
          colorArray: ['#041e43'],
          padding: 0.02,
          subArcs: [{}, {}, {}, {}],
        }}
        labels={{
          valueLabel: {
            style: { fontSize: 60, fontWeight: 'bold', fill: '#041e43', textShadow: '0 0 0' },
            formatTextValue: (value) => value.toFixed(2),
          },
          tickLabels: {
            type: 'inner',
          },
        }}
        pointer={{ type: 'blob', animationDelay: 0 }}
        value={value}
        minValue={lowerLimit}
        maxValue={value > upperLimit ? value : upperLimit}
      />
    </div>
  )
}

export { GaugeChart }
