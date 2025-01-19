'use server'

import { db } from '@/db'
import { users } from '@/db/schema'
import { eq, sql } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'

export async function followProspectAction(prevState: any, formData: any) {
  try {
    const clerkId = formData.get('userId')
    const prospectId = formData.get('prospectId')
    const isFavorite = formData.get('isFavorite')

    if (isFavorite === 'add') {
      // Check if the prospectId is already in the favoriteProspects array
      const currentFavorites = await db
        .select({ favoriteProspects: users.favoriteProspects })
        .from(users)
        .where(eq(users.clerkId, clerkId))
        .execute()

      if (!currentFavorites[0].favoriteProspects.includes(prospectId)) {
        await db
          .update(users)
          .set({
            favoriteProspects: sql`array_append(${users.favoriteProspects}, ${prospectId})`,
          })
          .where(eq(users.clerkId, clerkId))
      }
    } else {
      await db
        .update(users)
        .set({
          favoriteProspects: sql`array_remove(${users.favoriteProspects}, ${prospectId})`,
        })
        .where(eq(users.clerkId, clerkId))
    }

    revalidatePath(`/prospects/${prospectId}`)

    return {
      status: 'success',
      isFavorite: isFavorite === 'add' ? true : false,
      message: isFavorite === 'add' ? 'Prospect followed successfully' : 'Prospect unfollowed successfully',
    }
  } catch (error) {
    console.error('Error following prospect', error)
    return {
      status: 'error',
      message: 'Failed to follow prospect',
    }
  }
}
