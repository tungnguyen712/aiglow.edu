/** @type {import('tailwindcss').Config} */
export default {
    mode: "jit",
    darkMode: "class",
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            colors: {
                'scroll-thumb': '#000',
                'scroll-track': '#f1f1f1',
                'scroll-transparent': 'transparent',
            },
            scrollbar: {
                width: '2px',
                thumb: {
                    backgroundColor: '#f3f4f6',
                    borderRadius: '50%',
                },
                track: {
                    backgroundColor: '#f1f1f1',
                },
                transparentThumb: {
                    backgroundColor: 'transparent',
                },
                transparentTrack: {
                    backgroundColor: 'transparent',
                },
            },
        },
    },
    plugins: [
        function ({ addUtilities, theme }) {
            addUtilities({
                '.scrollbar': {
                    '&::-webkit-scrollbar': {
                        width: theme('scrollbar.width'),
                    },
                    '&::-webkit-scrollbar-thumb': {
                        backgroundColor: theme('scrollbar.thumb.backgroundColor'),
                        borderRadius: theme('scrollbar.thumb.borderRadius'),
                    },
                    '&::-webkit-scrollbar-track': {
                        backdropFilter: 'blur(8px)',
                        WebkitBackdropFilter: 'blur(8px)',
                    },
                },
                '.scrollbar-transparent': {
                    '&::-webkit-scrollbar': {
                        width: theme('scrollbar.width'),
                    },
                    '&::-webkit-scrollbar-thumb': {
                        backgroundColor: theme('scrollbar.transparentThumb.backgroundColor'),
                    },
                    '&::-webkit-scrollbar-track': {
                        backgroundColor: theme('scrollbar.transparentTrack.backgroundColor'),
                    },
                },
            })
        },
    ],
};