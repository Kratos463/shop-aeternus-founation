/** @type {import('next').NextConfig} */

const nextConfig = {
  env: {
    API_URL:process.env.API_URL || "https://test.aeternus.foundation" ,
    API_KEY: process.env.API_KEY 
  },
};

module.exports = nextConfig;
