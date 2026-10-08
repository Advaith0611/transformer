import { useMemo, useState } from 'react'
import { BlockMath, InlineMath } from 'react-katex'
import { ArrowRight, Bolt, Factory, Home, Minus, Plus, RadioTower, RotateCcw, Thermometer, Waves } from 'lucide-react'
import { EquationCard, FormulaLine, Symbol } from './EquationCard'
import type { SectionId, SyllabusSection } from '../data/syllabus'
import type { TransformerMode } from './Transformer3D/Transformer'

type Shared = {
  section: SyllabusSection
  mode: TransformerMode
  setMode: (mode: TransformerMode) => void
  exploded: boolean
  setExploded: (value: boolean) => void
  xray: boolean
  setXray: (value: boolean) => void
  animate: boolean
  setAnimate: (value: boolean) => void
}

function NumberField({ label, value, min, max, step = 1, onChange, unit }: {
  label: string, value: number, min: number, max: number, step?: number, onChange: (value: number) => void, unit?: string
}) {
  return (
    <label className="number-field">
      <span>{label}</span>
      <div><input type="number" value={value} min={min} max={max} step={step} onChange={(event) => onChange(Math.max(min, Math.min(max, Number(event.target.value) || min)))} /><small>{unit}</small></div>
    </label>
  )
}

function RangeControl({ label, value, min, max, step, onChange, unit }: {
  label: string, value: number, min: number, max: number, step: number, onChange: (value: number) => void, unit: string
}) {
  return <label className="range-control"><span>{label}<b>{value.toLocaleString()} {unit}</b></span><input type="range" value={value} min={min} max={max} step={step} onChange={(e) => onChange(Number(e.target.value))} /></label>
}

function Construction({ setExploded, exploded, setXray, xray }: Shared) {
  return <>
    <p className="lead">A simple transformer has two coils wound around a <strong>soft-iron core</strong>. The coils are connected by a changing magnetic field, not by a direct electrical connection.</p>
    <div className="action-row">
      <button className={`control-button ${exploded ? 'active' : ''}`} onClick={() => setExploded(!exploded)} type="button"><RotateCcw size={16} /> {exploded ? 'Assemble model' : 'Exploded view'}</button>
      <button className={`control-button ${xray ? 'active' : ''}`} onClick={() => setXray(!xray)} type="button"><Waves size={16} /> {xray ? 'Solid view' : 'X-ray view'}</button>
    </div>
    <div className="insight-stack">
      <article><span className="component-chip steel">01</span><div><h3>Soft-iron core</h3><p>The changing magnetic field passes through the soft-iron core.</p></div></article>
      <article><span className="component-chip cyan">02</span><div><h3>Primary coil</h3><p>The coil connected to the input supply.</p></div></article>
      <article><span className="component-chip amber">03</span><div><h3>Secondary coil</h3><p>The coil in which the output voltage is induced.</p></div></article>
    </div>
    <p className="micro-note">Try clicking the glowing coils, core or terminals in the 3D model.</p>
  </>
}

function PrimarySecondary({ mode, setMode }: Shared) {
  const stepUp = mode === 'step-up'
  return <>
    <p className="lead">The <strong>primary</strong> is connected to the input. The <strong>secondary</strong> provides the output. The number of turns decides whether the voltage goes up or down.</p>
    <div className="mode-switch" role="group" aria-label="Transformer configuration">
      <button type="button" className={stepUp ? 'active' : ''} onClick={() => setMode('step-up')}>STEP-UP</button>
      <button type="button" className={!stepUp ? 'active' : ''} onClick={() => setMode('step-down')}>STEP-DOWN</button>
    </div>
    <div className={`turns-compare ${stepUp ? 'up' : 'down'}`}>
      <div className="turns-box primary"><span>INPUT / PRIMARY</span><strong>{stepUp ? 6 : 12}</strong><small>visible turns</small></div>
      <ArrowRight size={22} className="turn-arrow" />
      <div className="turns-box secondary"><span>OUTPUT / SECONDARY</span><strong>{stepUp ? 12 : 6}</strong><small>visible turns</small></div>
    </div>
    <div className="callout"><Bolt size={17} /><span>{stepUp ? 'Step-up: more secondary turns means output voltage is greater than input voltage.' : 'Step-down: fewer secondary turns means output voltage is less than input voltage.'}</span></div>
  </>
}

