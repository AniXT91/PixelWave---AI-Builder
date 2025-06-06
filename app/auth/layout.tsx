export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#181c2a] via-[#1a1b23] to-[#23263a] p-4">
      {children}
    </div>
  )
} 