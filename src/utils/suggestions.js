import chroma from 'chroma-js'

const PRESETS = [
  { type: 'warm', label: 'Warm', hueShift: -22, satDelta: 0.08, lightDelta: 0.02 },
  { type: 'engaged', label: 'Engaged', hueShift: 18, satDelta: 0.14, lightDelta: -0.02 },
  { type: 'calm', label: 'Calm', hueShift: 42, satDelta: -0.12, lightDelta: 0.04 },
]

function shiftPrimary(primaryHex, { hueShift, satDelta, lightDelta }) {
  const base = chroma(primaryHex)
  const [h, s, l] = base.hsl()
  const newH = ((h ?? 0) + hueShift + 360) % 360
  const newS = Math.max(0.05, Math.min(0.95, (s ?? 0.5) + satDelta))
  const newL = Math.max(0.15, Math.min(0.8, (l ?? 0.5) + lightDelta))
  return chroma.hsl(newH, newS, newL)
}

function deriveSecondary(primary) {
  return primary.brighten(0.7).saturate(0.15)
}

function deriveAccent(primary) {
  const [h, s] = primary.hsl()
  return chroma.hsl(((h ?? 0) + 148) % 360, Math.min((s ?? 0.6) + 0.1, 0.9), 0.52)
}

function makeSwatches(primary) {
  return [
    primary.brighten(2.2).hex(),
    primary.brighten(1.1).hex(),
    primary.hex(),
    primary.darken(1.1).hex(),
    primary.darken(2.2).hex(),
  ]
}

export function buildSuggestions(primaryHex, schema) {
  return PRESETS.map(preset => {
    const newPrimary = shiftPrimary(primaryHex, preset)
    const patches = {}

    schema.forEach(entry => {
      if (entry.skipSuggestions || entry.semantic === 'neutral') return
      if (entry.id === '--cf-primary') patches[entry.id] = newPrimary.hex()
      else if (entry.id === '--cf-secondary') patches[entry.id] = deriveSecondary(newPrimary).hex()
      else if (entry.id === '--cf-accent') patches[entry.id] = deriveAccent(newPrimary).hex()
    })

    return {
      type: preset.type,
      label: preset.label,
      swatches: makeSwatches(newPrimary),
      patches,
    }
  })
}
