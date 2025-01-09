'use client'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import config from '@/config'
import { cn } from '@/lib/utils'
import { useAutoAnimate } from '@formkit/auto-animate/react'
import { X } from 'lucide-react'
import { useState } from 'react'

export default function HackathonAlert() {
  const [isVisible, setIsVisible] = useState(true)
  const [parentRef] = useAutoAnimate()

  return (
    <div
      ref={parentRef}
      className={cn(
        isVisible ? 'animate-in fade-in-0 slide-in-from-top-1' : 'animate-out fade-out-0 slide-out-to-top-1'
      )}
    >
      {isVisible && (
        <Alert className={cn('relative bg-primary-foreground mb-4')}>
          <AlertTitle className="text-xl font-bold">Hackathon Challenge Announcement 🚀</AlertTitle>
          <AlertDescription>
            <p>
              I&apos;m participating in the MLB Hackathon, <strong>tackling Challenge #5</strong>, titled{' '}
              <a
                href="https://devpost.com/software/mlb-tm-p3-prospects-potential-predictor"
                target="_blank"
                className="underline hover:text-primary"
              >
                <strong>{config.appName}</strong>
              </a>
              . My goal is to make baseball more exciting for fans by creating a tool that helps them follow young
              talented players and predict their future potential. My tool will display player stats, historical data,
              and live updates — information typically reserved for baseball experts. I&apos;m making baseball viewing
              more player stats, historical data, and live updates — information typically reserved for baseball
              experts. I&apos;m making baseball viewing more interactive by letting fans make data-driven predictions
              about players, share their insights with other fans, and compare their picks with experts. This creates a
              deeper connection to the sport. The tool will enhance key moments like draft days and league promotions,
              allowing fans to track their favorite prospects&apos; journeys. This transforms casual viewers into
              passionate fans invested in their team&apos;s future. Through this combination of sports, technology, and
              social features, I&apos;m working to interactive by letting fans make data-driven predictions about
              players, share their insights with other fans, and compare their picks with experts. This creates a deeper
              connection to the sport. The tool will enhance key moments like draft days and league promotions, allowing
              fans to track their favorite prospects&apos; journeys. This transforms casual viewers into passionate fans
              invested in their team&apos;s future. Through this combination of sports, technology, and social features,
              I&apos;m working to make baseball more engaging and accessible for everyone. Stay tuned as we innovate and
              bring our ideas to life!
            </p>
            <p>Stay tuned as we innovate and bring our ideas to life!</p>
          </AlertDescription>
          <button
            onClick={() => setIsVisible(false)}
            aria-label="Close"
            className="bg-primary rounded-full p-1 text-white absolute -right-2 -top-2"
          >
            <X className="w-4 h-4" />
          </button>
        </Alert>
      )}
    </div>
  )
}
