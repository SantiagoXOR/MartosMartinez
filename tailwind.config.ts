import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: [
          "Myriad Pro",
          "Source Sans Pro",
          "Open Sans",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
        'myriad': [
          "Myriad Pro",
          "Source Sans Pro",
          "Open Sans",
          "sans-serif",
        ],
        'source': [
          "Source Sans Pro",
          "Myriad Pro",
          "Open Sans",
          "sans-serif",
        ],
        'open': [
          "Open Sans",
          "Myriad Pro",
          "Source Sans Pro",
          "sans-serif",
        ],
      },
      fontWeight: {
        'light': '300',
        'normal': '400',
        'medium': '500',
        'semibold': '600',
        'bold': '700',
        'extrabold': '800',
        'black': '900',
      },
      letterSpacing: {
        'tighter': '-0.02em',
        'tight': '-0.01em',
        'normal': '0',
        'wide': '0.025em',
        'wider': '0.05em',
        'widest': '0.1em',
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        "blue-ribbon": {
          50: "#edf8ff",
          100: "#d6edff",
          200: "#b5e1ff",
          300: "#83cfff",
          400: "#48b4ff",
          500: "#1e8fff",
          600: "#066fff",
          700: "#005aff",
          800: "#0845c5",
          900: "#0d3f9b",
          950: "#0e275d",
        },
        primary: {
          DEFAULT: "#005aff",
          foreground: "#ffffff",
          50: "#edf8ff",
          100: "#d6edff",
          200: "#b5e1ff",
          300: "#83cfff",
          400: "#48b4ff",
          500: "#1e8fff",
          600: "#066fff",
          700: "#005aff",
          800: "#0845c5",
          900: "#0d3f9b",
          950: "#0e275d",
        },
        secondary: {
          DEFAULT: "#46d7e3",
          foreground: "#0e275d",
        },
        accent: {
          DEFAULT: "#0e275d",
          foreground: "#ffffff",
        },
        white: "#ffffff",
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config
