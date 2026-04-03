import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import PhotoGallery from '@/components/mdx/PhotoGallery'

const images = [
  { src: 'https://example.com/img1.jpg', alt: 'Image one', width: 800, height: 600, caption: 'Caption one' },
  { src: 'https://example.com/img2.jpg', alt: 'Image two', width: 800, height: 600 },
]

describe('PhotoGallery', () => {
  it('returns null when images array is empty', () => {
    const { container } = render(<PhotoGallery images={[]} />)
    expect(container.firstChild).toBeNull()
  })

  it('renders all image thumbnails', () => {
    render(<PhotoGallery images={images} />)
    expect(screen.getByAltText('Image one')).toBeInTheDocument()
    expect(screen.getByAltText('Image two')).toBeInTheDocument()
  })

  it('does not show lightbox initially', () => {
    render(<PhotoGallery images={images} />)
    expect(screen.queryByRole('dialog')).toBeNull()
  })

  it('clicking a thumbnail opens the lightbox', async () => {
    render(<PhotoGallery images={images} />)
    const buttons = screen.getAllByRole('button')
    await userEvent.click(buttons[0])
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('lightbox shows the clicked image', async () => {
    render(<PhotoGallery images={images} />)
    const buttons = screen.getAllByRole('button')
    await userEvent.click(buttons[0])
    const dialog = screen.getByRole('dialog')
    const lightboxImg = dialog.querySelector('img')
    expect(lightboxImg).toHaveAttribute('src', 'https://example.com/img1.jpg')
    expect(lightboxImg).toHaveAttribute('alt', 'Image one')
  })

  it('lightbox has role="dialog" and aria-modal="true"', async () => {
    render(<PhotoGallery images={images} />)
    await userEvent.click(screen.getAllByRole('button')[0])
    const dialog = screen.getByRole('dialog')
    expect(dialog).toHaveAttribute('aria-modal', 'true')
  })

  it('clicking the close button dismisses the lightbox', async () => {
    render(<PhotoGallery images={images} />)
    await userEvent.click(screen.getAllByRole('button')[0])
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    const closeBtn = screen.getByLabelText('Fechar')
    await userEvent.click(closeBtn)
    expect(screen.queryByRole('dialog')).toBeNull()
  })

  it('clicking the backdrop dismisses the lightbox', async () => {
    render(<PhotoGallery images={images} />)
    await userEvent.click(screen.getAllByRole('button')[0])
    const dialog = screen.getByRole('dialog')
    await userEvent.click(dialog)
    expect(screen.queryByRole('dialog')).toBeNull()
  })

  it('renders caption element for images with captions', () => {
    render(<PhotoGallery images={images} />)
    expect(screen.getByText('Caption one')).toBeInTheDocument()
  })

  it('lightbox shows caption when image has one', async () => {
    render(<PhotoGallery images={images} />)
    await userEvent.click(screen.getAllByRole('button')[0])
    const dialog = screen.getByRole('dialog')
    expect(dialog).toHaveTextContent('Caption one')
  })
})
