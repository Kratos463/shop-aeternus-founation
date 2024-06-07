// @type {import('next').NextConfig}
const nextConfig = {
  // Redirect all root traffic to the login page (optional)
  redirects: async () => [
    {
      source: '/',
      destination: '/auth/login',
      permanent: true, 
    },
  ],

  // Environment variable configuration
  env: {
    API_URL: process.env.API_URL || 'http://localhost:9000',
    API_KEY: process.env.API_KEY,
  },
};

module.exports = nextConfig;
