'use client'

import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'
import { Prospect } from '@/types'
import { Tooltip, TooltipContent, TooltipTrigger } from '@radix-ui/react-tooltip'
import Autoplay from 'embla-carousel-autoplay'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef } from 'react'

function ProspectsCarousel({ data }: { data: Prospect[] }) {
  if (!data.length) return null

  const autoplayRef = useRef(Autoplay({ delay: 500 }))

  useEffect(() => {
    const autoplay = autoplayRef.current
    const stopAutoplayOnHover = () => autoplay.stop()
    const resumeAutoplayOnLeave = () => autoplay.play()

    const carouselElement = document.querySelector('.carousel-content') // Adjust the selector to match your component

    if (carouselElement) {
      carouselElement.addEventListener('mouseenter', stopAutoplayOnHover)
      carouselElement.addEventListener('mouseleave', resumeAutoplayOnLeave)
    }

    return () => {
      if (carouselElement) {
        carouselElement.removeEventListener('mouseenter', stopAutoplayOnHover)
        carouselElement.removeEventListener('mouseleave', resumeAutoplayOnLeave)
      }
    }
  }, [])

  return (
    <Carousel opts={{ loop: true, align: 'start', duration: 400 }} plugins={[autoplayRef.current]}>
      <CarouselContent className="carousel-content flex flex-row">
        {data.map((prospect: Prospect) => (
          <CarouselItem key={prospect.id} className="basis-auto p-0">
            <Link href={`/prospects/${prospect.person.id}`}>
              <Image src={prospect.headshotLink} alt={prospect.person.fullName} width={60} height={60} />
            </Link>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  )
}

export { ProspectsCarousel }
