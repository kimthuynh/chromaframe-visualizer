import chroma from 'chroma-js'

function safe(hex) {
  try { return chroma(hex).hex() } catch { return hex }
}

export function buildCssBlock(palette, config, enabledOptionals = {}) {
  const lines = [':root {']

  for (const entry of config.colorSchema) {
    if (entry.optional && enabledOptionals[entry.id] === false) continue
    const val = palette[entry.id]
    if (val) lines.push(`  ${entry.id}: ${safe(val)};`)
  }

  const p = palette['--cf-primary']
  const a = palette['--cf-accent']

  if (p) {
    lines.push(`  --cf-primary-hover: ${chroma(p).darken(0.7).hex()};`)
    lines.push(`  --cf-primary-light: ${chroma(p).brighten(1.6).desaturate(0.4).hex()};`)
  }
  if (a) {
    lines.push(`  --cf-accent-hover: ${chroma(a).darken(0.7).hex()};`)
  }

  lines.push('}')
  return lines.join('\n')
}
