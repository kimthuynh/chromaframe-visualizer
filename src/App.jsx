import { useState, useEffect, useCallback, lazy, Suspense } from 'react'
import chroma from 'chroma-js'
import { TEMPLATES, getTemplate } from './templates/index.js'
import { encodeHash, decodeHash } from './utils/hash.js'
import {
  isInstructionDismissed, dismissInstruction,
  loadSession, saveSession, clearSession,
} from './utils/session.js'
import TopNav from './components/TopNav.jsx'
import InstructionBar from './components/InstructionBar.jsx'
import LeftPanel from './components/LeftPanel/index.jsx'
import PreviewPane from './components/PreviewPane/index.jsx'
import CssExportModal from './components/CssExportModal.jsx'
import './App.css'

const LandingPreview = lazy(() => import('./templates/landing/Preview.jsx'))
const EcommercePreview = lazy(() => import('./templates/ecommerce/Preview.jsx'))

const PREVIEW_MAP = {
  landing: LandingPreview,
  ecommerce: EcommercePreview,
}

const ALL_CF_VARS = [
  '--cf-logo', '--cf-primary', '--cf-secondary', '--cf-accent',
  '--cf-bg', '--cf-surface', '--cf-filter-bg', '--cf-text', '--cf-text-muted',
  '--cf-primary-hover', '--cf-primary-light', '--cf-accent-hover', '--cf-tooltip-bg',
]

function buildDerivedVars(palette) {
  const derived = {}
  const p = palette['--cf-primary']
  const a = palette['--cf-accent']
  try {
    if (p) {
      derived['--cf-primary-hover'] = chroma(p).darken(0.7).hex()
      derived['--cf-primary-light'] = chroma(p).brighten(1.6).desaturate(0.4).hex()
      derived['--cf-tooltip-bg'] = chroma(p).darken(2.5).hex()
    }
    if (a) {
      derived['--cf-accent-hover'] = chroma(a).darken(0.7).hex()
    }
  } catch {}
  return derived
}

function applyVarsToRoot(palette, enabledOptionals, schema) {
  const root = document.documentElement
  const disabledIds = new Set(
    (schema ?? [])
      .filter(e => e.optional && enabledOptionals[e.id] === false)
      .map(e => e.id)
  )
  for (const id of ALL_CF_VARS) {
    if (disabledIds.has(id)) root.style.removeProperty(id)
  }
  const all = { ...palette, ...buildDerivedVars(palette) }
  for (const [k, v] of Object.entries(all)) {
    if (!disabledIds.has(k)) root.style.setProperty(k, v)
  }
}

function initState() {
  // URL hash wins (shared link)
  const parsed = decodeHash(window.location.hash)
  if (parsed && Object.keys(parsed.palette ?? {}).length > 0) {
    const t = getTemplate(parsed.templateId)
    if (t && !t.stub) {
      return {
        templateId: parsed.templateId,
        palette: { ...t.defaults, ...parsed.palette },
        enabledOptionals: {},
        mode: parsed.mode,
        style: parsed.style,
        activeTab: t.tabs[0].id,
      }
    }
  }
  // Fallback: sessionStorage
  const id = 'landing'
  const saved = loadSession(id)
  if (saved?.palette) {
    return { templateId: id, ...saved, enabledOptionals: {}, activeTab: getTemplate(id).tabs[0].id }
  }
  // Defaults
  const t = getTemplate(id)
  return {
    templateId: id,
    palette: { ...t.defaults },
    enabledOptionals: {},
    mode: t.defaultMode ?? 'dark',
    style: 'filled',
    activeTab: t.tabs[0].id,
  }
}

