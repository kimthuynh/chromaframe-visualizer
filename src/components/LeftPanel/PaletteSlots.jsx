import { useState, useEffect } from 'react'
import { loadAllSlots, saveSlotToSession } from '../../utils/session.js'

function SlotPreview({ palette }) {
  const ids = ['--cf-primary', '--cf-accent', '--cf-bg', '--cf-text']
  return (
    <div className="slot-dots">
      {ids.map(id => palette[id] && (
        <span key={id} className="slot-dot" style={{ background: palette[id] }} />
      ))}
    </div>
  )
}

export default function PaletteSlots({ templateId, palette, onRestore }) {
  const [slots, setSlots] = useState(() => loadAllSlots(templateId))

  useEffect(() => {
    setSlots(loadAllSlots(templateId))
  }, [templateId])

  function handleSave(i) {
    const snap = { ...palette }
    saveSlotToSession(templateId, i, snap)
    setSlots(prev => { const next = [...prev]; next[i] = snap; return next })
  }

  return (
    <div className="panel-section palette-slots-section">
      <div className="panel-section-label">Saved Palettes</div>
      {[0, 1, 2].map(i => (
        <div key={i} className="palette-slot">
          <div className="slot-info">
            {slots[i]
              ? <SlotPreview palette={slots[i]} />
              : <span className="slot-empty">Slot {i + 1}</span>
            }
          </div>
          <div className="slot-btns">
            <button className="slot-btn slot-save" onClick={() => handleSave(i)} title="Save current palette">Save</button>
            <button className="slot-btn slot-load" onClick={() => slots[i] && onRestore(slots[i])} disabled={!slots[i]} title="Restore palette">Load</button>
          </div>
        </div>
      ))}
    </div>
  )
}
