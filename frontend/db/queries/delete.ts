import { db } from '@/db'
import { SelectUser, users } from '@/db/schema'
import { eq } from 'drizzle-orm'

export async function deleteUserByClerkId(clerkId: SelectUser['clerkId']) {
  await db.delete(users).where(eq(users.clerkId, clerkId))
}
