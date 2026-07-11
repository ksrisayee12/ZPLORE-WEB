'use client';

import { useRef, useState } from 'react';

/**
 * Contact Section — reconstructed from reference DOM patterns.
 * Minimalist form: name, email, project description.
 * Matches the brand: borderless inputs with bottom-border only,
 * white on dark, no card/box styling.
 */

export default function Contact() {
  const formRef = useRef(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulated submit (no backend in reconstruction)
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1200);
  };

  return (
    <section
      id="contact"
      className="relative w-full bg-[#050505] py-32 md:py-44 overflow-hidden"
    >
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="grid md:grid-cols-12 gap-12 md:gap-16">
          {/* Left — heading */}
          <div className="md:col-span-5">
            <div className="text-xs uppercase tracking-[0.3em] text-white/40 mb-6">
              Contact
            </div>
            <h2 className="display text-5xl md:text-7xl mb-8 leading-[0.95]">
              Start a project.
            </h2>
            <p className="text-white/60 text-xl leading-relaxed max-w-md text-base md:text-xl">
              Tell us about your problem. We will respond within 48 hours with a
              brief diagnostic and a proposed engagement model.
            </p>

            <div className="mt-12 space-y-4 text-white/40 text-lg">
              <div className="flex items-center gap-3">
                <span className="w-1.5 h-1.5 bg-white/40 rounded-full" />
                studio@zplore.dev
              </div>
              <div className="flex items-center gap-3">
                <span className="w-1.5 h-1.5 bg-white/40 rounded-full" />
                Bengaluru · Remote-first
              </div>
            </div>
          </div>

          {/* Right — form */}
          <div className="md:col-span-6 md:col-start-7">
            {submitted ? (
              <div className="flex flex-col items-start justify-center h-full py-16">
                <div className="font-nohemi text-5xl text-white/90 mb-4">
                  Received.
                </div>
                <p className="text-white/50 text-base font-satoshi text-lg">
                  We will be in touch within 48 hours.
                </p>
              </div>
            ) : (
              <form
                ref={formRef}
                onSubmit={handleSubmit}
                className="space-y-10"
              >
                <div>
                  <label className="text-xs uppercase tracking-[0.3em] text-white/40 block mb-3 font-hk-grotesk text-sm font-epilogue">
                    Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Your full name"
                    className="w-full bg-transparent border-none border-b border-white/20 focus:border-white focus:outline-none py-3 text-white text-base placeholder:text-white/30 font-epilogue"
                  />
                </div>

                <div>
                  <label className="text-xs uppercase tracking-[0.3em] text-white/40 block mb-3 font-hk-grotesk text-sm font-epilogue">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="your@email.com"
                    className="w-full bg-transparent border-none border-b border-white/20 focus:border-white focus:outline-none py-3 text-white text-base placeholder:text-white/30 font-epilogue"
                  />
                </div>

                <div>
                  <label className="text-xs uppercase tracking-[0.3em] text-white/40 block mb-3 font-hk-grotesk text-sm font-epilogue">
                    Company
                  </label>
                  <input
                    type="text"
                    placeholder="Your company or organisation"
                    className="w-full bg-transparent border-none border-b border-white/20 focus:border-white focus:outline-none py-3 text-white text-base placeholder:text-white/30 font-epilogue"
                  />
                </div>

                <div>
                  <label className="text-xs uppercase tracking-[0.3em] text-white/40 block mb-3">
                    Project brief
                  </label>
                  <textarea
                    required
                    placeholder="Describe the problem you are trying to solve..."
                    rows={4}
                    className="w-full bg-transparent border-none border-b border-white/20 focus:border-white focus:outline-none py-3 text-white text-base placeholder:text-white/30 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="group inline-flex items-center gap-3 border border-white/20 hover:border-white/50 px-6 py-3.5 text-sm text-white transition-all disabled:opacity-50"
                >
                  <span>{loading ? 'Sending…' : 'Send brief'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}