import { useState, useCallback, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Colorful } from '@uiw/react-color'
import { getSwatches } from '../../utils/swatches.js'

function isValidHex(str) {
  return /^#[0-9a-fA-F]{6}$/.test(str) || /^#[0-9a-fA-F]{3}$/.test(str)
}

function normalizeHex(raw) {
  const s = raw.trim().replace(/^#?/, '#').toUpperCase()
  if (/^#[0-9A-F]{3}$/.test(s))
    return '#' + s[1] + s[1] + s[2] + s[2] + s[3] + s[3]
  return s
}

function CopyIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
      <rect x="5" y="5" width="9" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M11 5V3.5A1.5 1.5 0 0 0 9.5 2h-6A1.5 1.5 0 0 0 2 3.5v6A1.5 1.5 0 0 0 3.5 11H5" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d="M3 8l4 4 6-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function ColorPickerPopup({ entryId, value, primaryHex, onChange, onClose, anchorRect }) {
  const popupRef = useRef(null)
  const swatches = getSwatches(entryId, primaryHex)

  const top = Math.min(anchorRect.top, window.innerHeight - 290)
  const left = anchorRect.right + 12

  useEffect(() => {
    function onMouse(e) {
      if (popupRef.current && !popupRef.current.contains(e.target)) onClose()
    }
    const tid = setTimeout(() => document.addEventListener('mousedown', onMouse), 0)
    return () => { clearTimeout(tid); document.removeEventListener('mousedown', onMouse) }
  }, [onClose])

  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  return createPortal(
    <div
      ref={popupRef}
      className="picker-popup"
      style={{ position: 'fixed', top, left, zIndex: 500 }}
    >
      <Colorful
        color={value}
        onChange={c => onChange(entryId, c.hex)}
        disableAlpha
        style={{ width: 220 }}
      />
      {swatches.length > 0 && (
        <div className="picker-swatches">
          {swatches.map(s => (
            <button
              key={s}
              className="picker-swatch"
              style={{ background: s }}
              onClick={() => onChange(entryId, s)}
              title={s.toUpperCase()}
              aria-label={s.toUpperCase()}
            />
          ))}
        </div>
      )}
    </div>,
    document.body
  )
}

export default function ColorRow({ entry, value, enabled, palette, onChange, onToggle, onCopyPrimary }) {
  const [hexDraft, setHexDraft] = useState(null)
  const [copied, setCopied] = useState(false)
  const [pickerOpen, setPickerOpen] = useState(false)
  const [anchorRect, setAnchorRect] = useState(null)
  const swatchBtnRef = useRef(null)

  const displayVal = value?.toUpperCase() ?? '#000000'
  const hexInput = hexDraft ?? displayVal
  const isDisabled = entry.optional && !enabled
  const primaryHex = palette['--cf-primary'] ?? '#1d2965'

  function openPicker() {
    if (isDisabled || !swatchBtnRef.current) return
    setAnchorRect(swatchBtnRef.current.getBoundingClientRect())
    setPickerOpen(true)
  }

  const handleHexInput = useCallback(e => setHexDraft(e.target.value), [])

  const handleHexBlur = useCallback(() => {
    if (hexDraft !== null) {
      const norm = normalizeHex(hexDraft)
      if (isValidHex(norm)) onChange(entry.id, norm.toLowerCase())
      setHexDraft(null)
    }
  }, [hexDraft, entry.id, onChange])

  const handleHexKey = useCallback(e => { if (e.key === 'Enter') e.target.blur() }, [])

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(displayVal).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }, [displayVal])

  return (
    <>
      <div className={`color-row${isDisabled ? ' color-row--disabled' : ''}`}>
        <div className="color-row-swatch-col">
          <button
            ref={swatchBtnRef}
            className="color-swatch-btn"
            style={{ background: value ?? '#000' }}
            onClick={openPicker}
            disabled={isDisabled}
            aria-label={`Open color picker for ${entry.label}`}
            aria-expanded={pickerOpen}
          />
        </div>

        <div className="color-row-body">
          <div className="color-row-top">
            <span className="color-row-label">{entry.label}</span>
            {entry.optional && (
              <label className="optional-check" title={enabled ? 'Disable' : 'Enable'}>
                <input
                  type="checkbox"
                  checked={!!enabled}
                  onChange={e => onToggle(entry.id, e.target.checked)}
                />
              </label>
            )}
          </div>

          {entry.weightHint && (
            <div className="color-row-hint">{entry.weightHint}</div>
          )}

          <div className="color-row-controls">
            <input
              type="text"
              value={hexInput}
              onChange={handleHexInput}
              onBlur={handleHexBlur}
              onKeyDown={handleHexKey}
              disabled={isDisabled}
              maxLength={7}
              spellCheck={false}
              className="hex-input"
              aria-label={`Hex for ${entry.label}`}
            />
            <button
              className={`copy-btn${copied ? ' copy-btn--done' : ''}`}
              onClick={handleCopy}
              disabled={isDisabled}
              title="Copy hex"
            >
              {copied ? <CheckIcon /> : <CopyIcon />}
            </button>
            {onCopyPrimary && (
              <button
                className="copy-primary-btn"
                onClick={onCopyPrimary}
                title="Use primary color"
                aria-label="Copy primary color to logo"
              >
                ← Primary
              </button>
            )}
          </div>
        </div>
      </div>

      {pickerOpen && anchorRect && (
        <ColorPickerPopup
          entryId={entry.id}
          value={value ?? '#000000'}
          primaryHex={primaryHex}
          onChange={onChange}
          onClose={() => setPickerOpen(false)}
          anchorRect={anchorRect}
        />
      )}
    </>
  )
}
