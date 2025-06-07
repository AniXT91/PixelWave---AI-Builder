'use client'

import { useState, useEffect, useRef } from 'react'
import { useChat } from 'ai/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import {
  Send,
  Code,
  Eye,
  Download,
  Copy,
  Sparkles,
} from 'lucide-react'
import { toast } from 'sonner'
import { PreviewPanel } from './preview-panel'
import { MessageBubble } from './message-bubble'

interface ChatInterfaceProps {
  chatId: string | null
  onNewChat: (chatId: string) => void
}

export function ChatInterface({ chatId, onNewChat }: ChatInterfaceProps) {
  const [showPreview, setShowPreview] = useState(false)
  const [generatedCode, setGeneratedCode] = useState('')
  const [initialMessages, setInitialMessages] = useState<any[]>([])
  const [historyLoaded, setHistoryLoaded] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    async function fetchHistory() {
      if (chatId) {
        setHistoryLoaded(false)
        const res = await fetch(`/api/chats/${chatId}`)
        if (res.ok) {
          const data = await res.json()
          if (data?.messages) {
            setInitialMessages(
              data.messages.map((msg: any) => ({
                id: msg.id,
                role: msg.role,
                content: msg.content,
              }))
            )
          }
        }
        setHistoryLoaded(true)
      } else {
        setInitialMessages([])
        setHistoryLoaded(true)
      }
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
  } = useChat({
    api: '/api/chat',
    body: { chatId },
    streamProtocol: 'text',
    initialMessages: historyLoaded ? initialMessages : [],
    onFinish: (message) => {
      setGeneratedCode(buildPreviewHtmlFromMessage(message.content))
      setShowPreview(true)
      if (typeof window !== 'undefined' && window.dispatchEvent) {
        window.dispatchEvent(new Event('refresh-chats'))
      }
    },
  })

  useEffect(() => {
    if (historyLoaded && initialMessages.length > 0) {
      setMessages(initialMessages)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [historyLoaded])

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  useEffect(() => {
    // Reset UI when chatId changes (new chat or switching chat)
    setGeneratedCode('')
    setShowPreview(false)
    setInput('')
  }, [chatId])

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

  // Helper to extract HTML and CSS code blocks and build a full HTML document
  function buildPreviewHtmlFromMessage(messageContent: string) {
    const htmlMatch = messageContent.match(/```html\n([\s\S]*?)```/)
    const cssMatch = messageContent.match(/```css\n([\s\S]*?)```/)
    let html = htmlMatch ? htmlMatch[1] : ''
    let css = cssMatch ? cssMatch[1] : ''
    if (!html && !css) return ''
    return `<!DOCTYPE html><html><head><meta charset='utf-8'><title>Preview</title>${css ? `<style>${css}</style>` : ''}</head><body>${html}</body></html>`
  }

  // Intercept form submit to auto-create chat if needed
  async function handleFormSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!input.trim() || isLoading) return
    let newChatId = chatId
    if (!chatId) {
      // Create chat first, use prompt as title
      const res = await fetch('/api/chats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: input.trim() })
      })
      if (res.ok) {
        const chat = await res.json()
        newChatId = chat.id
        onNewChat(chat.id)
        // Immediately refresh sidebar so new chat appears
        if (typeof window !== 'undefined' && window.dispatchEvent) {
          window.dispatchEvent(new Event('refresh-chats'))
        }
      } else {
        toast.error('Failed to create chat')
        return
      }
    }
    setInput(input)
    handleSubmit(e, { body: { chatId: newChatId } })
    // After sending, fetch chats to update sidebar
    if (typeof window !== 'undefined' && window.dispatchEvent) {
      window.dispatchEvent(new Event('refresh-chats'))
    }
  }

  return (
    <div className="flex-1 flex h-screen bg-[var(--color-bg)]">
      {/* Chat Area */}
      <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full">
        {/* Header */}
        <div className="p-4 border-b border-[var(--color-border)] bg-[var(--color-card)]">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-[var(--color-text)]">AI Landing Page Generator</h1>
              <p className="text-sm text-[var(--color-muted)]">
                Describe your landing page and I'll generate the HTML & CSS
              </p>
            </div>
            <div className="flex items-center space-x-2">
              {generatedCode && (
                <>
                  <Button variant="outline" size="sm" onClick={handleCopyCode}>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Code
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleDownloadCode}>
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowPreview(!showPreview)}
                  >
                    {showPreview ? (
                      <>
                        <Code className="h-4 w-4 mr-2" />
                        Show Chat
                      </>
                    ) : (
                      <>
                        <Eye className="h-4 w-4 mr-2" />
                        Show Preview
                      </>
                    )}
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4 bg-[var(--color-bg)]">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center max-w-md">
                <div className="h-16 w-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="h-8 w-8 text-white" />
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
            <div className="space-y-6 max-w-3xl mx-auto">
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
        </ScrollArea>

        {/* Input */}
        <div className="p-4 border-t border-[var(--color-border)] bg-[var(--color-card)]">
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

      {/* Preview Panel */}
      {showPreview && generatedCode && (
        <>
          <Separator orientation="vertical" className="bg-[var(--color-border)]" />
          <PreviewPanel htmlCode={generatedCode} />
        </>
      )}
    </div>
  )
}
