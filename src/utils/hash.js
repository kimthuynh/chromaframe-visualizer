export function encodeHash({ templateId, palette, mode, style }) {
  const p = new URLSearchParams()
  p.set('t', templateId)
  p.set('m', mode)
  p.set('s', style)
  for (const [k, v] of Object.entries(palette)) {
    p.set(k.replace('--cf-', ''), v.replace('#', ''))
  }
  return '#' + p.toString()
}

export function decodeHash(hash) {
  if (!hash || hash.length <= 1) return null
  try {
    const p = new URLSearchParams(hash.slice(1))
    if (!p.has('t')) return null

    const palette = {}
    p.forEach((v, k) => {
      if (!['t', 'm', 's'].includes(k)) {
        palette[`--cf-${k}`] = `#${v}`
      }
    })

    return {
      templateId: p.get('t'),
      mode: p.get('m') || 'light',
      style: p.get('s') || 'filled',
      palette,
    }
  } catch {
    return null
  }
}
