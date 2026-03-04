import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'var(--primary)',
          dark: 'var(--primary-dark)',
          light: 'var(--primary-light)',
          50: 'var(--primary-50)',
          100: 'var(--primary-100)',
        },
        secondary: {
          DEFAULT: 'var(--secondary)',
          dark: 'var(--secondary-dark)',
          light: 'var(--secondary-light)',
          50: 'var(--secondary-50)',
        },
        backdrop: {
          primary: 'var(--backdrop-primary)',
          secondary: 'var(--backdrop-secondary)',
        },
        surface: {
          DEFAULT: 'var(--color-surface)',
        },
        'text-theme': {
          primary: 'var(--text-color-primary)',
          secondary: 'var(--text-color-secondary)',
          muted: 'var(--text-color-muted)',
          inverse: 'var(--text-color-inverse)',
          accent: 'var(--text-color-accent)',
        },
        border: {
          DEFAULT: 'var(--border-default)',
          subtle: 'var(--border-subtle)',
          emphasis: 'var(--border-emphasis)',
        },
        success: 'var(--color-success)',
        warning: 'var(--color-warning)',
        error: 'var(--color-error)',
      },
      borderRadius: {
        'card': 'var(--card-radius)',
        'btn': 'var(--btn-radius)',
        'badge': 'var(--badge-radius)',
      },
      boxShadow: {
        'card': 'var(--shadow-card)',
        'card-hover': 'var(--shadow-card-hover)',
      },
      maxWidth: {
        'content': 'var(--container-max)',
      },
      fontSize: {
        'display': 'var(--text-display)',
        'heading': 'var(--text-heading)',
        'subheading': 'var(--text-subheading)',
        'body': 'var(--text-body)',
        'small': 'var(--text-small)',
      },
      fontFamily: {
        'display': 'var(--font-display)',
        'heading': 'var(--font-heading)',
        'subheading': 'var(--font-subheading)',
        'body': 'var(--font-body)',
      },
      letterSpacing: {
        'display': 'var(--tracking-display)',
        'heading': 'var(--tracking-heading)',
        'body': 'var(--tracking-body)',
        'nav': 'var(--tracking-nav)',
        'label': 'var(--tracking-label)',
      },
      lineHeight: {
        'display': 'var(--leading-display)',
        'heading': 'var(--leading-heading)',
        'body': 'var(--leading-body)',
        'menu': 'var(--leading-menu)',
      },
      spacing: {
        'section': 'var(--section-py)',
        'section-sm': 'var(--section-py-sm)',
        'container-px': 'var(--container-px)',
        'card-pad': 'var(--card-pad)',
        'menu-item': 'var(--menu-item-py)',
        'nav-h': 'var(--nav-height)',
        'grid-gap': 'var(--grid-gap)',
      },
      minHeight: {
        'hero': 'var(--hero-min-h)',
      },
      transitionDuration: {
        'fast': 'var(--duration-fast)',
        'base': 'var(--duration-base)',
        'slow': 'var(--duration-slow)',
      },
      transitionTimingFunction: {
        'theme': 'var(--easing)',
      },
    },
  },
  plugins: [],
}

export default config
