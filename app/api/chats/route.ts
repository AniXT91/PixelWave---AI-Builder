import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const chats = await prisma.chat.findMany({
      where: { userId: session.user.id },
      include: {
        messages: {
          take: 1,
          orderBy: { createdAt: 'desc' }
        }
      },
      orderBy: { updatedAt: 'desc' }
    })

    return NextResponse.json(chats)
  } catch (error) {
    console.error('Get chats error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    let title = 'New Chat'
    if (req) {
      try {
        const body = await req.json()
        if (body && body.title && typeof body.title === 'string') {
          title = body.title
        }
      } catch {}
    }

    const chat = await prisma.chat.create({
      data: {
        userId: session.user.id,
        title
      }
    })

    return NextResponse.json(chat)
  } catch (error) {
    console.error('Create chat error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}