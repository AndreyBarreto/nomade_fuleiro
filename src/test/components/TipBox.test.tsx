import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import TipBox from '@/components/mdx/TipBox'

describe('TipBox', () => {
  it('renders type="tip" with correct icon and label', () => {
    render(<TipBox type="tip">Travel tip content</TipBox>)
    expect(screen.getByText('💡 Dica')).toBeInTheDocument()
    expect(screen.getByText('Travel tip content')).toBeInTheDocument()
  })

  it('renders type="warning" with correct icon and label', () => {
    render(<TipBox type="warning">Watch out here</TipBox>)
    expect(screen.getByText(/⚠️/)).toBeInTheDocument()
    expect(screen.getByText(/Atenção/)).toBeInTheDocument()
    expect(screen.getByText('Watch out here')).toBeInTheDocument()
  })

  it('renders type="info" with correct icon and label', () => {
    render(<TipBox type="info">Learn more about this</TipBox>)
    expect(screen.getByText('ℹ️ Saiba mais')).toBeInTheDocument()
    expect(screen.getByText('Learn more about this')).toBeInTheDocument()
  })

  it('defaults to type="tip" when prop is omitted', () => {
    render(<TipBox>Default content</TipBox>)
    expect(screen.getByText(/💡/)).toBeInTheDocument()
    expect(screen.getByText(/Dica/)).toBeInTheDocument()
  })

  it('renders children inside the box', () => {
    render(
      <TipBox type="tip">
        <span data-testid="child">Inner content</span>
      </TipBox>
    )
    expect(screen.getByTestId('child')).toBeInTheDocument()
  })

  it('has border-l-4 class for structural styling', () => {
    const { container } = render(<TipBox type="tip">texto</TipBox>)
    expect(container.firstChild).toHaveClass('border-l-4')
  })
})
