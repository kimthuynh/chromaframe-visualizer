import ModeToggle from './ModeToggle.jsx'
import StyleToggle from './StyleToggle.jsx'
import ColorRow from './ColorRow.jsx'
import ResetButton from './ResetButton.jsx'
import PaletteSlots from './PaletteSlots.jsx'
import ExportStrip from './ExportStrip.jsx'
import './LeftPanel.css'

function groupSchema(schema) {
  const groups = []
  const seen = {}
  for (const entry of schema) {
    if (!seen[entry.group]) {
      seen[entry.group] = []
      groups.push({ name: entry.group, entries: seen[entry.group] })
    }
    seen[entry.group].push(entry)
  }
  return groups
}

export default function LeftPanel({
  config,
  palette,
  enabledOptionals,
  mode,
  style,
  onPaletteChange,
  onModeChange,
  onStyleChange,
  onToggleOptional,
  onReset,
  onShowCssModal,
}) {
  const groups = groupSchema(config.colorSchema)

  function handleColorChange(id, value) {
    onPaletteChange(prev => ({ ...prev, [id]: value }))
  }

  function handleRestore(savedPalette) {
    onPaletteChange(() => ({ ...savedPalette }))
  }

  return (
    <aside className="left-panel">
      <div className="left-panel-inner">
        <div className="panel-section panel-section--toggles">
          <ModeToggle mode={mode} onChange={onModeChange} />
          <StyleToggle style={style} onChange={onStyleChange} />
          <div className="reset-row">
            <ResetButton onConfirm={onReset} />
          </div>
        </div>

        <div className="panel-schema">
          {groups.map(g => (
            <div key={g.name} className="schema-group">
              <div className="schema-group-label">{g.name}</div>
              {g.entries.map(entry => (
                <ColorRow
                  key={entry.id}
                  entry={entry}
                  value={palette[entry.id]}
                  enabled={!entry.optional || enabledOptionals[entry.id] !== false}
                  palette={palette}
                  onChange={handleColorChange}
                  onToggle={onToggleOptional}
                  onCopyPrimary={
                    entry.id === '--cf-logo'
                      ? () => handleColorChange('--cf-logo', palette['--cf-primary'])
                      : null
                  }
                />
              ))}
            </div>
          ))}
        </div>

        <PaletteSlots
          templateId={config.id}
          palette={palette}
          onRestore={handleRestore}
        />

        <ExportStrip onShowCssModal={onShowCssModal} />
      </div>
    </aside>
  )
}
