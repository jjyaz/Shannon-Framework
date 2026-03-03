/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        neon: {
          orange: '#FF9F1C',
          amber: '#FFB347',
          dark: '#FF7A00',
          dim: '#CC7F16',
        },
        cyber: {
          black: '#000000',
          dark: '#060606',
          darker: '#030303',
          panel: '#0a0a0a',
          border: '#1a1a1a',
        },
        terminal: {
          green: '#00FF41',
          red: '#FF3333',
          yellow: '#FFD700',
          blue: '#00D4FF',
          dim: '#666666',
        },
      },
      fontFamily: {
        heading: ['"Space Grotesk"', 'monospace'],
        body: ['Inter', 'sans-serif'],
        mono: ['"Space Grotesk"', '"Courier New"', 'monospace'],
      },
      boxShadow: {
        'neon-sm': '0 0 10px rgba(255, 159, 28, 0.2), inset 0 0 10px rgba(255, 159, 28, 0.05)',
        'neon-md': '0 0 20px rgba(255, 159, 28, 0.3), inset 0 0 20px rgba(255, 159, 28, 0.05)',
        'neon-lg': '0 0 40px rgba(255, 159, 28, 0.4), 0 0 80px rgba(255, 159, 28, 0.1)',
        'neon-xl': '0 0 60px rgba(255, 159, 28, 0.5), 0 0 120px rgba(255, 159, 28, 0.15)',
        'neon-inset': 'inset 0 0 30px rgba(255, 159, 28, 0.1)',
        'terminal': '0 0 1px rgba(255, 159, 28, 0.8)',
      },
      animation: {
        'pulse-glow': 'pulse-glow 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'blink': 'blink 1s step-end infinite',
        'scanline': 'scanline 8s linear infinite',
        'flicker': 'flicker 0.15s infinite',
        'typing': 'typing 2s steps(20) forwards',
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'slide-up': 'slideUp 0.6s ease-out forwards',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
        'terminal-boot': 'terminalBoot 0.3s ease-out forwards',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(255, 159, 28, 0.2)' },
          '50%': { boxShadow: '0 0 40px rgba(255, 159, 28, 0.4)' },
        },
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        scanline: {
          '0%': { transform: 'translateY(-100vh)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        flicker: {
          '0%': { opacity: '0.97' },
          '5%': { opacity: '0.9' },
          '10%': { opacity: '0.97' },
          '15%': { opacity: '0.92' },
          '20%': { opacity: '0.97' },
        },
        typing: {
          '0%': { width: '0' },
          '100%': { width: '100%' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        glowPulse: {
          '0%, 100%': { textShadow: '0 0 10px rgba(255, 159, 28, 0.5), 0 0 20px rgba(255, 159, 28, 0.3)' },
          '50%': { textShadow: '0 0 20px rgba(255, 159, 28, 0.8), 0 0 40px rgba(255, 159, 28, 0.5), 0 0 60px rgba(255, 159, 28, 0.2)' },
        },
        terminalBoot: {
          '0%': { opacity: '0', transform: 'scaleY(0.8)' },
          '100%': { opacity: '1', transform: 'scaleY(1)' },
        },
      },
      borderRadius: {
        'terminal': '2px',
      },
    },
  },
  plugins: [],
};
