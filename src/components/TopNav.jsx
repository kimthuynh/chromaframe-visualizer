import './TopNav.css'

function LogoMark() {
  return (
    <svg className="top-nav-logo-mark" viewBox="0 0 24 24" fill="none" aria-hidden>
      {/* outer square — outline */}
      <rect x="2" y="2" width="14" height="14" rx="2" stroke="white" strokeWidth="1.5" fill="none" />
      {/* inner square — filled, offset bottom-right */}
      <rect x="8" y="8" width="14" height="14" rx="2" fill="white" />
    </svg>
  )
}

export default function TopNav({ templates, activeId, onSelect }) {
  return (
    <header className="top-nav">
      <div className="top-nav-brand">
        <LogoMark />
        <span className="top-nav-wordmark">Chroma Frame</span>
      </div>

      <nav className="top-nav-tabs" role="tablist">
        {templates.map(t => {
          const isDisabled = !!t.stub
          const isActive = t.id === activeId
          return (
            <button
              key={t.id}
              role="tab"
              aria-selected={isActive}
              aria-disabled={isDisabled}
              disabled={isDisabled}
              className={[
                'top-nav-tab',
                isActive && 'top-nav-tab--active',
                isDisabled && 'top-nav-tab--disabled',
              ]
                .filter(Boolean)
                .join(' ')}
              onClick={() => !isDisabled && onSelect(t.id)}
            >
              {t.label}
              {isDisabled && (
                <>
                  <span className="top-nav-soon">Soon</span>
                  <span className="tab-tooltip">Coming soon</span>
                </>
              )}
            </button>
          )
        })}
      </nav>
    </header>
  )
}
