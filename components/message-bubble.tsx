'use client'

import { User, Bot } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
}

interface MessageBubbleProps {
  message: Message
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user'

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex max-w-3xl ${isUser ? 'flex-row-reverse' : 'flex-row'} space-x-3`}>
        <Avatar className="h-8 w-8 flex-shrink-0">
          <AvatarFallback className={isUser ? 'bg-blue-600 text-white' : 'bg-purple-600 text-white'}>
            {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
          </AvatarFallback>
        </Avatar>
        
        <div className={`rounded-2xl px-4 py-3 ${
          isUser 
            ? 'bg-[var(--color-primary)] text-white ml-3' 
            : 'bg-[var(--color-card)] text-[var(--color-text)] mr-3 border border-[var(--color-border)]'
        }`}>
          <div className="prose prose-sm max-w-none dark:prose-invert">
            {(() => {
              // Extract HTML and CSS code blocks
              const htmlMatch = message.content.match(/```html\n([\s\S]*?)```/)
              const cssMatch = message.content.match(/```css\n([\s\S]*?)```/)
              const beforeHtml = message.content.split('```html')[0].trim()
              return htmlMatch || cssMatch ? (
                <div>
                  {beforeHtml && <div className="mb-3 text-[var(--color-text)]">{beforeHtml}</div>}
                  {htmlMatch && (
                    <div className="mb-3">
                      <div className="font-semibold text-xs text-[var(--color-muted)] mb-1">HTML</div>
                      <div className="bg-[var(--color-card-dark)] text-green-400 rounded-lg p-3 text-xs font-mono overflow-x-auto">
                        <pre className="whitespace-pre-wrap">{htmlMatch[1]}</pre>
                      </div>
                    </div>
                  )}
                  {cssMatch && (
                    <div>
                      <div className="font-semibold text-xs text-[var(--color-muted)] mb-1">CSS</div>
                      <div className="bg-[var(--color-card-dark)] text-blue-300 rounded-lg p-3 text-xs font-mono overflow-x-auto">
                        <pre className="whitespace-pre-wrap">{cssMatch[1]}</pre>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <p className="whitespace-pre-wrap text-[var(--color-text)]">{message.content}</p>
              )
            })()}
          </div>
        </div>
      </div>
    </div>
  )
}