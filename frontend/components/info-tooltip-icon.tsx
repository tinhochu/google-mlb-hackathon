import { cn } from '@/lib/utils'
import { Tooltip, TooltipContent, TooltipTrigger } from '@radix-ui/react-tooltip'
import { InfoIcon } from 'lucide-react'

function InfoTooltipIcon({ className, tooltipContent }: { className?: string; tooltipContent: string }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <InfoIcon className={cn('w-4 h-4', className)} />
      </TooltipTrigger>
      <TooltipContent>
        <div className="flex items-center justify-center bg-primary text-white rounded-md p-2">
          <p className="text-sm">{tooltipContent}</p>
        </div>
      </TooltipContent>
    </Tooltip>
  )
}

export { InfoTooltipIcon }
