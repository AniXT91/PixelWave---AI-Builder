import { GoogleGenerativeAI } from '@google/generative-ai'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!)

const SYSTEM_PROMPT = `You are an expert HTML and CSS developer...` // (same as before, trimmed for brevity)

export async function POST(req: Request) {
  try {
    const { messages, chatId } = await req.json()
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return new Response('Unauthorized', { status: 401 })
    }

    const lastUserMessage = messages[messages.length - 1].content

    if (chatId) {
      await prisma.message.create({
        data: {
          content: lastUserMessage,
          role: 'user',
          chatId,
        },
      })
    }

    const geminiMessages = [
      {
        role: 'user',
        parts: [{ text: SYSTEM_PROMPT }],
      },
      ...messages.map((msg: { role: string; content: string }) => ({
        role: msg.role === 'user' ? 'user' : 'assistant',
        parts: [{ text: msg.content }],
      })),
    ]

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp-image-generation' })
    const result = await model.generateContentStream({ contents: geminiMessages })

    let fullResponse = ''

    const stream = new ReadableStream<Uint8Array>({
      start(controller) {
        (async () => {
          for await (const chunk of result.stream) {
            const text = chunk.text()
            if (text) {
              const encoded = new TextEncoder().encode(text)
              controller.enqueue(encoded)
              fullResponse += text
            }
          }
          controller.close()

          if (chatId) {
            await prisma.message.create({
              data: {
                content: fullResponse,
                role: 'assistant',
                chatId,
              },
            })
          }
        })()
      },
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
      },
    })
  } catch (error) {
    console.error('Chat API error:', error)
    return new Response('Internal server error', { status: 500 })
  }
}
