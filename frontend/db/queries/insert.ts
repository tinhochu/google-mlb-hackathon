import { db } from '@/db'
import { InsertUser, users } from '@/db/schema'

export async function createUser(data: InsertUser) {
  await db.insert(users).values(data)
}
