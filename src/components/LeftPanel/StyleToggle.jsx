export default function StyleToggle({ style, onChange }) {
  return (
    <div className="toggle-group">
      <span className="toggle-label">Style</span>
      <div className="segmented" role="group">
        {['filled', 'border'].map(s => (
          <button
            key={s}
            className={`seg-btn${style === s ? ' seg-btn--active' : ''}`}
            onClick={() => onChange(s)}
            aria-pressed={style === s}
          >
            {s === 'filled' ? '▪ Filled' : '▫ Border'}
          </button>
        ))}
      </div>
    </div>
  )
}
