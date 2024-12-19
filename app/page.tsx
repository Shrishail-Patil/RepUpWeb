import Hero from './pre-auth/LangingComps/Hero'
import Features from './pre-auth/LangingComps/Features'
import HowItWorks from './pre-auth/LangingComps/HowItWorks'
import CTA from './pre-auth/LangingComps/CTA'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between bg-gray-100">
      <Hero />
      <Features />
      <HowItWorks />
      <CTA />
    </main>
  )
}

