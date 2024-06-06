// vite.config.js
export default {
  server: {
    fs: {
      allow: ['..'], // This allows all parent directories
    },
  },
};