export default function App() {
  const [state, setState] = useState(initState)
  const { templateId, palette, enabledOptionals, mode, style, activeTab } = state
  const config = getTemplate(templateId)

  const [instructionVisible, setInstructionVisible] = useState(() => !isInstructionDismissed())
  const [cssModalOpen, setCssModalOpen] = useState(false)

  // Apply CSS vars to root
  useEffect(() => {
    applyVarsToRoot(palette, enabledOptionals, config.colorSchema)
  }, [palette, enabledOptionals, config.colorSchema])

  useEffect(() => {
    document.documentElement.setAttribute('data-mode', mode)
  }, [mode])

  useEffect(() => {
    document.documentElement.setAttribute('data-style', style)
  }, [style])

  // Persist to URL hash and sessionStorage on every state change
  useEffect(() => {
    window.history.replaceState(null, '', encodeHash({ templateId, palette, mode, style }))
    saveSession(templateId, { palette, mode, style })
  }, [templateId, palette, mode, style])

  const handleTemplateSelect = useCallback(id => {
    const t = getTemplate(id)
    if (!t || t.stub) return
    const saved = loadSession(id)
    setState(prev => ({
      ...prev,
      templateId: id,
      palette: saved?.palette ? { ...t.defaults, ...saved.palette } : { ...t.defaults },
      enabledOptionals: {},
      mode: saved?.mode ?? t.defaultMode ?? 'dark',
      style: saved?.style ?? prev.style,
      activeTab: t.tabs[0].id,
    }))
  }, [])

  const handlePaletteChange = useCallback(updater => {
    setState(prev => ({
      ...prev,
      palette: typeof updater === 'function' ? updater(prev.palette) : { ...prev.palette, ...updater },
    }))
  }, [])

  const handleModeChange = useCallback(newMode => {
    setState(prev => {
      const t = getTemplate(prev.templateId)
      const neutralDefaults = t.neutralDefaults?.[newMode] ?? {}
      return { ...prev, mode: newMode, palette: { ...prev.palette, ...neutralDefaults } }
    })
  }, [])

  const handleStyleChange = useCallback(s => setState(prev => ({ ...prev, style: s })), [])
  const handleTabChange = useCallback(tab => setState(prev => ({ ...prev, activeTab: tab })), [])
  const handleToggleOptional = useCallback((id, enabled) => {
    setState(prev => ({ ...prev, enabledOptionals: { ...prev.enabledOptionals, [id]: enabled } }))
  }, [])

  const handleReset = useCallback(() => {
    setState(prev => {
      const t = getTemplate(prev.templateId)
      clearSession(prev.templateId)
      return { ...prev, palette: { ...t.defaults }, mode: t.defaultMode ?? 'dark', style: 'filled', enabledOptionals: {} }
    })
  }, [])

  const handleDismissInstruction = useCallback(() => {
    dismissInstruction()
    setInstructionVisible(false)
  }, [])

  const PreviewComponent = PREVIEW_MAP[templateId]
  const bodyOffset = 52 + (instructionVisible ? 34 : 0)

  return (
    <div className="app-root">
      <TopNav templates={TEMPLATES} activeId={templateId} onSelect={handleTemplateSelect} />
      {instructionVisible && <InstructionBar onDismiss={handleDismissInstruction} />}

      <div className="app-body" style={{ marginTop: bodyOffset }}>
        <LeftPanel
          config={config}
          palette={palette}
          enabledOptionals={enabledOptionals}
          mode={mode}
          style={style}
          onPaletteChange={handlePaletteChange}
          onModeChange={handleModeChange}
          onStyleChange={handleStyleChange}
          onToggleOptional={handleToggleOptional}
          onReset={handleReset}
          onShowCssModal={() => setCssModalOpen(true)}
        />

        <PreviewPane config={config} activeTab={activeTab} onTabChange={handleTabChange}>
          <Suspense fallback={<div className="preview-loading">Loading…</div>}>
            {PreviewComponent && <PreviewComponent activeTab={activeTab} />}
          </Suspense>
        </PreviewPane>
      </div>

      <CssExportModal
        isOpen={cssModalOpen}
        onClose={() => setCssModalOpen(false)}
        palette={palette}
        config={config}
        enabledOptionals={enabledOptionals}
      />
    </div>
  )
}
