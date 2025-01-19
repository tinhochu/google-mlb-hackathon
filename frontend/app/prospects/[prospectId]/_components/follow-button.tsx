'use client'

import { followProspectAction } from '@/actions/follow-prospect.action'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'
import { useAuth } from '@clerk/nextjs'
import { Heart, HeartOff } from 'lucide-react'
import { useActionState, useEffect, useState } from 'react'
import { useFormStatus } from 'react-dom'

import { SubmitButton } from './submit-follow-button'

interface Props {
  prospectId: string
  favoriteProspects: string[]
}

function FollowButton({ prospectId, favoriteProspects }: Props) {
  const { userId } = useAuth()
  const { pending } = useFormStatus()
  const { toast } = useToast()
  const [formState, formAction] = useActionState(followProspectAction, {
    status: 'idle',
    message: '',
  })
  const [isLoading, setIsLoading] = useState(false)
  const [isFavorite, setIsFavorite] = useState(favoriteProspects.includes(prospectId))

  useEffect(
    function onFormStateChange() {
      if (formState.status === 'success') {
        setIsFavorite(formState.isFavorite as boolean)
        toast({
          title: formState.message,
        })
      }
    },
    [formState]
  )

  if (!userId) return null

  return (
    <form action={formAction}>
      <Input type="hidden" name="prospectId" value={prospectId} />
      <Input type="hidden" name="userId" value={userId as string} />
      <Input type="hidden" name="isFavorite" value={isFavorite ? 'remove' : 'add'} />
      <SubmitButton isFavorite={isFavorite} />
    </form>
  )
}

export { FollowButton }
