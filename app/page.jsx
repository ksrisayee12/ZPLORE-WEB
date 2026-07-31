import Hero from '@/components/sections/Hero'
import Studio from '@/components/sections/Studio'
import Projects from '@/components/sections/Projects'
import Services from '@/components/sections/Services'
import Enterprise from '@/components/sections/Enterprise'
import About from '@/components/sections/About'
import Contact from '@/components/sections/Contact'

export default function Page() {
  return (
    <main className="relative bg-[#050505] text-white overflow-hidden">
      <Hero />
      <Studio />
      <Projects />
      <Services />
      <Enterprise />
      <About />
      <Contact />
    </main>
  )
}