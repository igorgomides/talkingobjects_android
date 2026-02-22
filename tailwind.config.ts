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
            },
            boxShadow: {
                'neon-purple': '0 0 10px rgba(168, 85, 247, 0.5), 0 0 20px rgba(168, 85, 247, 0.3)',
                'neon-blue': '0 0 10px rgba(59, 130, 246, 0.5), 0 0 20px rgba(59, 130, 246, 0.3)',
                'neon-pink': '0 0 10px rgba(236, 72, 153, 0.5), 0 0 20px rgba(236, 72, 153, 0.3)',
                'bubbly-purple': '0 6px 0 0 #581c87, 0 15px 20px rgba(168, 85, 247, 0.4)',
                'bubbly-blue': '0 6px 0 0 #1e3a8a, 0 15px 20px rgba(59, 130, 246, 0.4)',
                'bubbly-green': '0 6px 0 0 #14532d, 0 15px 20px rgba(34, 197, 94, 0.4)',
            }
        },
    },
    plugins: [],
};
export default config;
