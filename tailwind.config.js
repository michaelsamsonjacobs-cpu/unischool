/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                crimson: {
                    DEFAULT: '#8B2332',
                    dark: '#6B1A26',
                    light: '#A8324C',
                },
                gold: {
                    DEFAULT: '#C9B47C',
                    bright: '#E5C97A',
                    dark: '#A89560',
                },
                midnight: '#0A1628',
            },
            fontFamily: {
                sora: ["Sora", "sans-serif"],
                inter: ["Inter", "sans-serif"],
            },
        },
    },
    plugins: [],
}