function TurnsRatio({ mode, setMode }: Shared) {
  const [np, setNp] = useState(100)
  const [ns, setNs] = useState(500)
  const [vp, setVp] = useState(20)
  const vs = useMemo(() => vp * ns / np, [vp, ns, np])
  return <>
    <p className="lead">The voltage ratio is the same as the turns ratio. Adjust the values and watch the induced secondary voltage change.</p>
    <div className="mode-switch compact"><button type="button" className={mode === 'step-up' ? 'active' : ''} onClick={() => { setMode('step-up'); setNp(100); setNs(500) }}>STEP-UP</button><button type="button" className={mode === 'step-down' ? 'active' : ''} onClick={() => { setMode('step-down'); setNp(500); setNs(100) }}>STEP-DOWN</button></div>
    <EquationCard label="TRANSFORMER EQUATION" equation="\\frac{V_p}{V_s}=\\frac{N_p}{N_s}" accent="violet">
      <p><Symbol latex="V_p" meaning="primary voltage" /> primary voltage · <Symbol latex="V_s" meaning="secondary voltage" /> secondary voltage<br /><Symbol latex="N_p" meaning="number of primary coil turns" /> primary turns · <Symbol latex="N_s" meaning="number of secondary coil turns" /> secondary turns</p>
    </EquationCard>
    <div className="calculator-grid">
      <NumberField label="Primary turns, Np" value={np} min={10} max={1000} onChange={setNp} />
      <NumberField label="Secondary turns, Ns" value={ns} min={10} max={1000} onChange={setNs} />
      <NumberField label="Primary voltage, Vp" value={vp} min={1} max={1000} onChange={setVp} unit="V" />
    </div>
    <div className="answer-band"><span>Calculated secondary voltage</span><strong>{vs.toFixed(vs % 1 === 0 ? 0 : 1)} V</strong></div>
    <FormulaLine><InlineMath math={`\\frac{${vp}}{V_s}=\\frac{${np}}{${ns}}`} /><ArrowRight size={15} /><InlineMath math={`V_s = ${vs.toFixed(1)}\\,\\mathrm{V}`} /></FormulaLine>
    <p className="micro-note">More secondary turns → greater secondary voltage. Fewer secondary turns → lower secondary voltage.</p>
  </>
}

const transmissionInfo: Record<string, string> = {
  station: 'The power station produces electricity.',
  stepup: 'A step-up transformer increases the voltage before long-distance transmission.',
  cables: 'High-voltage cables carry electricity over long distances.',
  stepdown: 'A step-down transformer reduces the voltage before electricity reaches consumers.',
  homes: 'Homes receive electricity after the voltage has been reduced.',
}

function Transmission() {
  const [stage, setStage] = useState('stepup')
  return <>
    <p className="lead">Transformers change the voltage at useful points in the electricity transmission system.</p>
    <div className="transmission-map" aria-label="Electricity transmission route">
      <button onClick={() => setStage('station')} className={stage === 'station' ? 'selected' : ''} type="button"><Factory /><span>Power station</span></button><i><Bolt /></i>
      <button onClick={() => setStage('stepup')} className={stage === 'stepup' ? 'selected' : ''} type="button"><Plus /><span>Step-up</span></button><i><RadioTower /></i>
      <button onClick={() => setStage('cables')} className={stage === 'cables' ? 'selected' : ''} type="button"><Waves /><span>HV cables</span></button><i><Bolt /></i>
      <button onClick={() => setStage('stepdown')} className={stage === 'stepdown' ? 'selected' : ''} type="button"><Minus /><span>Step-down</span></button><i><Home /></i>
      <button onClick={() => setStage('homes')} className={stage === 'homes' ? 'selected' : ''} type="button"><Home /><span>Homes</span></button>
    </div>
    <div className="stage-readout"><span>SELECTED STAGE</span><strong>{transmissionInfo[stage]}</strong></div>
    <div className="dual-fact"><div><b>Before transmission</b><span>Step-up transformer increases voltage.</span></div><div><b>Before consumers</b><span>Step-down transformer reduces voltage.</span></div></div>
  </>
}

