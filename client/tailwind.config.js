/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    'node_modules/flowbite-react/lib/esm/**/*.js',
  ],
  theme: {
    extend: {
			colors: {
				"dark-layer-1": "rgb(40,40,40)",
				"dark-layer-2": "rgb(26,26,26)",
        "dark-layer-3": "rgb(107,107,107)",
				"dark-label-2": "rgba(239, 241, 246, 0.75)",
				"dark-divider-border-2": "rgb(61, 61, 61)",
				"dark-fill-2": "hsla(0,0%,100%,.14)",
				"dark-fill-3": "hsla(0,0%,100%,.1)",
        "dark-fill-4": "hsla(0,0%,100%,.2)",
				"dark-gray-6": "rgb(138, 138, 138)",
				"dark-gray-7": "rgb(179, 179, 179)",
				"gray-8": "rgb(38, 38, 38)",
				"dark-gray-8": "rgb(219, 219, 219)",
				"brand-orange": "#f57c01",
				"brand-orange-s": "#f59737",
				"dark-yellow": "rgb(255 192 30)",
				"dark-pink": "#EF4743",
				"olive": "rgb(0, 184, 163)",
				"dark-green-s": "rgb(44 187 93)",
        "light-green-s": "rgb(80 200 120)",
				"dark-blue-s": "rgb(10 132 255)",
			},
		},
  },
  plugins: ['flowbite/plugin'],
}

