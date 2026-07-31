import './globals.css'
import { Providers } from './providers'
import SmoothScroll from '@/components/site/SmoothScroll'
import Nav from '@/components/site/Nav'
import Footer from '@/components/site/Footer'

export const metadata = {
  title: 'Zplore — Deep-Tech Studio',
  description: 'Zplore builds frontier AI, security, and intelligence systems. Studio · Projects · Services · Enterprise.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <head>
        <script dangerouslySetInnerHTML={{__html:'window.addEventListener("error",function(e){if(e.error instanceof DOMException&&e.error.name==="DataCloneError"&&e.message&&e.message.includes("PerformanceServerTiming")){e.stopImmediatePropagation();e.preventDefault()}},true);'}} />
      </head>
      <body className="grain">
        <Providers>
          <SmoothScroll>
            <Nav />
            {children}
            <Footer />
          </SmoothScroll>
        </Providers>
      </body>
    </html>
  )
}