function Advantages() {
  const [high, setHigh] = useState(true)
  const power = 10000
  const voltage = high ? 2000 : 250
  const current = power / voltage
  return <>
    <p className="lead">For the same transmitted power, increasing voltage makes the current smaller.</p>
    <div className="voltage-toggle"><button className={!high ? 'active' : ''} onClick={() => setHigh(false)} type="button">LOW VOLTAGE</button><button className={high ? 'active' : ''} onClick={() => setHigh(true)} type="button">HIGH VOLTAGE</button></div>
    <EquationCard label="POWER RELATIONSHIP" equation="P=VI" accent="blue"><p>For the same power, <InlineMath math="I=\\frac{P}{V}" />. A greater <Symbol latex="V" meaning="voltage" /> gives a smaller <Symbol latex="I" meaning="current" />.</p></EquationCard>
    <div className="cable-comparison"><div className={`cable-track ${high ? 'quiet' : 'hot'}`}><div className="cable-glow" /><span>{high ? 'High voltage cable' : 'Low voltage cable'}</span><strong>{voltage.toLocaleString()} V</strong></div><div className="current-readout"><b>{power.toLocaleString()} W</b><span>transmitted power</span><strong>{current.toFixed(1)} A</strong><span>current</span></div></div>
    <div className="callout"><Bolt size={17} /><span>High-voltage transmission has a lower current. This reduces energy wasted as heating in cables.</span></div>
  </>
}

function Operation({ animate, setAnimate, setXray }: Shared) {
  return <>
    <p className="lead">The coils are electrically separate. Energy is transferred by a changing magnetic field in the soft-iron core.</p>
    <button className={`play-transformer ${animate ? 'playing' : ''}`} type="button" onClick={() => { setAnimate(!animate); setXray(true) }}><span className="play-dot" />{animate ? 'PAUSE TRANSFORMER' : 'PLAY TRANSFORMER'}</button>
    <ol className={`operation-steps ${animate ? 'running' : ''}`}>
      <li><span>1</span><div><b>AC in</b><p>Alternating current enters the primary coil.</p></div></li>
      <li><span>2</span><div><b>Changing magnetic field</b><p>The current produces a changing magnetic field in the iron core.</p></div></li>
      <li><span>3</span><div><b>Induced voltage</b><p>The changing field reaches the secondary coil and induces an output voltage.</p></div></li>
    </ol>
    <div className="flow-caption">AC in <ArrowRight size={15} /> changing magnetic field <ArrowRight size={15} /> AC out</div>
    <p className="micro-note">The moving dots and field loop are a visual model of the changing effects, not a picture of individual particles.</p>
  </>
}

function Efficiency() {
  const [vp, setVp] = useState(20)
  const [ip, setIp] = useState(2)
  const [vs, setVs] = useState(80)
  const inputPower = vp * ip
  const outputCurrent = inputPower / vs
  return <>
    <p className="lead">For a 100% efficient (ideal) transformer, input electrical power equals output electrical power.</p>
    <EquationCard label="100% EFFICIENCY" equation="I_pV_p=I_sV_s" accent="gold"><p><Symbol latex="I_p" meaning="primary current" /> primary current · <Symbol latex="V_p" meaning="primary voltage" /><br /><Symbol latex="I_s" meaning="secondary current" /> secondary current · <Symbol latex="V_s" meaning="secondary voltage" /></p></EquationCard>
    <div className="calculator-grid three"><NumberField label="Primary voltage, Vp" value={vp} min={1} max={1000} onChange={setVp} unit="V" /><NumberField label="Primary current, Ip" value={ip} min={0.1} max={100} step={0.1} onChange={setIp} unit="A" /><NumberField label="Secondary voltage, Vs" value={vs} min={1} max={1000} onChange={setVs} unit="V" /></div>
    <div className="power-flow"><div><span>INPUT POWER</span><b>{inputPower.toFixed(1)} W</b><small>{ip} A × {vp} V</small></div><ArrowRight /><div><span>OUTPUT POWER</span><b>{inputPower.toFixed(1)} W</b><small>{outputCurrent.toFixed(2)} A × {vs} V</small></div></div>
    <div className="answer-band"><span>Secondary current, Is</span><strong>{outputCurrent.toFixed(2)} A</strong></div>
  </>
}

