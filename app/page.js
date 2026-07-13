import Hero from '@/components/sections/Hero'
import Studio from '@/components/sections/Studio'
import TheWayWeBuild from '@/components/sections/TheWayWeBuild'
import Projects from '@/components/sections/Projects'
import Services from '@/components/sections/Services'
import Enterprise from '@/components/sections/Enterprise'
import TheFutureIsEngineered from '@/components/sections/TheFutureIsEngineered'
import About from '@/components/sections/About'
import FAQ from '@/components/sections/FAQ'
import FinalEnding from '@/components/sections/FinalEnding'
import Contact from '@/components/sections/Contact'

export default function Page() {
  return (
    <main className="relative bg-[#050505] text-white overflow-hidden">
      <Hero />
      <Studio />
      <TheWayWeBuild />
      <Projects />
      <Services />
      <TheFutureIsEngineered />
      <Enterprise />
      <About />
      <FAQ />
      <Contact />
      <FinalEnding />
    </main>
  )
}