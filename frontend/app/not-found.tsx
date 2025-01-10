import Logo from '@/components/logo'
import { Button } from '@/components/ui/button'
import { Home } from 'lucide-react'
import Link from 'next/link'

// Simple 404 page.tsx with a button to go home and a button to contact support
// Show a cute SVG with your primary color
export default function Custom404() {
  return (
    <section className="relative text-base-content h-dvh w-full flex flex-col justify-center gap-8 items-center p-10">
      <p className="text-lg md:text-xl lg:text-4xl font-semibold">OOF! We dropped the ball 😅</p>
      <p className="text-md md:text-md lg:text-2xl font-semibold">404 - Page Not Found</p>
      <Logo />

      <div className="flex flex-wrap gap-4 justify-center">
        <Link href="/" className="">
          <Button>
            <Home />
            Home
          </Button>
        </Link>
      </div>
    </section>
  )
}
