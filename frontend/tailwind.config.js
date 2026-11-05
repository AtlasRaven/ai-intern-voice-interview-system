/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#ffffff',
        surface: '#f8fafc',
        surfaceSubtle: '#f1f5f9',
        border: '#e2e8f0',
        borderStrong: '#cbd5e1',
        textPrimary: '#0f172a',
        textSecondary: '#475569',
        textMuted: '#64748b',
        brand: {
          DEFAULT: '#2563eb',
          hover: '#1d4ed8',
          light: '#eff6ff',
          border: '#bfdbfe',
        },
      },
      borderRadius: {
        md: '6px',
        lg: '8px',
        xl: '10px',
      },
    },
  },
  plugins: [],
};
