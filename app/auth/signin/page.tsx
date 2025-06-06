'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Mail, Sparkles } from 'lucide-react'
import { toast } from 'sonner'

export default function SignIn() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleCredentialsSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        toast.error('Invalid credentials')
      } else {
        toast.success('Signed in successfully!')
        router.push('/dashboard')
      }
    } catch (error) {
      toast.error('Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  const handleOAuthSignIn = async (provider: string) => {
    try {
      await signIn(provider, { callbackUrl: '/dashboard' })
    } catch (error) {
      toast.error('Failed to sign in')
    }
  }

  return (
    <Card className="w-full max-w-md bg-[#23263a] border-[#2d3142] shadow-xl">
      <CardHeader className="text-center">
        <div className="mx-auto h-12 w-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mb-4">
          <Sparkles className="h-6 w-6 text-white" />
        </div>
        <CardTitle className="text-2xl font-bold text-white">Welcome back</CardTitle>
        <CardDescription className="text-gray-400">
          Sign in to your account to continue building amazing landing pages
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleCredentialsSignIn} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-300">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-[#1a1b23] border-[#2d3142] text-white placeholder:text-gray-500 focus:border-blue-500"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-gray-300">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="bg-[#1a1b23] border-[#2d3142] text-white placeholder:text-gray-500 focus:border-blue-500"
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
            disabled={isLoading}
          >
            {isLoading ? 'Signing in...' : 'Sign in'}
          </Button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <Separator className="w-full bg-[#2d3142]" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-[#23263a] px-2 text-gray-400">
              Or continue with
            </span>
          </div>
        </div>

        <div className="flex justify-center">
          <Button
            variant="outline"
            onClick={() => handleOAuthSignIn('google')}
            className="w-48 justify-center border-[#2d3142] text-gray-300 hover:bg-[#1a1b23] hover:text-white"
          >
            <Mail className="mr-2 h-4 w-4" />
            Google
          </Button>
        </div>

        <div className="text-center text-sm text-gray-400">
          Don't have an account?{' '}
          <Link href="/auth/signup" className="text-blue-400 hover:text-blue-300 hover:underline">
            Sign up
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}