/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        warm: {
          50: "#FFF7ED",
          100: "#FFEDD5",
          200: "#FF6F00",
          300: "#C45400",
          400: "#8D3A00",
          500: "#592200",
          600: "#2A0C00",
          700: "#EA580C",
          800: "#9A3412",
          900: "#7C2D12",
        },
        peach: {
          50: "#FFECE8",
          100: "#FFB6A2",
          200: "#FF7A35",
          300: "#CC5900",
          400: "#943F00",
          500: "#602600",
          600: "#301000",
        },
        coral: {
          50: "#FFEDE7",
          100: "#FFC4AD",
          200: "#FF8C33",
          300: "#CD6A00",
          400: "#984D00",
          500: "#653100",
          600: "#371800",
        },
        neutral: {
          50: "#EBE9E9",
          100: "#C5C1C0",
          200: "#A39997",
          300: "#7C7573",
          400: "#585251",
          500: "#363231",
          600: "#171514",
        },
        slate: {
          300: "#CBD5E1",
          500: "#64748B",
          600: "#475569",
        },
        gray: {
          50: "#F8FAFC",
          100: "#F3F4F6",
          200: "#E5E7EB",
          300: "#D1D5DB",
          400: "#9CA3AF",
          500: "#6B7280",
          600: "#4B5563",
          700: "#374151",
          800: "#1F2937",
          900: "#111827",
        },
        skillPill: {
          light: {
            bg: "#E2E8F0",
            text: "#334155",
          },
          dark: {
            bg: "#18212E",
            text: "#C5C1C0",
          },
        },
        dark: {
          DEFAULT: "#0D0D0D",
          bg: "#222020",
          container: "#121212",
        },
        tab: {
          light: {
            bg: "#FAFAFA",
            border: "#E9EAEB",
            active: {
              bg: "#FFF",
              text: "#414651",
            },
            inactive: {
              text: "#717680",
            },
          },
          dark: {
            bg: "#121212",
            border: "#202123",
            active: {
              bg: "#363231",
              text: "#FFE3DE",
            },
            inactive: {
              text: "#A39997",
            },
          },
        },
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          1: "hsl(var(--chart-1))",
          2: "hsl(var(--chart-2))",
          3: "hsl(var(--chart-3))",
          4: "hsl(var(--chart-4))",
          5: "hsl(var(--chart-5))",
        },
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)"],
        mono: ["var(--font-geist-mono)"],
        inter: ["var(--font-inter)"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
