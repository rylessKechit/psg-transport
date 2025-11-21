/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
  	container: {
  		center: true,
  		padding: '2rem',
  		screens: {
  			'2xl': '1400px'
  		}
  	},
  	extend: {
  		colors: {
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			psg: {
  				blue: {
  					'50': '#f0f4ff',
  					'100': '#e0e9ff',
  					'200': '#c7d6ff',
  					'300': '#a5b8ff',
  					'400': '#7e93ff',
  					'500': '#556bff',
  					'600': '#4147ff',
  					'700': '#3538eb',
  					'800': '#2c2fbe',
  					'900': '#004170',
  					'950': '#001a2e'
  				},
  				red: {
  					DEFAULT: '#E1000F',
  					light: '#ff4757',
  					dark: '#c23616'
  				},
  				gold: {
  					DEFAULT: '#FFD700',
  					light: '#fff9c4',
  					dark: '#b8860b'
  				}
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		fontFamily: {
  			sans: [
  				'Inter',
  				'system-ui',
  				'sans-serif'
  			],
  			psg: [
  				'Montserrat',
  				'Inter',
  				'sans-serif'
  			]
  		},
  		keyframes: {
  			'accordion-down': {
  				from: {
  					height: '0'
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: '0'
  				}
  			},
  			'slide-in': {
  				from: {
  					transform: 'translateX(100%)'
  				},
  				to: {
  					transform: 'translateX(0)'
  				}
  			},
  			'pulse-psg': {
  				'0%, 100%': {
  					backgroundColor: '#004170',
  					transform: 'scale(1)'
  				},
  				'50%': {
  					backgroundColor: '#556bff',
  					transform: 'scale(1.05)'
  				}
  			}
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out',
  			'slide-in': 'slide-in 0.3s ease-out',
  			'pulse-psg': 'pulse-psg 2s infinite'
  		},
  		backdropBlur: {
  			xs: '2px'
  		},
  		screens: {
  			xs: '475px'
  		},
  		spacing: {
  			'18': '4.5rem',
  			'88': '22rem'
  		}
  	}
  },
  plugins: [
    require("tailwindcss-animate"),
    // Plugin pour les couleurs PSG
    function({ addUtilities }) {
      const newUtilities = {
        '.bg-psg-gradient': {
          background: 'linear-gradient(135deg, #004170 0%, #556bff 100%)',
        },
        '.text-psg-gradient': {
          background: 'linear-gradient(135deg, #004170 0%, #FFD700 100%)',
          '-webkit-background-clip': 'text',
          '-webkit-text-fill-color': 'transparent',
          'background-clip': 'text',
        },
        '.shadow-psg': {
          'box-shadow': '0 4px 20px rgba(0, 65, 112, 0.15)',
        }
      }
      addUtilities(newUtilities)
    }
  ],
}