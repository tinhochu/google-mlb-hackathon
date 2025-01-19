'use client'

import { Button } from '@/components/ui/button'
import { Heart, HeartOff, LoaderCircle } from 'lucide-react'
import { useFormStatus } from 'react-dom'

export function SubmitButton({ isFavorite }: { isFavorite: boolean }) {
  const { pending } = useFormStatus()

  return (
    <Button className="flex items-center gap-2 text-white" disabled={pending}>
      {pending ? (
        <LoaderCircle className="w-6 h-6 animate-spin" />
      ) : (
        <>
          {isFavorite ? <HeartOff className="w-6 h-6" /> : <Heart className="w-6 h-6" />}
          {isFavorite ? 'Unfollow' : 'Follow'}
        </>
      )}
    </Button>
  )
}
