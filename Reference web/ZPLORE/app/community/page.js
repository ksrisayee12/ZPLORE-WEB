'use client'
import { useEffect, useRef } from 'react'
import Link from 'next/link'

const PROGRAMS = [
    { tag: 'Mentorship', title: 'Founder × engineer pairings.', body: 'Six-month structured mentorship with senior Zplore staff. Code reviews, architecture clinics, career roadmapping.', n: '01' },
    { tag: 'Training', title: 'Technical residencies.', body: 'Cohort-based deep dives: applied LLMs, secure systems, GPU programming. Live, project-led, no slides.', n: '02' },
    { tag: 'Hands-on', title: 'Build nights.', body: 'Weekly in-person and remote build sessions. Pick a problem, ship a working artifact by midnight.', n: '03' },
    { tag: 'Startup', title: 'Collaboration program.', body: 'Equity-light engineering partnership for pre-seed teams. We embed, you ship.', n: '04' },
    { tag: 'Research', title: 'Open research grants.', body: 'Quarterly grants for student & independent researchers. Compute, mentorship, publication support.', n: '05' },
    { tag: 'Hackathons', title: 'Z/Hack — 24h sprints.', body: 'Themed hackathons in security, agents, and inference. Cash prizes, hiring fast-tracks.', n: '06' },
    { tag: 'Workshops', title: 'Specialist masterclasses.', body: 'Half-day workshops led by domain leads. Past topics: vector retrieval, post-quantum crypto, RLHF.', n: '07' },
    { tag: 'Innovation', title: 'Builder grants.', body: 'No-strings grants for ambitious hardware/software hybrids by community members.', n: '08' },
    { tag: 'Events', title: 'Z/Convene.', body: 'Quarterly evening salons. Twenty-five seats, one topic, no recording.', n: '09' },
]

const EVENTS = [
    { date: 'Aug 14', name: 'Z/Hack — Agent Mesh', loc: 'Bengaluru' },
    { date: 'Aug 28', name: 'Masterclass: Inference at the Edge', loc: 'Virtual' },
    { date: 'Sep 06', name: 'Z/Convene No. 008', loc: 'Bengaluru' },
    { date: 'Sep 20', name: 'Residency Cohort 04 — Applications close', loc: 'Global' },
]

