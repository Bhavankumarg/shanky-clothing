import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifyUserToken, USER_COOKIE } from '@/lib/userAuth'
import { getAddresses, addAddress, removeAddress } from '@/lib/userStore'

export const runtime = 'nodejs'

function currentUserId() {
  const token = cookies().get(USER_COOKIE)?.value
  return verifyUserToken(token)
}

export async function GET() {
  const userId = currentUserId()
  if (!userId) return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
  const addresses = await getAddresses(userId)
  return NextResponse.json({ ok: true, addresses })
}

export async function POST(req) {
  const userId = currentUserId()
  if (!userId) return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
  let body
  try { body = await req.json() } catch {
    return NextResponse.json({ ok: false, error: 'Invalid request body' }, { status: 400 })
  }
  if (!body?.fullName || !body?.address || !body?.city || !body?.pincode) {
    return NextResponse.json({ ok: false, error: 'Address is incomplete.' }, { status: 400 })
  }
  try {
    const entry = await addAddress(userId, body)
    return NextResponse.json({ ok: true, address: entry })
  } catch (e) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 400 })
  }
}

export async function DELETE(req) {
  const userId = currentUserId()
  if (!userId) return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  if (!id) return NextResponse.json({ ok: false, error: 'id is required' }, { status: 400 })
  try {
    await removeAddress(userId, id)
    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 400 })
  }
}
