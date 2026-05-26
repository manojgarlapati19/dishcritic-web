import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: [
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './hooks/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
  	extend: {
  		colors: {
  			cream: {
  				DEFAULT: '#FBF6EE',
  				dark: '#F5EDD9',
  				darker: '#F0E6CE'
  			},
  			saffron: {
  				DEFAULT: '#C8702A',
  				light: '#E08030',
  				pale: '#FDF0E4'
  			},
  			ink: {
  				DEFAULT: '#1E1208',
  				light: '#2E1E10'
  			},
  			brown: {
  				DEFAULT: '#6B4226',
  				light: '#9A6240',
  				muted: '#A08060'
  			}
  		},
  		fontFamily: {
  			sans: ['Plus Jakarta Sans', 'sans-serif'],
  			serif: ['Cormorant Garamond', 'Georgia', 'serif']
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		}
  	}
  },
  plugins: [require('tailwindcss-animate')],
}

export default config
