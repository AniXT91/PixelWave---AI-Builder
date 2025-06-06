'use client'

import { useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { ExternalLink, Maximize, Minimize } from 'lucide-react'
import { useState } from 'react'

interface PreviewPanelProps {
  htmlCode: string
}

export function PreviewPanel({ htmlCode }: PreviewPanelProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)

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

  return (
    <div className={`${isFullscreen ? 'fixed inset-0 z-50 bg-white' : 'w-1/2'} flex flex-col`}>
      {/* Preview Header */}
      <div className="p-4 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Live Preview</h2>
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
          </div>
        </div>
      </div>

      {/* Preview Content */}
      <div className="flex-1 bg-gray-50 p-4">
        <div className="h-full bg-white rounded-lg shadow-lg overflow-hidden">
          <iframe
            ref={iframeRef}
            className="w-full h-full border-0"
            title="Landing Page Preview"
            sandbox="allow-scripts allow-same-origin"
          />
        </div>
      </div>
    </div>
  )
}