export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        priority: {
          low: '#4CAF50',
          medium: '#FFA000',
          high: '#F44336'
        }
      }
    },
  },
  plugins: [],
}