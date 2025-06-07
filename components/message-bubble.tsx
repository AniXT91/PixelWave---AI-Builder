'use client'

import { User, Bot } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { materialLight, materialDark } from 'react-syntax-highlighter/dist/cjs/styles/prism'

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

  // Find HTML and CSS code blocks (support optional whitespace after language)
  const htmlMatch = message.content.match(/```html\s*\r?\n([\s\S]*?)```/)
  const cssMatch = message.content.match(/```css\s*\r?\n([\s\S]*?)```/)
  const textBeforeCode = message.content.split(/```(?:html|css)/)[0].trim()

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} w-full max-w-full`}>
      <div className={`flex max-w-3xl w-full max-w-full ${isUser ? 'flex-row-reverse' : 'flex-row'} space-x-3`}>
        <Avatar className="h-8 w-8 flex-shrink-0">
          <AvatarFallback className={isUser ? 'bg-[var(--color-primary)] text-white' : 'bg-[var(--color-secondary)] text-white'}>
            {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
          </AvatarFallback>
        </Avatar>

        <div
          className={`rounded-2xl px-4 py-3 w-full max-w-full break-words ${
            isUser
              ? 'bg-gradient-to-r from-[#5D2DE6] to-[#5CD4D4] text-white ml-3'
              : 'bg-[#F7FAFC] text-[#334155] border border-[#E2E8F0] dark:bg-[#232B3A] dark:text-[#F4F6F8] dark:border-[#314155] mr-3'
          }`}
        >
          <div className="prose prose-sm max-w-full dark:prose-invert text-xs">
            {htmlMatch || cssMatch ? (
              <>
                {textBeforeCode && <p className="mb-2 text-xs text-[var(--color-text)]">{textBeforeCode}</p>}
                {htmlMatch && (
                  <div className="mb-3">
                    <div className="font-semibold text-[10px] text-[var(--color-muted)] mb-1">HTML</div>
                    <div className="break-words overflow-x-auto">
                      <SyntaxHighlighter
                        language="html"
                        style={isUser ? materialLight : materialDark}
                        customStyle={{
                          borderRadius: '0.75rem',
                          padding: '1rem',
                          margin: 0,
                          fontSize: '0.75rem',
                          whiteSpace: 'pre-wrap',
                          wordBreak: 'break-word',
                          overflowX: 'auto',
                        }}
                      >
                        {htmlMatch[1].trim()}
                      </SyntaxHighlighter>
                    </div>
                  </div>
                )}
                {cssMatch && (
                  <div>
                    <div className="font-semibold text-[10px] text-[var(--color-muted)] mb-1">CSS</div>
                    <div className="break-words overflow-x-auto">
                      <SyntaxHighlighter
                        language="css"
                        style={isUser ? materialLight : materialDark}
                        customStyle={{
                          borderRadius: '0.75rem',
                          padding: '1rem',
                          margin: 0,
                          fontSize: '0.75rem',
                          whiteSpace: 'pre-wrap',
                          wordBreak: 'break-word',
                          overflowX: 'auto',
                        }}
                      >
                        {cssMatch[1].trim()}
                      </SyntaxHighlighter>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <p className="whitespace-pre-wrap text-xs text-[var(--color-text)]">{message.content}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
