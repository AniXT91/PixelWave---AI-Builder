'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { 
  Plus, 
  MessageSquare, 
  Trash2, 
  LogOut, 
  User,
  Sparkles,
  Settings,
  Sun,
  Moon
} from 'lucide-react'
import { toast } from 'sonner'
import { useTheme } from 'next-themes'

interface Chat {
  id: string
  title: string
  updatedAt: string
  messages: any[]
}

interface SidebarProps {
  currentChatId: string | null
  onChatSelect: (chatId: string) => void
}

export function Sidebar({ currentChatId, onChatSelect }: SidebarProps) {
  const { data: session } = useSession()
  const router = useRouter()
  const [chats, setChats] = useState<Chat[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { theme, setTheme } = useTheme()

  const fetchChats = useCallback(async () => {
    try {
      const response = await fetch('/api/chats')
      if (response.ok) {
        let data = await response.json()
        // Only show chats that have at least one message
        data = data.filter((chat: any) => chat.messages && chat.messages.length > 0)
        setChats(data)
      }
    } catch (error) {
      console.error('Failed to fetch chats:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchChats()
    // Listen for refresh-chats event
    const handler = () => fetchChats()
    window.addEventListener('refresh-chats', handler)
    return () => window.removeEventListener('refresh-chats', handler)
  }, [fetchChats])

  const handleNewChat = () => {
    onChatSelect('')
    router.push('/')
  }

  const deleteChat = async (chatId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    try {
      const response = await fetch(`/api/chats/${chatId}`, {
        method: 'DELETE',
      })
      if (response.ok) {
        await fetchChats()
        if (currentChatId === chatId) {
          onChatSelect('')
        }
        toast.success('Chat deleted')
      }
    } catch (error) {
      toast.error('Failed to delete chat')
    }
  }

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-2 mb-4">
          <div className="h-8 w-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <span className="font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            AI Builder
          </span>
        </div>
        <Button 
          onClick={handleNewChat}
          className="w-full justify-start"
          variant="outline"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Chat
        </Button>
      </div>

      {/* Chat History */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-2">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            </div>
          ) : chats.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <MessageSquare className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No chats yet</p>
              <p className="text-xs">Start a new conversation!</p>
            </div>
          ) : (
            chats.map((chat, idx) => (
              <>
                <div
                  key={chat.id}
                  onClick={() => onChatSelect(chat.id)}
                  className={`group flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors border border-transparent ${
                    currentChatId === chat.id
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 border-blue-700 shadow-md'
                      : 'hover:bg-gray-100 hover:border-blue-200'
                  }`}
                  style={{ minHeight: 56 }}
                >
                  <div className="flex-1 min-w-0">
                    <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-blue-200">
                      <span
                        className={`inline-block font-semibold text-base whitespace-nowrap pr-2 ${
                          currentChatId === chat.id
                            ? 'text-white drop-shadow'
                            : 'text-gray-900'
                        }`}
                        style={{ maxWidth: '180px' }}
                      >
                        {chat.title}
                      </span>
                    </div>
                    <p className={`text-xs ${
                      currentChatId === chat.id
                        ? 'text-blue-100'
                        : 'text-gray-500'
                    }`}>
                      {new Date(chat.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={(e) => deleteChat(chat.id, e)}
                    className={`transition-opacity h-8 w-8 p-0 text-gray-400 hover:text-red-600 ${
                      currentChatId === chat.id ? 'text-white hover:text-red-400' : ''
                    }`}
                    tabIndex={-1}
                    aria-label="Delete chat"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                {/* Divider between chats */}
                {idx < chats.length - 1 && (
                  <div className="mx-2 border-b border-gray-200" />
                )}
              </>
            ))
          )}
        </div>
      </ScrollArea>

      {/* User Menu */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center space-x-3 mb-3">
          <div className="h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center">
            <User className="h-4 w-4 text-gray-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">
              {session?.user?.name || session?.user?.email}
            </p>
          </div>
        </div>
        
        <div className="space-y-1">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start flex items-center transition-colors"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            aria-label="Toggle dark mode"
          >
            {theme === 'dark' ? (
              <>
                <Sun className="h-4 w-4 mr-2" />
                Light Mode
              </>
            ) : (
              <>
                <Moon className="h-4 w-4 mr-2" />
                Dark Mode
              </>
            )}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => signOut()}
            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/50 dark:text-red-400 dark:hover:text-red-300"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  )
}