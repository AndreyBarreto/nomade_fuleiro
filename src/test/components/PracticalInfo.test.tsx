import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import PracticalInfo from '@/components/mdx/PracticalInfo'
import type { PracticalInfoData as PracticalInfoType } from '@/lib/posts'

const fullInfo: PracticalInfoType = {
  currency: 'Euro (€)',
  language: 'Holandês',
  visa: 'Não necessário (Schengen)',
  bestTime: 'Abril a Outubro',
  transport: 'Bicicleta e trem',
  internet: '4G/5G amplo',
  emergencyNumber: '112',
}

describe('PracticalInfo', () => {
  it('returns null when no fields are populated', () => {
    const { container } = render(<PracticalInfo info={{}} />)
    expect(container.firstChild).toBeNull()
  })

  it('renders the "Informações práticas" header when at least one field is populated', () => {
    render(<PracticalInfo info={{ currency: 'Euro' }} />)
    expect(screen.getByText(/Informações práticas/i)).toBeInTheDocument()
  })

  it('renders currency row with correct label and value', () => {
    render(<PracticalInfo info={{ currency: 'Euro (€)' }} />)
    expect(screen.getByText('Moeda')).toBeInTheDocument()
    expect(screen.getByText('Euro (€)')).toBeInTheDocument()
  })

  it('renders language row with correct label and value', () => {
    render(<PracticalInfo info={{ language: 'Holandês' }} />)
    expect(screen.getByText('Idioma')).toBeInTheDocument()
    expect(screen.getByText('Holandês')).toBeInTheDocument()
  })

  it('renders all 7 field labels when all fields are populated', () => {
    render(<PracticalInfo info={fullInfo} />)
    expect(screen.getByText('Moeda')).toBeInTheDocument()
    expect(screen.getByText('Idioma')).toBeInTheDocument()
    expect(screen.getByText('Visto')).toBeInTheDocument()
    expect(screen.getByText('Melhor época')).toBeInTheDocument()
    expect(screen.getByText('Transporte')).toBeInTheDocument()
    expect(screen.getByText('Internet')).toBeInTheDocument()
    expect(screen.getByText('Emergência')).toBeInTheDocument()
  })

  it('renders all 7 field values when all fields are populated', () => {
    render(<PracticalInfo info={fullInfo} />)
    expect(screen.getByText('Euro (€)')).toBeInTheDocument()
    expect(screen.getByText('Holandês')).toBeInTheDocument()
    expect(screen.getByText('Não necessário (Schengen)')).toBeInTheDocument()
    expect(screen.getByText('Abril a Outubro')).toBeInTheDocument()
    expect(screen.getByText('Bicicleta e trem')).toBeInTheDocument()
    expect(screen.getByText('4G/5G amplo')).toBeInTheDocument()
    expect(screen.getByText('112')).toBeInTheDocument()
  })

  it('omits rows for fields that are not provided', () => {
    render(<PracticalInfo info={{ currency: 'Euro' }} />)
    expect(screen.queryByText('Idioma')).not.toBeInTheDocument()
    expect(screen.queryByText('Visto')).not.toBeInTheDocument()
    expect(screen.queryByText('Emergência')).not.toBeInTheDocument()
  })

  it('renders the correct icon for each visible field', () => {
    render(<PracticalInfo info={{ currency: 'Euro', visa: 'Necessário' }} />)
    expect(screen.getByText('💰')).toBeInTheDocument()
    expect(screen.getByText('📋')).toBeInTheDocument()
  })
})
