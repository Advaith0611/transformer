export type SectionId =
  | 'construction'
  | 'primary-secondary'
  | 'turns-ratio'
  | 'transmission'
  | 'advantages'
  | 'operation'
  | 'efficiency'
  | 'losses'
  | 'complete'

export interface SyllabusSection {
  id: SectionId
  index: number
  syllabus: string
  nav: string
  title: string
  mission: string
  description: string
}

export const sections: SyllabusSection[] = [
  {
    id: 'construction', index: 1, syllabus: '4.5.6.1', nav: 'Construction',
    title: 'Construction of a Simple Transformer', mission: 'What is it made of?',
    description: 'Inspect the electrically separate coils and the soft-iron core that links them.',
  },
  {
    id: 'primary-secondary', index: 2, syllabus: '4.5.6.2', nav: 'Primary & Secondary',
    title: 'Primary, Secondary, Step-Up and Step-Down', mission: 'Which coil does what?',
    description: 'Change the coil turns to see how a transformer can increase or decrease voltage.',
  },
  {
    id: 'turns-ratio', index: 3, syllabus: '4.5.6.3', nav: 'Turns Ratio',
    title: 'The Turns Ratio', mission: 'How do turns affect voltage?',
    description: 'Use the turns ratio to calculate the voltage induced in the secondary coil.',
  },
  {
    id: 'transmission', index: 4, syllabus: '4.5.6.4', nav: 'High-Voltage Transmission',
    title: 'Transformers and the National Grid', mission: 'Where does transformed electricity travel?',
    description: 'Follow electricity from a power station to homes through step-up and step-down transformers.',
  },
  {
    id: 'advantages', index: 5, syllabus: '4.5.6.5', nav: 'Advantages of High Voltage',
    title: 'Why Transmit Electricity at High Voltage?', mission: 'Why is high voltage better?',
    description: 'For the same power, a larger voltage means a smaller current in the cables.',
  },
  {
    id: 'operation', index: 6, syllabus: '4.5.6.6', nav: 'How a Transformer Works',
    title: 'How Does a Transformer Work?', mission: 'How is voltage induced?',
    description: 'Watch alternating current create a changing magnetic field and induce an output voltage.',
  },
  {
    id: 'efficiency', index: 7, syllabus: '4.5.6.7', nav: '100% Efficiency',
    title: 'Transformer Efficiency', mission: 'Where does the power go?',
    description: 'An ideal transformer transfers equal electrical power from its primary to its secondary.',
  },
  {
    id: 'losses', index: 8, syllabus: '4.5.6.8', nav: 'Power Losses in Cables',
    title: 'Power Losses in Transmission Cables', mission: 'Why does high voltage reduce losses?',
    description: 'Lower current produces a much smaller cable power loss because loss depends on I².',
  },
]

export const completeSection: SyllabusSection = {
  id: 'complete', index: 9, syllabus: 'MISSION COMPLETE', nav: 'Complete Transformer',
  title: 'The Complete Transformer System', mission: 'Connect every idea.',
  description: 'See how construction, voltage transformation, power and cable losses work together.',
}

export const componentInfo = {
  core: {
    title: 'Soft-iron core',
    text: 'The changing magnetic field passes through the soft-iron core. It links the primary coil to the secondary coil.',
  },
  primary: {
    title: 'Primary coil',
    text: 'The primary coil is connected to the input supply. An alternating current in it produces a changing magnetic field.',
  },
  secondary: {
    title: 'Secondary coil',
    text: 'The secondary coil is electrically separate from the primary coil. A changing magnetic field induces an output voltage in it.',
  },
  input: {
    title: 'Input terminals',
    text: 'These terminals connect the alternating-current input supply to the primary coil.',
  },
  output: {
    title: 'Output terminals',
    text: 'These terminals take the induced output voltage from the secondary coil.',
  },
  field: {
    title: 'Changing magnetic field',
    text: 'A changing magnetic field travels through the iron core and induces a voltage in the secondary coil.',
  },
} as const

export type ComponentKey = keyof typeof componentInfo
