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
        sans: ['var(--font-ui)', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-tech)', 'monospace'],
        ipa: ['var(--font-ipa)', 'sans-serif'], // ← BARU
        futuristic: [
          'var(--font-display)',
          'system-ui',
          'sans-serif',
        ],
        tech: [
          'var(--font-tech)',
          'monospace',
        ],
        modern: [
          'var(--font-ui)',
          'system-ui',
          'sans-serif',
        ],
        geometric: [
          'var(--font-display)',
          'system-ui',
          'sans-serif',
        ],
      },
    },
  },
  plugins: [],
}
