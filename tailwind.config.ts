import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
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
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))',
					dark: 'hsl(var(--tertiary))',
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
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				// Custom project colors
				'color-body': {
					DEFAULT: '#FFFFFF',
					'default': '#FFFFFF',
					'secondary': '#F8F9FA',
					'tertiary': '#E9ECEF',
				},
				'color-text': {
					DEFAULT: '#212529',
					'primary': '#212529',
					'secondary': '#6C757D',
					'tertiary': '#ADB5BD',
					'inverse': '#FFFFFF',
				},
				'color-border': {
					DEFAULT: '#DEE2E6',
					'primary': '#DEE2E6',
					'secondary': '#E9ECEF',
					'focus': '#40E0D0',
				},
				'color-chart': {
					'primary': '#40E0D0',    // Turquoise
					'secondary': '#7FB3D3',  // Pastel Blue
					'tertiary': '#8BC34A',   // Pastel Green
					'quaternary': '#FFD54F', // Pastel Yellow
					'quinary': '#F48FB1',    // Pastel Pink
					'senary': '#B39DDB',     // Pastel Purple
				},
				'color-status': {
					'success': '#8BC34A',
					'warning': '#FFD54F',
					'error': '#F48FB1',
					'info': '#7FB3D3',
				},
				'color-research': {
					'type-medical': '#40E0D0',
					'type-software': '#7FB3D3',
					'type-medicine': '#8BC34A',
					'type-biology': '#FFD54F',
					'status-todo': '#F5F5F5',
					'status-in-process': '#7FB3D3',
					'status-done': '#8BC34A',
					'status-approve': '#8BC34A',
				},
				'color-trl': {
					'TRL1': '#F48FB1',
					'TRL2': '#FFD54F',
					'TRL3': '#8BC34A',
					'TRL4': '#7FB3D3',
					'TRL5': '#40E0D0',
					'TRL6': '#B39DDB',
					'TRL7': '#F48FB1',
					'TRL8': '#FFD54F',
					'TRL9': '#8BC34A',
				},
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
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
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out'
			}
		}
	},
	plugins: [tailwindcssAnimate],
} satisfies Config;
