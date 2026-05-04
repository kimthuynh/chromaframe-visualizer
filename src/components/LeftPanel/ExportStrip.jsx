import { useState } from 'react'

function useCopy(getText) {
  const [done, setDone] = useState(false)
  function trigger() {
    try { navigator.clipboard.writeText(getText()).catch(() => {}) } catch {}
    setDone(true)
    setTimeout(() => setDone(false), 1500)
  }
  return [done, trigger]
}

export default function ExportStrip({ onShowCssModal }) {
  const [linkDone, triggerLink] = useCopy(() => window.location.href)

  return (
    <div className="export-strip">
      <button className="export-btn" onClick={onShowCssModal}>
        CSS Variables
      </button>
      <button
        className={`export-btn${linkDone ? ' export-btn--done' : ''}`}
        onClick={triggerLink}
      >
        {linkDone ? '✓ Copied' : 'Copy Link'}
      </button>
    </div>
  )
}
