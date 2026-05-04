export default function ModeToggle({ mode, onChange }) {
  return (
    <div className="toggle-group">
      <span className="toggle-label">Mode</span>
      <div className="segmented" role="group">
        {['light', 'dark'].map(m => (
          <button
            key={m}
            className={`seg-btn${mode === m ? ' seg-btn--active' : ''}`}
            onClick={() => onChange(m)}
            aria-pressed={mode === m}
          >
            {m === 'light' ? '☀ Light' : '☾ Dark'}
          </button>
        ))}
      </div>
    </div>
  )
}
