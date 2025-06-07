'use client'

import { useState, useEffect, useRef } from 'react'
import { useChat } from 'ai/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import {
  Send,
  Code,
  Eye,
  Download,
  Copy,
  Sparkles,
  Zap,
  Menu,
  MoreHorizontal,
} from 'lucide-react'
import { toast } from 'sonner'
import { PreviewPanel } from './preview-panel'
import { MessageBubble } from './message-bubble'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu'

interface ChatInterfaceProps {
  chatId: string | null
  onNewChat: (chatId: string) => void
}

export function ChatInterface({ chatId, onNewChat }: ChatInterfaceProps) {
  const [generatedCode, setGeneratedCode] = useState('')
  const [showPreviewOptions, setShowPreviewOptions] = useState(false)
  const [initialMessages, setInitialMessages] = useState<any[]>([])
  const [historyLoaded, setHistoryLoaded] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const prevChatId = useRef<string | null>(null)
  const prevMessagesLength = useRef<number>(0)
  // Store preview code per chatId
  const previewCache = useRef<{ [id: string]: string }>({})
  // Add a flag to track if we just switched chats
  const justSwitchedChat = useRef(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)

  // Fetch chat history when chatId changes
  useEffect(() => {
    async function fetchHistory() {
      setHistoryLoaded(false)
      if (chatId) {
        const res = await fetch(`/api/chats/${chatId}`)
        if (res.ok) {
          const data = await res.json()
          setInitialMessages(
            (data.messages || []).map((msg: any) => ({
              id: msg.id,
              role: msg.role,
              content: msg.content,
            }))
          )
        }
      } else {
        setInitialMessages([])
      }
      setHistoryLoaded(true)
    }
    fetchHistory()
  }, [chatId])

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    setInput,
    setMessages,
    stop, // included but not used manually
  } = useChat({
    api: '/api/chat',
    body: { chatId },
    streamProtocol: 'text',
    initialMessages: historyLoaded ? initialMessages : [],
    onFinish: (message) => {
      const code = buildPreviewHtmlFromMessage(message.content)
      setGeneratedCode(code)
      setShowPreviewOptions(!!code)
      if (chatId && code) previewCache.current[chatId] = code
      window.dispatchEvent(new Event('refresh-chats'))
    },
  })

  // On chatId change, restore preview if available
  useEffect(() => {
    if (chatId && previewCache.current[chatId]) {
      setGeneratedCode(previewCache.current[chatId])
      setShowPreviewOptions(!!previewCache.current[chatId])
    } else {
      setGeneratedCode('')
      setShowPreviewOptions(false)
    }
  }, [chatId])

  // Restore history after load
  useEffect(() => {
    if (historyLoaded) {
      setMessages(initialMessages)
      justSwitchedChat.current = true
      // Find the latest assistant message with a code block
      const lastCodeMsg = [...initialMessages].reverse().find(
        (msg) =>
          msg.role === 'assistant' &&
          /```html[\s\S]*?```|```css[\s\S]*?```/i.test(msg.content)
      )
      if (lastCodeMsg) {
        const code = buildPreviewHtmlFromMessage(lastCodeMsg.content)
        setGeneratedCode(code)
        setShowPreviewOptions(!!code)
        if (chatId && code) previewCache.current[chatId] = code
      } else {
        setGeneratedCode('')
        setShowPreviewOptions(false)
      }
    }
  }, [historyLoaded, initialMessages, setMessages, chatId])

  // Scroll to top when chatId changes (when switching chats)
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = 0
    }
    // Reset prevMessagesLength so the next message triggers scroll to bottom
    prevMessagesLength.current = messages.length
    prevChatId.current = chatId
    justSwitchedChat.current = true
  }, [chatId])

  // Scroll to bottom only when a new message is added to the current chat
  useEffect(() => {
    // Prevent scroll to bottom on first render after switching chats
    if (justSwitchedChat.current) {
      justSwitchedChat.current = false
      prevMessagesLength.current = messages.length
      return
    }
    // Only scroll to bottom if chatId hasn't changed and a new message is added
    if (prevChatId.current === chatId && messages.length > prevMessagesLength.current) {
      if (scrollAreaRef.current) {
        scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
      }
    }
    prevMessagesLength.current = messages.length
  }, [messages, chatId])

  function buildPreviewHtmlFromMessage(messageContent: string) {
    const htmlMatch = messageContent.match(/```html\n([\s\S]*?)```/)
    const cssMatch = messageContent.match(/```css\n([\s\S]*?)```/)
    const html = htmlMatch?.[1] ?? ''
    const css = cssMatch?.[1] ?? ''
    if (!html && !css) return ''
    return `<!DOCTYPE html><html><head><meta charset='utf-8'><title>Preview</title>${
      css ? `<style>${css}</style>` : ''
    }</head><body>${html}</body></html>`
  }

  const handleCopyCode = () => {
    if (generatedCode) {
      navigator.clipboard.writeText(generatedCode)
      toast.success('Code copied to clipboard!')
    }
  }

  const handleDownloadCode = () => {
    if (generatedCode) {
      const blob = new Blob([generatedCode], { type: 'text/html' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'landing-page.html'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      toast.success('HTML file downloaded!')
    }
  }

  const handleOpenPreview = () => {
    if (generatedCode) {
      const blob = new Blob([generatedCode], { type: 'text/html' })
      const url = URL.createObjectURL(blob)
      window.open(url, '_blank', 'noopener,noreferrer')
      // Optionally revoke after some time
      setTimeout(() => URL.revokeObjectURL(url), 10000)
    }
  }

  const quickPrompts = [
    {
      label: 'SaaS Landing Page',
      prompt: 'Create a modern SaaS landing page for a project management tool with a blue color scheme',
    },
    {
      label: 'Portfolio Page',
      prompt: 'Design a creative portfolio landing page for a web designer with dark theme and animations',
    },
    {
      label: 'Product Launch',
      prompt: 'Build a product launch page for a mobile app with gradient backgrounds and modern design',
    },
  ]

  async function handleFormSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!input.trim() || isLoading) return
    let newChatId = chatId
    // Always append the new formatting instruction
    const formattedPrompt = input.trim() + ' Give a beautiful response format, and do not use ** or similar markdown that looks odd on display.'
    if (!chatId) {
      const res = await fetch('/api/chats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: formattedPrompt }),
      })
      if (res.ok) {
        const chat = await res.json()
        newChatId = chat.id
        onNewChat(chat.id)
        window.dispatchEvent(new Event('refresh-chats'))
      } else {
        toast.error('Failed to create chat')
        return
      }
    }
    handleSubmit(e, { body: { chatId: newChatId, prompt: formattedPrompt } })
    window.dispatchEvent(new Event('refresh-chats'))
  }

  return (
    <div key={chatId ?? 'new'} className="flex-1 flex h-screen bg-[var(--color-bg)] overflow-x-hidden max-w-full">
      <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full overflow-x-hidden max-w-full">
        {/* Header */}
        <div className="py-4">
          <div className="w-4/5 mx-auto bg-[var(--color-card)] border-b border-[var(--color-border)] p-4 rounded-xl gap-4">
            <div className="flex flex-row items-center justify-center w-full md:w-auto gap-4">
              <div className="flex flex-col items-center w-full md:w-auto">
                <h1 className="text-xl md:text-2xl font-semibold text-[var(--color-text)] text-center">AI Generator</h1>
                <p className="text-sm md:text-base text-[var(--color-muted)] text-center">
                  Describe your landing page and I'll generate the HTML & CSS
                </p>
              </div>
              {/* Preview options always visible if code exists */}
              {showPreviewOptions && (
                <>
                  {/* Desktop: show inline */}
                  <div className="hidden sm:flex flex-row items-center gap-2 w-full md:w-auto">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCopyCode}
                      className="border-[#5D2DE6] hover:border-[#5CD4D4] focus:border-[#5CD4D4] dark:border-[#5D2DE6] dark:hover:border-[#5CD4D4] dark:focus:border-[#5CD4D4] text-black dark:text-white hover:bg-transparent dark:hover:bg-transparent"
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy Code
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleDownloadCode}
                      className="border-[#5D2DE6] hover:border-[#5CD4D4] focus:border-[#5CD4D4] dark:border-[#5D2DE6] dark:hover:border-[#5CD4D4] dark:focus:border-[#5CD4D4] text-black dark:text-white hover:bg-transparent dark:hover:bg-transparent"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleOpenPreview}
                      className="border-[#5D2DE6] hover:border-[#5CD4D4] focus:border-[#5CD4D4] dark:border-[#5D2DE6] dark:hover:border-[#5CD4D4] dark:focus:border-[#5CD4D4] text-black dark:text-white hover:bg-transparent dark:hover:bg-transparent min-w-[90px] px-2"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Preview
                    </Button>
                  </div>
                  {/* Mobile: show dropdown menu right-aligned */}
                  <div className="sm:hidden p-2 flex justify-end">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          className="border-[#5D2DE6] text-black dark:text-white bg-white dark:bg-[var(--color-card)] hover:bg-gray-100 dark:hover:bg-[#23263a] rounded-md"
                          aria-label="Show options"
                        >
                          <MoreHorizontal className="h-5 w-5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="min-w-[140px] border-[#5D2DE6] bg-white dark:bg-[var(--color-card)] rounded-md">
                        <DropdownMenuItem
                          onClick={handleCopyCode}
                          className="text-black dark:text-white hover:bg-gray-100 dark:hover:bg-[#23263a] focus:bg-gray-100 dark:focus:bg-[#23263a]"
                        >
                          <Copy className="h-4 w-4 mr-2" /> Copy Code
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={handleDownloadCode}
                          className="text-black dark:text-white hover:bg-gray-100 dark:hover:bg-[#23263a] focus:bg-gray-100 dark:focus:bg-[#23263a]"
                        >
                          <Download className="h-4 w-4 mr-2" /> Download
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={handleOpenPreview}
                          className="text-black dark:text-white hover:bg-gray-100 dark:hover:bg-[#23263a] focus:bg-gray-100 dark:focus:bg-[#23263a]"
                        >
                          <Eye className="h-4 w-4 mr-2" /> Preview
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Messages */}
        <div
          ref={scrollAreaRef}
          className="flex-1 p-4 bg-[var(--color-bg)] overflow-auto"
        >
          {messages.length === 0 ? (
            <div className="flex flex-col justify-center h-full px-4">
              <div className="text-center max-w-md mx-auto">
                <div className="h-14 w-14 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="h-7 w-7 text-white" />
                </div>
                <h2 className="text-2xl font-bold mb-2 text-[var(--color-text)]">Ready to build?</h2>
                <p className="text-[var(--color-muted)] mb-6">
                  Tell me what kind of landing page you'd like to create. Be specific about:
                </p>
                <div className="text-left space-y-2 mb-6">
                  <div className="flex items-center space-x-2">
                    <div className="h-2 w-2 bg-blue-600 rounded-full" />
                    <span className="text-sm text-[var(--color-text)]">Purpose (business, portfolio, product launch)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="h-2 w-2 bg-purple-600 rounded-full" />
                    <span className="text-sm text-[var(--color-text)]">Style preferences (modern, minimal, bold)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="h-2 w-2 bg-green-600 rounded-full" />
                    <span className="text-sm text-[var(--color-text)]">Colors and content themes</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 justify-center">
                  {quickPrompts.map((item) => (
                    <Button
                      key={item.label}
                      variant="outline"
                      size="sm"
                      onClick={() => setInput(item.prompt)}
                    >
                      {item.label}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6 w-full">
            {messages
              .filter((m): m is { id: string; role: 'user' | 'assistant'; content: string } =>
                m.role === 'user' || m.role === 'assistant'
              )
              .map((message) => (
                <MessageBubble key={message.id} message={message} />
              ))}

              {isLoading && (
                <div className="flex items-center space-x-2 text-[var(--color-muted)]">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600" />
                  <span className="text-sm">Generating your landing page...</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Input */}
        <div className="p-4 border-t border-[var(--color-border)] bg-[var(--color-card)] mt-4">
          <form onSubmit={handleFormSubmit} className="flex space-x-2 max-w-3xl mx-auto">
            <Input
              value={input}
              onChange={handleInputChange}
              placeholder="Describe the landing page you want to create..."
              className="flex-1"
              disabled={isLoading}
            />
            <Button type="submit" disabled={isLoading || !input.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
