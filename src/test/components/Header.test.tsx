import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { usePathname } from 'next/navigation'
import Header from '@/components/Header'

describe('Header', () => {
  it('renders the site name', () => {
    render(<Header />)
    expect(screen.getByText('Nomade Fuleiro')).toBeInTheDocument()
  })

  it('renders all navigation links', () => {
    render(<Header />)
    expect(screen.getAllByText('Home').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Destinos').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Sobre').length).toBeGreaterThan(0)
  })

  it('active link (current pathname) gets orange styling', () => {
    vi.mocked(usePathname).mockReturnValue('/destinos')
    render(<Header />)
    // Find the desktop nav link for Destinos (has active class bg-nomade-orange)
    const activeLinks = screen
      .getAllByText('Destinos')
      .filter((el) => el.closest('a')?.className.includes('bg-nomade-orange'))
    expect(activeLinks.length).toBeGreaterThan(0)
  })

  it('mobile menu is hidden by default', () => {
    vi.mocked(usePathname).mockReturnValue('/')
    render(<Header />)
    // The mobile nav is only rendered when open=true, so hamburger nav should not exist
    // There are two navs (desktop + potential mobile). When closed, only desktop is shown.
    const allNavs = screen.queryAllByRole('navigation')
    // Desktop nav is hidden via md:flex — it still exists in DOM
    // Mobile nav should NOT be rendered (conditional render in JSX)
    expect(allNavs).toHaveLength(1)
  })

  it('clicking the hamburger button shows the mobile menu', async () => {
    vi.mocked(usePathname).mockReturnValue('/')
    render(<Header />)
    const hamburger = screen.getByLabelText('Menu')
    await userEvent.click(hamburger)
    // Mobile menu nav appears
    const allNavs = screen.getAllByRole('navigation')
    expect(allNavs).toHaveLength(2)
  })

  it('clicking a mobile nav link closes the menu', async () => {
    vi.mocked(usePathname).mockReturnValue('/')
    render(<Header />)
    const hamburger = screen.getByLabelText('Menu')
    await userEvent.click(hamburger)
    // Menu is open, now click a link inside the mobile nav
    const mobileNav = screen.getAllByRole('navigation')[1]
    const homeLink = mobileNav.querySelector('a[href="/"]')
    expect(homeLink).toBeTruthy()
    await userEvent.click(homeLink!)
    // Menu should close
    expect(screen.queryAllByRole('navigation')).toHaveLength(1)
  })
})
