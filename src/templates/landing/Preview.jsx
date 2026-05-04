import { useEffect, useRef } from 'react'
import './preview.css'

const FEATURES = [
  { title: 'Lightning Fast', desc: 'Ship products 3× faster with our automated workflow engine built for modern teams.' },
  { title: 'Always Secure', desc: 'Enterprise-grade security baked in from day one. SOC 2 Type II certified.' },
  { title: 'Scales With You', desc: 'From 5 users to 50,000. Automatic infrastructure that grows as you do.' },
]

const TESTIMONIALS = [
  { quote: 'This completely changed how our design team ships. We went from 3-week cycles to 4 days.', author: 'Sarah K.', role: 'Design Lead, Acme Corp' },
]

export default function LandingPreview({ activeTab }) {
  const heroRef = useRef(null)
  const featuresRef = useRef(null)
  const rootRef = useRef(null)

  useEffect(() => {
    if (activeTab === 'hero') {
      heroRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    } else if (activeTab === 'features') {
      featuresRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    } else {
      rootRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [activeTab])

  return (
    <div className="lp-root" ref={rootRef}>
      <nav className="lp-nav">
        <div className="lp-nav-inner">
          <span className="lp-logo cf-logo-text">Luminary</span>
          <div className="lp-nav-links">
            <a href="#" className="lp-nav-link">Product</a>
            <a href="#" className="lp-nav-link">Pricing</a>
            <a href="#" className="lp-nav-link">Blog</a>
          </div>
          <button className="cf-btn-primary lp-nav-cta">Get started free</button>
        </div>
      </nav>

      <section className="lp-hero" ref={heroRef}>
        <div className="lp-hero-inner">
          <div className="lp-hero-badge">Now in public beta</div>
          <h1 className="lp-hero-headline">
            Build products your<br />team will love
          </h1>
          <p className="lp-hero-sub">
            The modern platform for teams who move fast. Collaborate, ship, and iterate — all in one place.
          </p>
          <div className="lp-hero-actions">
            <button className="cf-btn-primary cf-btn-lg">Start for free</button>
            <button className="cf-btn-ghost cf-btn-lg">See how it works →</button>
          </div>
          <p className="lp-hero-note">No credit card required · Free for teams up to 5</p>
        </div>
        <div className="lp-hero-visual">
          <div className="lp-hero-card">
            <div className="lp-hero-card-bar">
              <span className="lp-dot" /><span className="lp-dot" /><span className="lp-dot" />
            </div>
            <div className="lp-hero-card-body">
              <div className="lp-skeleton lp-sk-title" />
              <div className="lp-skeleton lp-sk-line" />
              <div className="lp-skeleton lp-sk-line lp-sk-short" />
              <div className="lp-skeleton lp-sk-btn" />
            </div>
          </div>
        </div>
      </section>

      <section className="lp-features" ref={featuresRef}>
        <div className="lp-features-inner">
          <div className="lp-section-label">Why Luminary</div>
          <h2 className="lp-section-title">Everything your team needs</h2>
          <p className="lp-section-sub">No bloat. No fluff. Just the tools that help you ship.</p>
          <div className="lp-features-grid">
            {FEATURES.map(f => (
              <div className="lp-feature-card cf-card" key={f.title}>
                <div className="lp-feature-icon" />
                <h3 className="lp-feature-title">{f.title}</h3>
                <p className="lp-feature-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="lp-testimonial">
        <div className="lp-testimonial-inner">
          {TESTIMONIALS.map(t => (
            <blockquote className="lp-quote" key={t.author}>
              <p className="lp-quote-text">"{t.quote}"</p>
              <footer className="lp-quote-footer">
                <div className="lp-quote-avatar" />
                <div>
                  <div className="lp-quote-author">{t.author}</div>
                  <div className="lp-quote-role">{t.role}</div>
                </div>
              </footer>
            </blockquote>
          ))}
        </div>
      </section>

      <section className="lp-cta-band">
        <div className="lp-cta-band-inner">
          <h2 className="lp-cta-title">Ready to move faster?</h2>
          <p className="lp-cta-sub">Join 12,000+ teams already shipping with Luminary.</p>
          <button className="cf-btn-accent cf-btn-lg">Start free today</button>
        </div>
      </section>

      <footer className="lp-footer">
        <div className="lp-footer-inner">
          <span className="lp-logo cf-logo-text">Luminary</span>
          <div className="lp-footer-links">
            <a href="#" className="lp-footer-link">Privacy</a>
            <a href="#" className="lp-footer-link">Terms</a>
            <a href="#" className="lp-footer-link">Careers</a>
            <a href="#" className="lp-footer-link">Contact</a>
          </div>
          <p className="lp-footer-copy">© 2024 Luminary, Inc.</p>
        </div>
      </footer>
    </div>
  )
}
