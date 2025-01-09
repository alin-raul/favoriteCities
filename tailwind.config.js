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
      opacity: {
        1: ".01",
      },
      colors: {
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
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      height: {
        "screen-minus-nav": "calc(100vh - 56px)",
        "cities-list-height": "calc(100vh - 418px)",
        "screen-hero": "calc(100vh - 120px)",
      },
      maskImage: {
        "top-to-middle-25":
          "linear-gradient(to bottom, black 25%, transparent)",
        "top-to-middle-50":
          "linear-gradient(to bottom, black 50%, transparent)",
        "top-to-middle-75":
          "linear-gradient(to bottom, black 75%, transparent)",
        "bottom-to-top-25": "linear-gradient(to top, black 25%, transparent)",
        "bottom-to-top-50": "linear-gradient(to top, black 50%, transparent)",
        "bottom-to-top-75": "linear-gradient(to top, black 75%, transparent)",
      },
      boxShadow: {
        dotted: "0 0 0 2px rgba(0, 0, 0, 0.4) dotted",
      },
      opacity: {
        60: "0.6",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    function ({ addUtilities }) {
      addUtilities({
        ".mask-top-to-middle-25": {
          maskImage: "linear-gradient(to bottom, black 25%, transparent)",
          WebkitMaskImage: "linear-gradient(to bottom, black 25%, transparent)",
        },
        ".mask-top-to-middle-50": {
          maskImage: "linear-gradient(to bottom, black 50%, transparent)",
          WebkitMaskImage: "linear-gradient(to bottom, black 50%, transparent)",
        },
        ".mask-top-to-middle-75": {
          maskImage: "linear-gradient(to bottom, black 75%, transparent)",
          WebkitMaskImage: "linear-gradient(to bottom, black 75%, transparent)",
        },
        ".mask-bottom-to-top-25": {
          maskImage: "linear-gradient(to top, black 25%, transparent)",
          WebkitMaskImage: "linear-gradient(to top, black 25%, transparent)",
        },
        ".mask-bottom-to-top-50": {
          maskImage: "linear-gradient(to top, black 50%, transparent)",
          WebkitMaskImage: "linear-gradient(to top, black 50%, transparent)",
        },
        ".mask-bottom-to-top-75": {
          maskImage: "linear-gradient(to top, black 75%, transparent)",
          WebkitMaskImage: "linear-gradient(to top, black 75%, transparent)",
        },
      });
    },
  ],
};
