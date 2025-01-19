import { config } from 'dotenv'
import { drizzle } from 'drizzle-orm/vercel-postgres'

const envPath = process.env.NODE_ENV === 'development' ? '.env.local' : '.env'
config({ path: envPath })

export const db = drizzle()
