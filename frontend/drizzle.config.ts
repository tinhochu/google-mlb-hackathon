import { defineConfig } from 'drizzle-kit'

require('dotenv').config({ path: '.env.local' })

export default defineConfig({
  schema: './db/schema.ts',
  out: './migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.POSTGRES_URL!,
  },
})
