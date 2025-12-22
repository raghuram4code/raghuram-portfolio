/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                inter: ['Inter', 'sans-serif'],
            },
            colors: {
                // Define custom brand colors
                'gray-900': '#111827',
                'gray-800': '#1f2937',
                'indigo-600': '#4f46e5',
                'indigo-500': '#6366f1',
            }
        },
    },
    plugins: [],
}