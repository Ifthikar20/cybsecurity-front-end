// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
    // Keep your existing content configuration
    content: [
      './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
      './src/components/**/*.{js,ts,jsx,tsx,mdx}',
      './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
      extend: {
        // Add these animation definitions to your existing theme.extend
        animation: {
          'float': 'float 2s ease-in-out infinite',
          'stir': 'stir 2s linear infinite',
          'wave': 'wave 1s ease-in-out infinite',
          'progress': 'progress 3s ease-in-out infinite',
        },
        keyframes: {
          float: {
            '0%, 100%': { transform: 'translateY(0)', opacity: '0.8' },
            '50%': { transform: 'translateY(-10px)', opacity: '0.5' },
            '100%': { opacity: '0' },
          },
          stir: {
            '0%': { transform: 'rotate(0deg)' },
            '25%': { transform: 'rotate(20deg)' },
            '50%': { transform: 'rotate(0deg)' },
            '75%': { transform: 'rotate(-20deg)' },
            '100%': { transform: 'rotate(0deg)' },
          },
          wave: {
            '0%, 100%': { transform: 'translateY(0)' },
            '50%': { transform: 'translateY(-5px)' },
          },
          progress: {
            '0%': { width: '15%' },
            '50%': { width: '70%' },
            '75%': { width: '85%' },
            '90%': { width: '90%' },
            '100%': { width: '15%' },
          },
        },
        // Keep any existing extensions you have
      },
    },
    plugins: [
      // Keep any existing plugins
    ],
  };