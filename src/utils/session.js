const DISMISSED_KEY = 'cf_instruction_dismissed'
const paletteKey = id => `cf_palette_${id}`
const slotKey = (id, i) => `cf_slot_${id}_${i}`

export function isInstructionDismissed() {
  try { return sessionStorage.getItem(DISMISSED_KEY) === '1' } catch { return false }
}
export function dismissInstruction() {
  try { sessionStorage.setItem(DISMISSED_KEY, '1') } catch {}
}

export function loadSession(templateId) {
  try {
    const raw = sessionStorage.getItem(paletteKey(templateId))
    return raw ? JSON.parse(raw) : null
  } catch { return null }
}

export function saveSession(templateId, data) {
  try { sessionStorage.setItem(paletteKey(templateId), JSON.stringify(data)) } catch {}
}

export function clearSession(templateId) {
  try {
    sessionStorage.removeItem(paletteKey(templateId))
    for (let i = 0; i < 3; i++) sessionStorage.removeItem(slotKey(templateId, i))
  } catch {}
}

export function loadAllSlots(templateId) {
  return [0, 1, 2].map(i => {
    try {
      const raw = sessionStorage.getItem(slotKey(templateId, i))
      return raw ? JSON.parse(raw) : null
    } catch { return null }
  })
}

export function saveSlotToSession(templateId, slotIndex, palette) {
  try { sessionStorage.setItem(slotKey(templateId, slotIndex), JSON.stringify(palette)) } catch {}
}
