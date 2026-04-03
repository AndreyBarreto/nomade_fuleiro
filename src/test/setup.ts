/// <reference types="vitest/globals" />
import '@testing-library/jest-dom'

vi.mock('next/font/google', () => ({
  Poppins: () => ({ variable: '--font-poppins', className: '' }),
  Inter: () => ({ variable: '--font-inter', className: '' }),
}))

vi.mock('next/navigation', () => ({
  usePathname: vi.fn().mockReturnValue('/'),
  useRouter: vi.fn().mockReturnValue({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
  }),
}))

vi.mock('next/link', async () => {
  const { createElement } = await import('react')
  return {
    default: ({
      href,
      children,
      ...props
    }: {
      href: string
      children: unknown
      [key: string]: unknown
    }) => createElement('a', { href, ...props }, children as never),
  }
})