function Losses() {
  const [voltage, setVoltage] = useState(500)
  const [resistance, setResistance] = useState(0.5)
  const power = 10000
  const current = power / voltage
  const loss = current ** 2 * resistance
  const lossPercent = (loss / power) * 100
  const heat = Math.min(1, loss / 800)
  return <>
    <p className="lead">Keep transmitted power fixed, then raise the voltage. The current falls, so cable power loss falls much more strongly.</p>
    <div className="dual-equations"><EquationCard label="TRANSMITTED POWER" equation="P=VI" accent="blue" /><EquationCard label="CABLE POWER LOSS" equation="P_{\\mathrm{loss}}=I^2R" accent="red" /></div>
    <RangeControl label="Transmission voltage" value={voltage} min={250} max={5000} step={250} onChange={setVoltage} unit="V" />
    <RangeControl label="Cable resistance" value={resistance} min={0.1} max={2} step={0.1} onChange={setResistance} unit="Ω" />
    <div className="loss-dashboard"><div className="heat-cable"><div className="heat-wire" style={{ opacity: 0.18 + heat * 0.82, boxShadow: `0 0 ${10 + heat * 38}px rgba(255,90,53,${0.18 + heat * 0.7})` }} /><Thermometer /><span>cable heating representation</span></div><div className="loss-metrics"><div><span>Power transmitted</span><strong>{power.toLocaleString()} W</strong></div><div><span>Current</span><strong>{current.toFixed(2)} A</strong></div><div><span>Power lost in cables</span><strong className="red-text">{loss.toFixed(1)} W</strong></div></div></div>
    <div className="loss-conclusion">Voltage <Plus size={15} /> &nbsp; Current <Minus size={15} /> &nbsp; Cable power loss <Minus size={15} /><span>{lossPercent.toFixed(2)}% of the transmitted power is lost in this model.</span></div>
  </>
}

function Complete({ setMode, setAnimate, setXray }: Shared) {
  return <>
    <p className="lead">A transformer changes voltage using two coils and a soft-iron core. Together, transformers make efficient high-voltage transmission possible.</p>
    <button className="play-transformer" type="button" onClick={() => { setMode('step-up'); setXray(true); setAnimate(true) }}><Bolt size={17} /> RUN MASTER SIMULATION</button>
    <div className="master-route"><span><Factory />Power station</span><ArrowRight /><span className="blue-stage"><Plus />Step-up</span><ArrowRight /><span><RadioTower />High-voltage cables</span><ArrowRight /><span className="gold-stage"><Minus />Step-down</span><ArrowRight /><span><Home />Consumer</span></div>
    <div className="equation-mini-grid"><div><BlockMath math="\\frac{V_p}{V_s}=\\frac{N_p}{N_s}" /><span>voltage from turns</span></div><div><BlockMath math="I_pV_p=I_sV_s" /><span>ideal power transfer</span></div><div><BlockMath math="P=VI" /><span>voltage and current</span></div><div><BlockMath math="P_{\\mathrm{loss}}=I^2R" /><span>smaller current, smaller losses</span></div></div>
    <div className="callout"><Bolt size={17} /><span>Mission complete: the transformer connects voltage changes to lower current and lower cable power loss.</span></div>
  </>
}

export default function ConceptPanels(props: Shared) {
  const id: SectionId = props.section.id
  if (id === 'construction') return <Construction {...props} />
  if (id === 'primary-secondary') return <PrimarySecondary {...props} />
  if (id === 'turns-ratio') return <TurnsRatio {...props} />
  if (id === 'transmission') return <Transmission />
  if (id === 'advantages') return <Advantages />
  if (id === 'operation') return <Operation {...props} />
  if (id === 'efficiency') return <Efficiency />
  if (id === 'losses') return <Losses />
  return <Complete {...props} />
}
