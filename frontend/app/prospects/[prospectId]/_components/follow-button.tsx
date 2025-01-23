'use client'

import { followProspectAction } from '@/actions/follow-prospect.action'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'
import { SignInButton, useAuth } from '@clerk/nextjs'
import { Heart } from 'lucide-react'
import { useActionState, useEffect, useState } from 'react'

import { SubmitButton } from './submit-follow-button'

interface Props {
  prospectId: string
  favoriteProspects: string[]
}

function FollowButton({ prospectId, favoriteProspects }: Props) {
  const { userId } = useAuth()
  const { toast } = useToast()
  const [formState, formAction] = useActionState(followProspectAction, {
    status: 'idle',
    message: '',
  })
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

  if (!userId)
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button className="flex items-center gap-2 text-white">
            <Heart className="w-6 h-6" />
            Follow
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center">Sign in to follow</DialogTitle>
          </DialogHeader>
          <DialogDescription className="text-center">You must be signed in to follow a prospect.</DialogDescription>
          <SignInButton>
            <Button size="lg" className="w-full">
              Sign in
            </Button>
          </SignInButton>
        </DialogContent>
      </Dialog>
    )

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
