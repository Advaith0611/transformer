import { X } from 'lucide-react'
import { componentInfo, type ComponentKey } from '../data/syllabus'

export default function InfoPanel({ component, onClose }: { component: ComponentKey, onClose: () => void }) {
  const info = componentInfo[component]
  return (
    <aside className="component-panel" role="status">
      <div className="panel-topline"><span className="live-dot" /> INSPECTING COMPONENT</div>
      <button className="icon-button" type="button" aria-label="Close component information" onClick={onClose}><X size={17} /></button>
      <h3>{info.title}</h3>
      <p>{info.text}</p>
      <span className="panel-hint">Click another glowing part in the model to inspect it.</span>
    </aside>
  )
}
