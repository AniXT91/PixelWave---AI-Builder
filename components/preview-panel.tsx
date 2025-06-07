'use client'

import { useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { ExternalLink, Maximize, Minimize, ChevronDown, Eye } from 'lucide-react'
import { useState } from 'react'

interface PreviewPanelProps {
  htmlCode: string
}

export function PreviewPanel({ htmlCode }: PreviewPanelProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [collapsed, setCollapsed] = useState(false)

  useEffect(() => {
    if (iframeRef.current && htmlCode) {
      const iframe = iframeRef.current
      const doc = iframe.contentDocument || iframe.contentWindow?.document
      
      if (doc) {
        doc.open()
        doc.write(htmlCode)
        doc.close()
      }
    }
  }, [htmlCode])

  const openInNewTab = () => {
    const newWindow = window.open()
    if (newWindow) {
      newWindow.document.write(htmlCode)
      newWindow.document.close()
    }
  }

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  if (collapsed) {
    return (
      <button
        className="fixed bottom-24 right-6 z-50 bg-white dark:bg-[var(--color-card)] border border-[var(--color-border)] shadow-lg rounded-full p-3 flex items-center space-x-2 hover:bg-[var(--color-bg)] transition-colors"
        onClick={() => setCollapsed(false)}
        aria-label="Show Preview"
      >
        <Eye className="h-5 w-5 text-[var(--color-primary)]" />
        <span className="text-xs font-semibold text-[var(--color-primary)]">Show Preview</span>
      </button>
    )
  }

  return (
    <div className={`${isFullscreen ? 'fixed inset-0 z-50 bg-white' : 'w-full md:w-1/2'} flex flex-col max-w-full overflow-x-hidden`}>
      {/* Preview Header */}
      <div className="p-4 border-b border-orange-200 bg-white">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-orange-800">Preview</h2>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={openInNewTab}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Open in New Tab
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={toggleFullscreen}
            >
              {isFullscreen ? (
                <>
                  <Minimize className="h-4 w-4 mr-2" />
                  Exit Fullscreen
                </>
              ) : (
                <>
                  <Maximize className="h-4 w-4 mr-2" />
                  Fullscreen
                </>
              )}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCollapsed(true)}
              aria-label="Collapse Preview"
            >
              <ChevronDown className="h-4 w-4 mr-2" />
              Collapse
            </Button>
          </div>
        </div>
      </div>

      {/* Preview Content */}
      <div className="flex-1 bg-orange-50 p-4 overflow-x-auto">
        <div className="h-full bg-white rounded-lg shadow-lg overflow-hidden max-w-full">
          <iframe
            ref={iframeRef}
            className="w-full h-full border-0"
            title="Landing Page Preview"
            sandbox="allow-scripts allow-same-origin"
            style={{ maxWidth: '100vw' }}
          />
        </div>
      </div>
    </div>
  )
}