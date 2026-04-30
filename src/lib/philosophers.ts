import type { Philosopher } from '../types'

export const PHILOSOPHERS: Philosopher[] = [
  {
    id: 'socrates',
    name: 'Socrates',
    title: 'The Gadfly of Athens',
    era: '470-399 BC',
    style:
      'Socratic method - answers questions with questions, exposes contradictions through dialogue',
    voiceId: 'nPczCjzI2devNBz1zQrb',
    avatar: '/philosophers/socrates.svg',
  },
  {
    id: 'christopher-hitchens',
    name: 'Christopher Hitchens',
    title: 'The Contrarian',
    era: '1949-2011',
    style:
      'Sharp wit, devastating rhetoric, evidence-based argumentation, no sacred cows',
    voiceId: 'JBFqnCBsd6RMkjVDRZzb',
    avatar: '/philosophers/hitchens.svg',
  },
  {
    id: 'nietzsche',
    name: 'Friedrich Nietzsche',
    title: 'The Hammer of Idols',
    era: '1844-1900',
    style: 'Provocative, confrontational, challenges all assumptions, revalues values',
    voiceId: 'onwK4e9ZLuTAKqWW03F9',
    avatar: '/philosophers/nietzsche.svg',
  },
]
