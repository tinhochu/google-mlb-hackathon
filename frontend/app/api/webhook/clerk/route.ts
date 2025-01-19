import { deleteUserByClerkId } from '@/db/queries/delete'
import { createUser } from '@/db/queries/insert'
import { NextRequest, NextResponse } from 'next/server'
import { Webhook } from 'svix'

const secret = process.env.CLERK_WEBHOOK_SECRET!

export async function POST(req: NextRequest) {
  try {
    // Verify the request
    const webhook = new Webhook(secret)
    const headers = {
      'svix-id': req.headers.get('svix-id') as string,
      'svix-timestamp': req.headers.get('svix-timestamp') as string,
      'svix-signature': req.headers.get('svix-signature') as string,
    }

    // Get the payload
    const payload = await req.text()

    // Verify the request
    const verified = webhook.verify(payload, headers)

    // If the request is not verified, return an error
    if (!verified) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 403 })
    }

    // Now, get the event:
    const body = JSON.parse(payload)

    switch (body.type) {
      case 'user.created':
        await createUser({
          clerkId: body.data.id,
          email: body.data.email_addresses[0].email_address,
        })
        console.log('✅ User created')
        break

      case 'user.deleted':
        await deleteUserByClerkId(body.data.id)
        console.log('✅ User deleted')
        break
    }

    return NextResponse.json({ message: 'Request verified' }, { status: 200 })
  } catch (error) {
    console.error(error)
  }
}
