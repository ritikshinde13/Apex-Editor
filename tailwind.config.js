/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        editor: {
          bg: '#0a0b0e',          // Canvas and deepest background
          panel: '#12141a',       // Sidebar, inspector docks
          surface: '#181b24',     // Cards, tracks, controls
          hover: '#222634',       // Hover states
          border: '#2a2f3f',      // Dividers and outlines
          muted: '#3b4256',       // Muted borders/indicators
          text: '#f3f4f6',        // Primary white text
          subtext: '#9ca3af',     // Secondary slate text
          dim: '#6b7280',         // Tertiary icon/shortcut text
        },
        accent: {
          cyan: '#00e5ff',        // Primary electric cyan
          blue: '#3b82f6',
          purple: '#8b5cf6',      // Creative secondary violet
          pink: '#ec4899',
          danger: '#ef4444',      // Playhead red & delete
          warning: '#f59e0b',
          success: '#10b981',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      boxShadow: {
        'glow-cyan': '0 0 15px -3px rgba(0, 229, 255, 0.3)',
        'glow-purple': '0 0 15px -3px rgba(139, 92, 246, 0.3)',
        'panel': '0 4px 20px -2px rgba(0, 0, 0, 0.5)',
      },
    },
  },
  plugins: [],
}
