import { redirect } from 'next/navigation'
import { LandingPage } from '@/components/landing-page'
import { getAuthSession } from '@/lib/auth'

export default async function Home() {
  const session = await getAuthSession()

  if (session) {
    redirect('/dashboard')
  }

  return <LandingPage />
}