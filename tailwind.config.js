/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        livora: {
          bg: "#F6F0E8",        // Warm Ivory
          dark: "#171717",      // Deep Black
          gold: "#C8A96B",      // Champagne Gold
          goldLight: "#DFC8A5", // Soft Gold
          goldDark: "#9E7E3C",  // Deep Antique Gold
          cream: "#FAF7F2",     // Ultra Light Cream
          card: "#FFFFFF",      // Clean Card Background
          border: "#E8DFD3",    // Subtle Warm Border
          muted: "#737373",     // Subtle Muted Gray
          text: "#171717",      // Primary Text
        },
      },
      fontFamily: {
        sans: ["var(--font-tajawal)", "Tajawal", "sans-serif"],
        display: ["var(--font-tajawal)", "Tajawal", "sans-serif"],
        body: ["var(--font-tajawal)", "Tajawal", "sans-serif"],
        luxury: ["var(--font-luxury)", "var(--font-cormorant)", "Cinzel", "Cormorant Garamond", "Didot", "Bodoni MT", "serif"],
        serif: ["var(--font-luxury)", "var(--font-cormorant)", "Cinzel", "Cormorant Garamond", "Didot", "serif"],
      },
      boxShadow: {
        'luxury': '0 10px 30px -10px rgba(23, 23, 23, 0.05)',
        'luxury-hover': '0 20px 40px -15px rgba(200, 169, 107, 0.15)',
        'gold-glow': '0 0 25px -5px rgba(200, 169, 107, 0.3)',
      },
    },
  },
  plugins: [],
};
