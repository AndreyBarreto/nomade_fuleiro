import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './content/**/*.mdx',
  ],
  theme: {
    extend: {
      colors: {
        nomade: {
          orange: '#FF6B35',
          mint: '#4ECDC4',
          yellow: '#FFE66D',
          coral: '#FF8E72',
          dark: '#1A1A2E',
          gray: '#F7F7F7',
        },
      },
      fontFamily: {
        heading: ['var(--font-poppins)', 'sans-serif'],
        body: ['var(--font-inter)', 'sans-serif'],
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
            color: '#374151',
            a: {
              color: '#FF6B35',
              '&:hover': { color: '#e55a24' },
            },
            'h2, h3, h4': {
              fontFamily: 'var(--font-poppins)',
              fontWeight: '600',
            },
            img: {
              borderRadius: '0.75rem',
            },
          },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}

export default config
