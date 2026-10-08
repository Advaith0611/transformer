import { useEffect, useMemo, useState } from 'react'
import { Box, ChevronLeft, ChevronRight, Eye, Maximize2, Minimize2, Orbit, Play, Presentation, RefreshCcw, Rotate3D, X } from 'lucide-react'
import Transformer, { type TransformerMode } from './components/Transformer3D/Transformer'
import PageNavigation from './components/PageNavigation'
import ConceptPanels from './components/ConceptPanels'
import InfoPanel from './components/InfoPanel'
import { completeSection, sections, type ComponentKey, type SectionId, type SyllabusSection } from './data/syllabus'

function webGlAvailable() {
  try {
    const canvas = document.createElement('canvas')
    return !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')))
  } catch {
    return false
  }
}

const componentDestinations: Record<ComponentKey, SectionId> = {
  core: 'construction',
  primary: 'primary-secondary',
  secondary: 'turns-ratio',
  input: 'transmission',
  output: 'transmission',
  field: 'operation',
}

const allSections = [...sections, completeSection]

export default function App() {
  const [intro, setIntro] = useState(true)
  const [loading, setLoading] = useState(true)
  const [currentId, setCurrentId] = useState<SectionId>('construction')
  const [mode, setMode] = useState<TransformerMode>('step-up')
  const [exploded, setExploded] = useState(false)
  const [xray, setXray] = useState(false)
  const [animate, setAnimate] = useState(false)
  const [selected, setSelected] = useState<ComponentKey | null>(null)
  const [hovered, setHovered] = useState<ComponentKey | null>(null)
  const [resetSignal, setResetSignal] = useState(0)
  const [presentation, setPresentation] = useState(false)
  const [hasWebGL] = useState(webGlAvailable)

  const section = useMemo<SyllabusSection>(() => allSections.find((item) => item.id === currentId) ?? sections[0], [currentId])
  const sectionIndex = allSections.findIndex((item) => item.id === currentId)

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 900)
    return () => window.clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!presentation) return
    setResetSignal((value) => value + 1)
    if (currentId === 'operation') { setXray(true); setAnimate(true) }
    if (currentId === 'construction') setExploded(true)
    if (currentId === 'primary-secondary' || currentId === 'transmission' || currentId === 'losses') setMode('step-up')
  }, [currentId, presentation])

  const navigate = (id: SectionId) => {
    setCurrentId(id)
    setSelected(null)
    setResetSignal((value) => value + 1)
  }

  const inspect = (component: ComponentKey) => {
    setSelected(component)
    setCurrentId(componentDestinations[component])
  }

  const transformerProps = {
    exploded,
    xray,
    animate,
    mode,
    resetSignal,
    selected,
    onSelect: inspect,
    onHover: setHovered,
  }

  if (!hasWebGL) {
    return <main className="webgl-fallback"><div className="fallback-transformer"><Box size={56} /><span>WEBGL UNAVAILABLE</span></div><h1>This lab needs WebGL to display its interactive 3D transformer.</h1><p>Please enable hardware acceleration or open the lab in a current browser, then reload.</p></main>
  }

  if (intro) {
    return (
      <main className="intro-screen">
        <Transformer {...transformerProps} className="intro-canvas" />
        <div className="intro-vignette" />
        {loading && <div className="loading-pill"><span /> Initialising laboratory</div>}
        <section className="intro-content">
          <span className="intro-kicker">IGCSE PHYSICS · 4.5.6</span>
          <h1>THE<br /><i>TRANSFORMER</i></h1>
          <p>Explore how electrical energy is transformed.</p>
          <button type="button" onClick={() => setIntro(false)}>START EXPLORING <ChevronRight size={19} /></button>
          <small>Rotate, zoom and inspect the 3D transformer</small>
        </section>
      </main>
    )
  }

  return (
    <main className={`lab-shell ${presentation ? 'presentation-mode' : ''}`}>
      <Transformer {...transformerProps} className="lab-canvas" />
      <div className="lab-grid" aria-hidden="true" />
      <header className="topbar">
        <button className="brand" type="button" onClick={() => navigate('construction')} aria-label="Return to construction section"><span className="brand-mark">T</span><span>TRANSFORMER <i>LAB</i></span></button>
        <div className="topbar-status"><span className="pulse-dot" /> LIVE MODEL <span className="divider" /> {mode === 'step-up' ? 'STEP-UP CONFIGURATION' : 'STEP-DOWN CONFIGURATION'}</div>
        <div className="topbar-actions">
          <button className="top-icon" type="button" onClick={() => setPresentation(!presentation)} title="Toggle presentation mode" aria-label="Toggle presentation mode"><Presentation size={17} /> <span>{presentation ? 'Exit presentation' : 'Present'}</span></button>
          {!presentation && <button className="top-icon" type="button" onClick={() => setIntro(true)} title="Return to welcome screen" aria-label="Return to welcome screen"><X size={17} /></button>}
        </div>
      </header>

      <PageNavigation current={currentId} onSelect={navigate} collapsed={presentation} />

      <section className="content-panel" aria-live="polite">
        <div className="section-masthead">
          <span className="eyebrow">{section.syllabus}</span>
          <span className="mission-label">MISSION {Math.min(section.index, 8)}/8 · {section.mission}</span>
        </div>
        <h1><span>{section.index < 9 ? `${section.index} — ` : ''}</span>{section.title}</h1>
        <ConceptPanels
          section={section}
          mode={mode}
          setMode={setMode}
          exploded={exploded}
          setExploded={setExploded}
          xray={xray}
          setXray={setXray}
          animate={animate}
          setAnimate={setAnimate}
        />
      </section>

      {selected && !presentation && <InfoPanel component={selected} onClose={() => setSelected(null)} />}
      {hovered && !selected && !presentation && <div className="hover-tag">Click to inspect: {hovered === 'field' ? 'magnetic field' : hovered}</div>}

      {!presentation && <div className="scene-controls" role="group" aria-label="3D model controls">
        <button className={exploded ? 'active' : ''} type="button" onClick={() => setExploded(!exploded)}><Box size={16} /><span>Explode</span></button>
        <button className={xray ? 'active' : ''} type="button" onClick={() => setXray(!xray)}><Eye size={16} /><span>X-ray</span></button>
        <button className={animate ? 'active' : ''} type="button" onClick={() => setAnimate(!animate)}><Play size={16} /><span>Animate</span></button>
        <button type="button" onClick={() => setResetSignal((value) => value + 1)}><RefreshCcw size={16} /><span>Reset view</span></button>
      </div>}

      {!presentation && <div className="orbit-tip"><Orbit size={16} /><span>Drag to orbit · Scroll to zoom · Right-drag to pan</span></div>}

      {presentation && <div className="present-controls"><button type="button" disabled={sectionIndex === 0} onClick={() => navigate(allSections[Math.max(0, sectionIndex - 1)].id)}><ChevronLeft /> Previous</button><span><Maximize2 size={15} /> PRESENTATION MODE</span><button type="button" disabled={sectionIndex === allSections.length - 1} onClick={() => navigate(allSections[Math.min(allSections.length - 1, sectionIndex + 1)].id)}>Next <ChevronRight /></button></div>}

      {loading && <div className="scene-loading"><span /> Loading interactive laboratory…</div>}
    </main>
  )
}
