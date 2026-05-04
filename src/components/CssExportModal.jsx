import { useState, useEffect, useCallback, useRef } from 'react'
import { createPortal } from 'react-dom'
import { buildCssBlock } from '../utils/cssExport.js'
import './CssExportModal.css'

export default function CssExportModal({ isOpen, onClose, palette, config, enabledOptionals }) {
  const [copied, setCopied] = useState(false)
  const overlayRef = useRef(null)
  const cssText = isOpen ? buildCssBlock(palette, config, enabledOptionals) : ''

  useEffect(() => {
    if (!isOpen) { setCopied(false); return }
    function onKey(e) { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [isOpen, onClose])

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(cssText).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }, [cssText])

  function handleOverlayClick(e) {
    if (e.target === overlayRef.current) onClose()
  }

  if (!isOpen) return null

  return createPortal(
    <div className="modal-overlay" ref={overlayRef} onClick={handleOverlayClick}>
      <div className="modal-box" role="dialog" aria-modal="true" aria-label="CSS Variables">
        <div className="modal-header">
          <span className="modal-title">CSS Variables</span>
          <button className="modal-close" onClick={onClose} aria-label="Close">✕</button>
        </div>
        <pre className="modal-css"><code>{cssText}</code></pre>
        <div className="modal-footer">
          <button className={`modal-copy-btn${copied ? ' modal-copy-btn--done' : ''}`} onClick={handleCopy}>
            {copied ? '✓ Copied' : 'Copy to clipboard'}
          </button>
        </div>
      </div>
    </div>,
    document.body
  )
}
