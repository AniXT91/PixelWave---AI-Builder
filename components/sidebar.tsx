'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Plus,
  MessageSquare,
  Trash2,
  LogOut,
  User,
  Sun,
  Moon,
  Menu,
  Zap,
} from 'lucide-react'
import { toast } from 'sonner'
import { useTheme } from 'next-themes'

interface Chat {
  id: string
  title: string
  updatedAt: string
  messages: any[]
}

// Allow null to clear selection
interface SidebarProps {
  currentChatId: string | null
  onChatSelect: (chatId: string | null) => void
}

export function Sidebar({ currentChatId, onChatSelect }: SidebarProps) {
  const { data: session } = useSession()
  const router = useRouter()
  const [chats, setChats] = useState<Chat[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { theme, setTheme } = useTheme()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const fetchChats = useCallback(async () => {
    setIsLoading(true)
    try {
      const res = await fetch('/api/chats')
      if (!res.ok) throw new Error('Failed')
      let data: Chat[] = await res.json()
      data = data.filter((c) => c.messages?.length > 0)
      setChats(data)
    } catch (err) {
      console.error(err)
      toast.error('Could not load chats')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchChats()
    window.addEventListener('refresh-chats', fetchChats)
    return () => window.removeEventListener('refresh-chats', fetchChats)
  }, [fetchChats])

  const handleNewChat = () => {
    // clear current view immediately
    onChatSelect(null)
    router.push('/')
  }

  const handleSelect = (chatId: string) => {
    onChatSelect(chatId)
    setSidebarOpen(false)
  }

  const deleteChat = async (chatId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    try {
      const res = await fetch(`/api/chats/${chatId}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Delete failed')
      toast.success('Chat deleted')
      // refresh list
      await fetchChats()
      // if that chat was open, clear view
      if (currentChatId === chatId) onChatSelect(null)
    } catch (err) {
      console.error(err)
      toast.error('Failed to delete chat')
    }
  }

  const SidebarContent = (
    <>
      {/* Header */}
      <div className="p-4 border-b bg-[var(--color-sidebar)] border-[var(--color-border)]">
        <div className="flex items-center space-x-2 mb-4">
          <div className="h-8 w-8 bg-gradient-to-r from-[#5D2DE6] to-[#5CD4D4] rounded-lg flex items-center justify-center shadow-lg">
            <Zap className="h-5 w-5 text-white" />
          </div>
          <span className="font-bold bg-gradient-to-r from-[#5D2DE6] to-[#5CD4D4] bg-clip-text text-transparent">
            Pixel Wave
          </span>
        </div>
        <Button
          onClick={handleNewChat}
          variant="outline"
          className="w-full justify-start"
        >
          <Plus className="h-4 w-4 mr-2" /> New Chat
        </Button>
      </div>

      {/* Chats */}
      <ScrollArea className="flex-1 p-4 bg-[var(--color-bg)] dark:bg-[var(--color-bg)]">
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin h-6 w-6 border-b-2 rounded-full border-[var(--color-primary)]" />
          </div>
        ) : chats.length === 0 ? (
          <div className="text-center py-8 text-[var(--color-muted)]">
            <MessageSquare className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No chats yet</p>
            <p className="text-xs">Start a new conversation!</p>
          </div>
        ) : (
          <div className="space-y-2 bg-[var(--color-bg)] dark:bg-[var(--color-bg)] rounded-lg">
            {chats.map((chat, idx) => (
              <div key={chat.id}>
                <div
                  onClick={() => handleSelect(chat.id)}
                  className={`group flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors border ${
                    currentChatId === chat.id
                      ? 'bg-[#CBD5E1] border-[#CBD5E1] shadow-md'
                      : 'hover:bg-[#E2E8F0] hover:border-[#E2E8F0]'
                  }`}
                  style={{ minHeight: 56 }}
                >
                  <div className="flex-1 overflow-hidden">
                    <span className="block font-semibold truncate" style={{ maxWidth: 140 }}>
                      {chat.title}
                    </span>
                    <p className="text-[10px] text-[var(--color-muted)]">
                      {new Date(chat.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={(e) => deleteChat(chat.id, e)}
                    tabIndex={-1}
                    aria-label="Delete chat"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                {idx < chats.length - 1 && <div className="border-b mx-2" />}
              </div>
            ))}
          </div>
        )}
      </ScrollArea>

      {/* Footer */}
      <div className="p-4 border-t bg-[var(--color-sidebar)] border-[var(--color-border)]">
        <div className="flex items-center space-x-3 mb-3">
          <div className="h-8 w-8 bg-[#E5E7EB] dark:bg-[#314155] rounded-full flex items-center justify-center">
            <User className="h-4 w-4 text-[var(--color-primary)]" />
          </div>
          <p className="text-sm font-medium truncate text-[var(--color-text)]">
            {session?.user?.name || session?.user?.email}
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="w-full justify-start"
        >
          {theme === 'dark' ? <Sun className="h-4 w-4 mr-2" /> : <Moon className="h-4 w-4 mr-2" />}
          {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => signOut()}
          className="w-full justify-start mt-2"
        >
          <LogOut className="h-4 w-4 mr-2" /> Sign Out
        </Button>
      </div>
    </>
  )

  return (
    <>
      {/* Mobile */}
      <div className="sm:hidden p-2">
        <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(true)} aria-label="Open sidebar">
          <Menu className="h-6 w-6 text-orange-700" />
        </Button>
      </div>

      {/* Drawer for Mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 flex">
          <div className="fixed inset-0 bg-black/30" onClick={() => setSidebarOpen(false)} />
          <div className="relative w-64 h-full bg-white shadow-xl border-r border-orange-200 flex flex-col z-50 animate-slide-in-left">
            <Button variant="ghost" size="icon" className="absolute top-2 right-2" onClick={() => setSidebarOpen(false)}>
              ×
            </Button>
            {SidebarContent}
          </div>
        </div>
      )}

      {/* Desktop */}
      <div className="hidden sm:flex w-64 h-full flex-col">
        {SidebarContent}
      </div>
    </>
  )
}