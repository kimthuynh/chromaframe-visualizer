import { useMemo } from 'react'
import { buildSuggestions } from '../../utils/suggestions.js'

export default function SuggestionStrip({ primaryHex, schema, onApply }) {
  const suggestions = useMemo(
    () => buildSuggestions(primaryHex, schema),
    [primaryHex, schema]
  )

  return (
    <div className="panel-section">
      <div className="panel-section-label">Tone Suggestions</div>
      <div className="suggestion-row">
        {suggestions.map(s => (
          <button
            key={s.type}
            className="suggestion-chip"
            onClick={() => onApply(s.patches)}
            title={`Apply ${s.label} tone`}
          >
            <div className="suggestion-swatches">
              {s.swatches.map((color, i) => (
                <span key={i} className="swatch-cell" style={{ background: color }} />
              ))}
            </div>
            <span className="suggestion-chip-label">{s.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
