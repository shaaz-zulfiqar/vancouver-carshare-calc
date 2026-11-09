/* Build the site's CSS (run from this folder after changing any page or script):
 *   npx tailwindcss@3.4.17 -c tailwind.config.js -i src/input.css -o assets/tailwind.css --minify
 */
module.exports = {
  content: ['./*.html', './*/*.html', './*/*/*.html', './assets/*.js'],
  theme: { extend: {
    colors: {
      evo: { DEFAULT: '#6BB8E0', light: '#A8DAF3', deep: '#3C9ACF' },
      modo: { DEFAULT: '#E31837', light: '#FF5A70', deep: '#B30F29' },
      slate: { 950: '#0B0F19' },
      // panel colours differ between the Evo pages and the hub/Modo/Compare pages: each page sets the --panel variables
      panel: 'rgb(var(--panel) / <alpha-value>)',
      panel2: 'rgb(var(--panel2) / <alpha-value>)',
      line: 'rgb(var(--line) / <alpha-value>)'
    },
    fontFamily: {
      display: ['"Space Grotesk"', 'sans-serif'],
      body: ['Inter', 'sans-serif'],
      mono: ['"JetBrains Mono"', 'monospace']
    }
  } }
};
