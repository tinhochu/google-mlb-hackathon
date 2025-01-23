import config from '@/config'
import Image from 'next/image'

function Footer() {
  return (
    <footer className="bg-mlb-primary py-14 mt-8">
      <div className="flex items-center justify-center mx-auto max-w-screen-xl">
        <Image
          src="/mlb-logo.svg"
          className="mr-3 h-6 sm:h-9"
          alt="MLB™ 3P: Prospect Potential Predictor"
          width={65}
          height={36}
        />
        <p className="text-sm text-white">{config.appName}</p>
      </div>
    </footer>
  )
}

export { Footer }
