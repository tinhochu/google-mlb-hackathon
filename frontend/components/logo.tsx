import Image from 'next/image'
import Link from 'next/link'

export default function Logo() {
  return (
    <Link href="/" className="flex flex-col">
      <div className="flex items-center">
        <Image
          src="/mlb-logo.svg"
          className="mr-3 h-6 sm:h-9"
          alt="MLB™ 3P: Prospect Potential Predictor"
          width={65}
          height={36}
        />
        <span className="self-center text-4xl text-white font-semibold whitespace-nowrap">3P</span>
      </div>
      <span className="text-white text-xs font-medium">Prospect Potential Predictor</span>
    </Link>
  )
}
