/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-space-grotesk)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-jetbrains-mono)', 'monospace'],
        futuristic: [
          'Segoe UI',
          'Roboto',
          '-apple-system',
          'BlinkMacSystemFont',
          'sans-serif',
        ],
        tech: [
          'IBM Plex Mono',
          'Courier New',
          'monospace',
        ],
        modern: [
          'Inter',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
        ],
        geometric: [
          'Trebuchet MS',
          'Lucida Grande',
          'sans-serif',
        ],
      },
    },
  },
  plugins: [],
}
