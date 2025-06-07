'use client'

import { Button } from '@/components/ui/button'
import { ArrowRight, Zap, Code, Eye } from 'lucide-react'
import Link from 'next/link'

export function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#18181b] via-[#23263a] via-60% to-[#5D2DE6]">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 bg-gradient-to-r from-[#5D2DE6] to-[#5CD4D4] rounded-lg flex items-center justify-center shadow-lg">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-[#5D2DE6] to-[#5CD4D4] bg-clip-text text-transparent">
              Pixel Wave
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/auth/signin">
              <Button variant="ghost" className="text-[#5D2DE6] hover:bg-gradient-to-r hover:from-[#5D2DE6] hover:to-[#5CD4D4] hover:text-white transition-colors duration-200">Sign In</Button>
            </Link>
            <Link href="/auth/signup">
              <Button className="bg-gradient-to-r from-[#5D2DE6] to-[#5CD4D4] text-white shadow-md">Get Started</Button>
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="flex flex-col items-center justify-center py-16 overflow-visible">
        <div className="text-center max-w-4xl mx-auto w-full px-4">
          <div className="inline-flex items-center px-4 py-2 bg-[#25474F] bg-opacity-60 rounded-full text-[#5CD4D4] text-sm font-medium mb-8 shadow">
            <Zap className="h-4 w-4 mr-2" />
            AI-Powered Landing Page Generation
          </div>
          
          <h1
            className="text-5xl md:text-6xl p-2 font-bold bg-gradient-to-r from-[#7C5DFA] to-[#5CD4D4] bg-clip-text text-transparent mb-6 leading-tight drop-shadow-[0_4px_32px_rgba(44,62,80,0.45)]"
            style={{
              WebkitTextStroke: '1px #23263a',
              textShadow: '0 2px 16px rgba(44,62,80,0.45), 0 1px 0 #fff',
            }}
          >
            Create Stunning Landing Pages with AI
          </h1>
          
          <p className="text-xl text-[#AAAAAA] mb-8 max-w-2xl mx-auto leading-relaxed">
            Transform your ideas into beautiful, responsive HTML & CSS landing pages in seconds. 
            Just describe what you want, and our AI will generate production-ready code with live preview.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Link href="/auth/signup">
              <Button
                size="lg"
                className="bg-gradient-to-r from-[#7C5DFA] to-[#5CD4D4] hover:from-[#5CD4D4] hover:to-[#7C5DFA] text-white px-8 py-3 text-lg shadow-lg font-bold drop-shadow-[0_4px_32px_rgba(44,62,80,0.45)]"
                style={{
                  WebkitTextStroke: '0.5px #23263a',
                  textShadow: '0 2px 12px rgba(44,62,80,0.35), 0 1px 0 #fff',
                }}
              >
                Start Building Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
            <div className="bg-[#23263a] p-8 rounded-2xl shadow-lg border border-[#314155] hover:shadow-2xl transition-shadow">
              <div className="h-12 w-12 bg-[#5CD4D4] bg-opacity-20 rounded-lg flex items-center justify-center mb-6 mx-auto">
                <Code className="h-6 w-6 text-[#5CD4D4]" />
              </div>
              <h3
                className="text-xl font-bold mb-4 bg-gradient-to-r from-[#7C5DFA] to-[#5CD4D4] bg-clip-text text-transparent drop-shadow-[0_4px_32px_rgba(44,62,80,0.45)]"
                style={{
                  WebkitTextStroke: '0.5px #23263a',
                  textShadow: '0 2px 12px rgba(44,62,80,0.35), 0 1px 0 #fff',
                }}
              >
                AI Code Generation
              </h3>
              <p className="text-[#AAAAAA]">
                Advanced AI generates clean, semantic HTML and modern CSS based on your natural language descriptions.
              </p>
            </div>

            <div className="bg-[#23263a] p-8 rounded-2xl shadow-lg border border-[#314155] hover:shadow-2xl transition-shadow">
              <div className="h-12 w-12 bg-[#314155] bg-opacity-20 rounded-lg flex items-center justify-center mb-6 mx-auto">
                <Eye className="h-6 w-6 text-[#5CD4D4]" />
              </div>
              <h3
                className="text-xl font-bold mb-4 bg-gradient-to-r from-[#7C5DFA] to-[#5CD4D4] bg-clip-text text-transparent drop-shadow-[0_4px_32px_rgba(44,62,80,0.45)]"
                style={{
                  WebkitTextStroke: '0.5px #23263a',
                  textShadow: '0 2px 12px rgba(44,62,80,0.35), 0 1px 0 #fff',
                }}
              >
                Live Preview
              </h3>
              <p className="text-[#AAAAAA]">
                See your landing page come to life instantly with our real-time preview feature. No refresh needed.
              </p>
            </div>

            <div className="bg-[#23263a] p-8 rounded-2xl shadow-lg border border-[#314155] hover:shadow-2xl transition-shadow">
              <div className="h-12 w-12 bg-[#377179] bg-opacity-20 rounded-lg flex items-center justify-center mb-6 mx-auto">
                <Zap className="h-6 w-6 text-[#5CD4D4]" />
              </div>
              <h3
                className="text-xl font-bold mb-4 bg-gradient-to-r from-[#7C5DFA] to-[#5CD4D4] bg-clip-text text-transparent drop-shadow-[0_4px_32px_rgba(44,62,80,0.45)]"
                style={{
                  WebkitTextStroke: '0.5px #23263a',
                  textShadow: '0 2px 12px rgba(44,62,80,0.35), 0 1px 0 #fff',
                }}
              >
                Export Ready
              </h3>
              <p className="text-[#AAAAAA]">
                Download production-ready HTML files that work everywhere. Mobile responsive and SEO optimized.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 mt-20 border-t border-[#314155]">
        <div className="text-center text-[#777E90]">
          <p>&copy; 2024 Pixel Wave. Built with Next.js, TypeScript, and OpenAI.</p>
        </div>
      </footer>
    </div>
  )
}
