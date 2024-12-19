import './globals.css'
import { Inter } from 'next/font/google'
import SupabaseProvider from '@/components/supabaseProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'RepUp - AI Workout Plan Generator',
  description: 'Get personalized workout plans powered by AI with RepUp',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <SupabaseProvider>
        <body className={inter.className}>{children}</body>
      </SupabaseProvider>
    </html>
  )
}

