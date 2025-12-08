import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "var(--background)",
                foreground: "var(--foreground)",
                giki: {
                    blue: "#002147", // Deep Navy
                    gold: "#B3A369", // Metallic Gold
                    light: "#F5F5F7", // Apple Gray / Off-white
                },
                apple: {
                    gray: "#F5F5F7",
                    blue: "#0071e3",
                }
            },
            fontFamily: {
                sans: ["var(--font-inter)", "sans-serif"],
            },
            backgroundImage: {
                "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
                "hero-gradient": "linear-gradient(180deg, rgba(0,33,71,1) 0%, rgba(0,20,40,1) 100%)",
            },
            boxShadow: {
                'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
                'soft': '0 20px 40px -15px rgba(0, 0, 0, 0.1)',
            }
        },
    },
    plugins: [],
};
export default config;
