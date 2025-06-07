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
    <Card className="w-full max-w-md bg-[#23263a] border-[#314155] shadow-xl">
      <CardHeader className="text-center">
        <div className="mx-auto h-12 w-12 bg-gradient-to-r from-[#5CD4D4] to-[#314155] rounded-lg flex items-center justify-center mb-4 shadow-lg">
          <Sparkles className="h-6 w-6 text-[#1B1D29]" />
        </div>
        <CardTitle className="text-2xl font-bold text-white">Welcome back</CardTitle>
        <CardDescription className="text-[#AAAAAA]">
          Sign in to your account to continue building amazing landing pages
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleCredentialsSignIn} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-[#AAAAAA]">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-[#1B1D29] border-[#314155] text-white placeholder:text-[#777E90] focus:border-[#5CD4D4]"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-[#AAAAAA]">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="bg-[#1B1D29] border-[#314155] text-white placeholder:text-[#777E90] focus:border-[#5CD4D4]"
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-[#5CD4D4] to-[#314155] hover:from-[#377179] hover:to-[#5CD4D4] text-[#1B1D29]"
            disabled={isLoading}
          >
            {isLoading ? 'Signing in...' : 'Sign in'}
          </Button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <Separator className="w-full bg-[#314155]" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-[#23263a] px-2 text-[#AAAAAA]">
              Or continue with
            </span>
          </div>
        </div>

        <div className="flex justify-center">
          <Button
            variant="outline"
            onClick={() => handleOAuthSignIn('google')}
            className="w-48 justify-center border-[#314155] text-[#AAAAAA] hover:bg-[#1B1D29] hover:text-white"
          >
            <Mail className="mr-2 h-4 w-4" />
            Google
          </Button>
        </div>

        <div className="text-center text-sm text-[#AAAAAA]">
          Don't have an account?{' '}
          <Link href="/auth/signup" className="text-[#5CD4D4] hover:text-[#377179] hover:underline">
            Sign up
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}