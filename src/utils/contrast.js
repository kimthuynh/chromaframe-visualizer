import chroma from 'chroma-js'

export function contrastRatio(color1, color2) {
  try {
    return chroma.contrast(color1, color2)
  } catch {
    return 1
  }
}

export function contrastInfo(ratio) {
  const r = parseFloat(ratio.toFixed(2))
  if (r >= 7) return { level: 'AAA', variant: 'pass', label: `AAA ${r.toFixed(1)}:1` }
  if (r >= 4.5) return { level: 'AA', variant: 'pass', label: `AA ${r.toFixed(1)}:1` }
  if (r >= 3) return { level: 'AA*', variant: 'warn', label: `${r.toFixed(1)}:1` }
  return { level: 'Fail', variant: 'fail', label: `${r.toFixed(1)}:1` }
}

export function resolveContrastTarget(against, palette) {
  if (!against) return null
  if (against.startsWith('#')) return against
  return palette[against] ?? null
}
