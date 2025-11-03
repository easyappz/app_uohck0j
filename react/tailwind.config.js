/* Easyappz: Tailwind config */
module.exports = {
  content: [
    './public/index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: 'var(--bg)',
        text: 'var(--text)',
        muted: 'var(--muted)',
        surface: 'var(--surface)',
        border: 'var(--border)',
        accent: 'var(--accent)'
      },
      boxShadow: {
        soft: '0 6px 30px rgba(2, 6, 23, 0.06)'
      }
    },
  },
  plugins: [],
};
