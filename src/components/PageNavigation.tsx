import { Check, Circle } from 'lucide-react'
import { completeSection, sections, type SectionId } from '../data/syllabus'

export default function PageNavigation({ current, onSelect, collapsed }: { current: SectionId, onSelect: (id: SectionId) => void, collapsed?: boolean }) {
  const progressStep = current === 'complete' ? 8 : Math.max(1, sections.findIndex((item) => item.id === current) + 1)
  return (
    <nav className={`syllabus-nav ${collapsed ? 'nav-hidden' : ''}`} aria-label="Transformer syllabus sections">
      <div className="nav-heading">
        <span className="eyebrow">IGCSE PHYSICS</span>
        <strong>4.5.6 — The Transformer</strong>
      </div>
      <div className="nav-progress"><span style={{ width: `${(progressStep / 8) * 100}%` }} /></div>
      <div className="section-links">
        {sections.map((section) => {
          const active = section.id === current
          const done = sections.findIndex((item) => item.id === current) > sections.findIndex((item) => item.id === section.id)
          return (
            <button key={section.id} className={`nav-section ${active ? 'active' : ''}`} type="button" onClick={() => onSelect(section.id)}>
              {done ? <Check size={14} /> : <Circle size={13} />}<span><em>{section.index}</em>{section.nav}</span>
            </button>
          )
        })}
      </div>
      <button className={`nav-complete ${current === 'complete' ? 'active' : ''}`} type="button" onClick={() => onSelect(completeSection.id)}>
        <span>◎</span> Complete Transformer
      </button>
    </nav>
  )
}
