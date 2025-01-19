import { db } from '@/db'
import { SelectUser, users } from '@/db/schema'
import { eq } from 'drizzle-orm'

export async function getUserByClerkId(clerkId: SelectUser['clerkId']): Promise<Array<typeof users.$inferSelect>> {
  return db.select().from(users).where(eq(users.clerkId, clerkId))
}

export async function getFavoritesByUserClerkId(
  userClerkId: SelectUser['clerkId']
): Promise<Array<{ favoriteProspects: (typeof users.$inferSelect)['favoriteProspects'] }>> {
  return db.select({ favoriteProspects: users.favoriteProspects }).from(users).where(eq(users.clerkId, userClerkId))
}
