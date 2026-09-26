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
          bg: '#050608',          // Deepest obsidian backdrop
          glass: 'rgba(16, 20, 30, 0.72)', // Primary frosted glass panel
          panel: 'rgba(13, 16, 24, 0.78)', // Dock panels
          surface: 'rgba(255, 255, 255, 0.04)', // Translucent card surface
          hover: 'rgba(255, 255, 255, 0.08)',   // Translucent hover
          active: 'rgba(0, 229, 255, 0.12)',  // Glowing active state
          border: 'rgba(255, 255, 255, 0.08)',  // Subtle frosted glass border
          borderLight: 'rgba(255, 255, 255, 0.15)', // Highlight border
          muted: 'rgba(255, 255, 255, 0.20)',   // Muted indicators
          text: '#f9fafb',        // Crisp white primary text
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
        'glow-cyan': '0 0 20px -2px rgba(0, 229, 255, 0.45)',
        'glow-purple': '0 0 20px -2px rgba(139, 92, 246, 0.45)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.5), inset 0 1px 0 0 rgba(255, 255, 255, 0.1)',
        'glass-sm': '0 4px 16px 0 rgba(0, 0, 0, 0.35), inset 0 1px 0 0 rgba(255, 255, 255, 0.08)',
        'glass-lg': '0 16px 48px -4px rgba(0, 0, 0, 0.7), inset 0 1px 0 0 rgba(255, 255, 255, 0.15)',
        'panel': '0 8px 32px -4px rgba(0, 0, 0, 0.6)',
      },
    },
  },
  plugins: [],
}
