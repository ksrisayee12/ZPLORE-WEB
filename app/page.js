import Header from '@/components/Header';
import SmoothScroll from '@/components/SmoothScroll';
import Hero from '@/components/sections/Hero';
import Studio from '@/components/sections/Studio';
import Projects from '@/components/sections/Projects';
import Services from '@/components/sections/Services';
import Enterprise from '@/components/sections/Enterprise';
import About from '@/components/sections/About';
import Contact from '@/components/sections/Contact';
import Footer from '@/components/Footer';

/**
 * page.js — Main page composition.
 *
 * Section order matches reference exactly:
 * Header (sticky) → Hero → Studio → Projects → Services → Enterprise → About → Contact → Footer
 *
 * SmoothScroll wraps all content to init Lenis + GSAP ScrollTrigger.
 */
export default function Home() {
  return (
    <SmoothScroll>
      <Header />
      <main>
        <Hero />
        <Studio />
        <Projects />
        <Services />
        <Enterprise />
        <About />
        <Contact />
      </main>
      <Footer />
    </SmoothScroll>
  );
}
