'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { ChatInterface } from '@/components/chat-interface'
import { Sidebar } from '@/components/sidebar'
import { LoadingSpinner } from '@/components/loading-spinner'

export default function Dashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [currentChatId, setCurrentChatId] = useState<string | null>(null)

  useEffect(() => {
    if (status === 'loading') return
    if (!session) {
      router.push('/auth/signin')
    }
  }, [session, status, router])

  if (status === 'loading') {
    return <LoadingSpinner />
  }

  if (!session) {
    return null
  }

  return (
    <div className="h-screen flex flex-col sm:flex-row bg-orange-50">
      <Sidebar 
        currentChatId={currentChatId} 
        onChatSelect={setCurrentChatId}
      />
      <ChatInterface 
        chatId={currentChatId}
        onNewChat={(id) => setCurrentChatId(id ?? null)}
      />
    </div>
  )
}