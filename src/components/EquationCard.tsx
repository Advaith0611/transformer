import { BlockMath, InlineMath } from 'react-katex'
import type { ReactNode } from 'react'

export function Symbol({ latex, meaning }: { latex: string, meaning: string }) {
  return <abbr className="math-symbol" title={meaning}><InlineMath math={latex} /></abbr>
}

export function EquationCard({
  label,
  equation,
  children,
  accent = 'blue',
}: {
  label: string
  equation: string
  children?: ReactNode
  accent?: 'blue' | 'gold' | 'violet' | 'red'
}) {
  return (
    <section className={`equation-card ${accent}`}>
      <span className="eyebrow">{label}</span>
      <BlockMath math={equation} />
      {children && <div className="equation-detail">{children}</div>}
    </section>
  )
}

export function FormulaLine({ children }: { children: ReactNode }) {
  return <div className="formula-line">{children}</div>
}