export default function CommunityPage() {
    const heroRef = useRef(null)
    const charsRef = useRef([])

    useEffect(() => {
        let cleanup
            ; (async () => {
                const { default: gsap } = await import('gsap')
                const { ScrollTrigger } = await import('gsap/ScrollTrigger')
                gsap.registerPlugin(ScrollTrigger)
                const ctx = gsap.context(() => {
                    gsap.fromTo(charsRef.current, { y: '120%', opacity: 0 }, { y: 0, opacity: 1, stagger: 0.02, duration: 1, ease: 'expo.out' })
                    gsap.utils.toArray('.cprog').forEach((el, i) => {
                        gsap.fromTo(el, { y: 60, opacity: 0 }, {
                            y: 0, opacity: 1, duration: 0.9, ease: 'expo.out',
                            scrollTrigger: { trigger: el, start: 'top 88%' }
                        })
                    })
                }, heroRef)
                cleanup = () => ctx.revert()
            })()
        return () => cleanup && cleanup()
    }, [])

    const title = 'A builder ecosystem.'

    return (
        <main className="relative bg-[#050505] text-white overflow-hidden">
            <section ref={heroRef} className="relative pt-[26vh] pb-32 md:pb-40">
                <div className="mx-auto max-w-[1400px] px-6 md:px-10">
                    <div className="flex items-center gap-3 mb-8 text-xs uppercase tracking-[0.3em] text-white/50">
                        <span className="w-8 h-px bg-white/40" /> Community · Programs
                    </div>
                    <h1 className="display text-[12vw] md:text-[7.5vw] leading-[0.92]">
                        <span className="inline-block overflow-hidden">
                            {title.split('').map((c, i) => (
                                <span key={i} ref={el => (charsRef.current[i] = el)} className="inline-block" style={{ whiteSpace: c === ' ' ? 'pre' : 'normal' }}>{c}</span>
                            ))}
                        </span>
                    </h1>
                    <div className="mt-10 grid md:grid-cols-12 gap-8">
                        <p className="md:col-span-6 text-lg text-white/60 max-w-xl leading-relaxed">
                            Zplore Community is where curious engineers, founders and researchers compound. Programs designed to put hands on keyboards, not bums on chairs.
                        </p>
                        <div className="md:col-span-5 md:col-start-8 grid grid-cols-3 gap-4">
                            {[['1.2k', 'Members'], ['320', 'Alumni'], ['64', 'Cities']].map(([k, v]) => (
                                <div key={k} className="border border-white/10 p-5">
                                    <div className="display text-3xl">{k}</div>
                                    <div className="text-[10px] uppercase tracking-[0.2em] text-white/40 mt-1">{v}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <section className="relative pb-32">
                <div className="mx-auto max-w-[1400px] px-6 md:px-10">
                    <div className="flex items-end justify-between mb-12">
                        <h2 className="display text-4xl md:text-6xl">Programs.</h2>
                        <div className="text-xs uppercase tracking-[0.3em] text-white/40">009 active</div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                        {PROGRAMS.map((p) => (
                            <article key={p.n} className="cprog group relative border border-white/10 bg-[#0a0a0a] p-7 md:p-8 min-h-[280px] flex flex-col justify-between overflow-hidden">
                                <div className="flex items-start justify-between">
                                    <div className="text-[10px] uppercase tracking-[0.3em] text-white/50">{p.tag}</div>
                                    <div className="display text-4xl text-white/15">{p.n}</div>
                                </div>
                                <div>
                                    <h3 className="display text-2xl md:text-3xl mt-10">{p.title}</h3>
                                    <p className="mt-3 text-sm text-white/55 leading-relaxed">{p.body}</p>
                                    <div className="mt-6 flex items-center gap-2 text-xs text-white/70">
                                        <span>Apply</span><span className="transition-transform group-hover:translate-x-1">→</span>
                                    </div>
                                </div>
                                <div className="absolute -bottom-32 -right-32 w-64 h-64 rounded-full bg-white/[0.03] blur-2xl group-hover:bg-white/[0.06] transition-colors duration-700" />
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            <section className="relative pb-32">
                <div className="mx-auto max-w-[1400px] px-6 md:px-10">
                    <div className="flex items-end justify-between mb-12">
                        <h2 className="display text-4xl md:text-6xl">Upcoming.</h2>
                        <Link href="#" className="text-sm underline-draw text-white/70">View calendar</Link>
                    </div>
                    <div className="border-t border-white/10">
                        {EVENTS.map((e) => (
                            <div key={e.name} className="group border-b border-white/10 grid grid-cols-12 items-center py-6 hover:bg-white/[0.02] transition-colors">
                                <div className="col-span-3 md:col-span-2 text-white/60 text-sm tracking-wider">{e.date}</div>
                                <div className="col-span-6 md:col-span-7 display text-xl md:text-2xl">{e.name}</div>
                                <div className="col-span-3 text-right text-white/50 text-xs uppercase tracking-[0.2em]">{e.loc}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="relative pb-40">
                <div className="mx-auto max-w-[1400px] px-6 md:px-10">
                    <div className="border border-white/10 p-12 md:p-20 flex flex-col md:flex-row items-start md:items-center justify-between gap-10">
                        <div>
                            <h3 className="display text-4xl md:text-6xl">Join the ecosystem.</h3>
                            <p className="text-white/55 mt-3 max-w-md">Applications are reviewed weekly. No fees, no pitch decks.</p>
                        </div>
                        <Link href="/#contact" className="group inline-flex items-center gap-3 border border-white/30 hover:border-white px-6 py-4 text-sm uppercase tracking-wider">
                            <span>Apply now</span><span className="transition-transform group-hover:translate-x-1">→</span>
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    )
}
