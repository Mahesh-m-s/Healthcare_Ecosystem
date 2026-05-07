import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      // ── VAIDYAASTRA DESIGN SYSTEM COLORS ──────────────────────────
      colors: {
        va: {
          lavender:    '#DCD6F7',
          mint:        '#DDEEE8',
          lime:        '#E7EDB8',
          'blue-light':'#D9EDF7',
          'white-off': '#F8F8F8',
          white:       '#FFFFFF',
          'gray-light':'#EAEAEA',
          'gray-text': '#7B7B7B',
          charcoal:    '#2C2C2C',
          blue:        '#4F8CFF',
          emergency:   '#FF4B4B',
          success:     '#2ECC71',
          warning:     '#F39C12',
          purple:      '#7C3AED',
        },
      },
      // ── DARK MODE EQUIVALENTS ──────────────────────────────────────
      backgroundColor: {
        'dark-base':  '#0F1117',
        'dark-card':  '#1A1D27',
        'dark-surface':'#22263A',
        'dark-border':'#2E3348',
      },
      fontFamily: {
        sans:    ['Inter', 'system-ui', 'sans-serif'],
        medical: ['"Source Serif 4"', 'Georgia', 'serif'],
        mono:    ['"JetBrains Mono"', 'Consolas', 'monospace'],
      },
      borderRadius: {
        va:    '12px',
        'va-lg': '20px',
        'va-xl': '28px',
      },
      boxShadow: {
        'va-card':      '0 4px 24px rgba(79, 140, 255, 0.08)',
        'va-hover':     '0 8px 32px rgba(79, 140, 255, 0.16)',
        'va-emergency': '0 0 32px rgba(255, 75, 75, 0.35)',
        'va-glass':     '0 8px 32px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.6)',
        'va-glow-blue': '0 0 20px rgba(79, 140, 255, 0.3)',
        'va-glow-green':'0 0 20px rgba(46, 204, 113, 0.3)',
        'dark-card':    '0 4px 24px rgba(0,0,0,0.3)',
      },
      animation: {
        'pulse-slow':   'pulse 3s cubic-bezier(0.4,0,0.6,1) infinite',
        'sos-ping':     'sos-ping 1.5s cubic-bezier(0,0,0.2,1) infinite',
        'slide-in-right':'slideInRight 0.3s ease-out',
        'slide-in-up':  'slideInUp 0.4s ease-out',
        'fade-in':      'fadeIn 0.3s ease-out',
        'shimmer':      'shimmer 1.5s infinite',
        'bounce-soft':  'bounceSoft 2s infinite',
      },
      keyframes: {
        'sos-ping': {
          '75%, 100%': { transform: 'scale(2)', opacity: '0' }
        },
        slideInRight: {
          from: { transform: 'translateX(100%)', opacity: '0' },
          to:   { transform: 'translateX(0)',    opacity: '1' }
        },
        slideInUp: {
          from: { transform: 'translateY(20px)', opacity: '0' },
          to:   { transform: 'translateY(0)',    opacity: '1' }
        },
        fadeIn: {
          from: { opacity: '0' },
          to:   { opacity: '1' }
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition:  '200% 0' }
        },
        bounceSoft: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%':      { transform: 'translateY(-6px)' }
        }
      },
      backdropBlur: { xs: '2px' },
      backgroundImage: {
        'va-gradient':    'linear-gradient(135deg, #DCD6F7 0%, #D9EDF7 50%, #DDEEE8 100%)',
        'va-hero':        'linear-gradient(135deg, #f8f8ff 0%, #e8f0ff 50%, #f0fff8 100%)',
        'dark-gradient':  'linear-gradient(135deg, #0F1117 0%, #131625 50%, #111820 100%)',
        'emergency-grad': 'linear-gradient(135deg, #FF4B4B 0%, #FF8080 100%)',
        'shimmer-grad':   'linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)',
      },
      screens: {
        'xs': '375px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      },
      spacing: {
        'sidebar': '260px',
        'topbar':  '64px',
      },
      zIndex: {
        'sidebar':   '40',
        'topbar':    '30',
        'modal':     '50',
        'toast':     '60',
        'emergency': '70',
      }
    },
  },
  plugins: [],
}

export default config
