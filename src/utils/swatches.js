import chroma from 'chroma-js'

const LOGO_SWATCHES = ['#0d1b2a', '#1a1a2e', '#1a2e1a', '#2d1b1b', '#1c1209']

export function getSwatches(entryId, primaryHex) {
  try {
    const primary = chroma(primaryHex)
    const [h, s, l] = primary.hsl()
    const H = h ?? 0
    const S = s ?? 0.5
    const L = l ?? 0.5
    const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v))

    switch (entryId) {
      case '--cf-secondary':
        return [
          primary.saturate(0.6).hex(),
          primary.brighten(0.8).hex(),
          primary.brighten(1.5).desaturate(0.5).hex(),
          chroma.hsl((H - 30 + 360) % 360, S, L).hex(),
          chroma.hsl((H + 30) % 360, S, L).hex(),
        ]

      case '--cf-surface':
        return [
          chroma.hsl(H, 0.08, 0.96).hex(),
          chroma.hsl(H, 0.12, 0.88).hex(),
          chroma.hsl(H, 0.18, 0.72).hex(),
          chroma.hsl(H, 0.25, 0.14).hex(),
          chroma.hsl(H, 0.30, 0.07).hex(),
        ]

      case '--cf-accent': {
        const comp = (H + 180) % 360
        return [
          chroma.hsl(comp, clamp(S + 0.1, 0, 0.95), clamp(L, 0.4, 0.7)).hex(),
          chroma.hsl((comp - 30 + 360) % 360, S, clamp(L, 0.4, 0.7)).hex(),
          chroma.hsl((comp + 30) % 360, S, clamp(L, 0.4, 0.7)).hex(),
          chroma.hsl((H + 120) % 360, S, clamp(L, 0.4, 0.7)).hex(),
          chroma.hsl((H - 20 + 360) % 360, clamp(S + 0.1, 0, 0.9), clamp(L, 0.4, 0.7)).hex(),
        ]
      }

      case '--cf-logo':
        return LOGO_SWATCHES

      default:
        return [
          chroma.hsl(H, S * 0.3, 0.95).hex(),
          chroma.hsl(H, S * 0.5, 0.78).hex(),
          primary.hex(),
          chroma.hsl(H, S, 0.22).hex(),
          chroma.hsl(H, S * 0.7, 0.07).hex(),
        ]
    }
  } catch {
    return []
  }
}
