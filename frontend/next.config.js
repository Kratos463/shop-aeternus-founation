/** @type {import('next').NextConfig} */

const nextConfig = {
  env: {
    API_URL:process.env.API_URL || "http://localhost:9000" ,
    API_KEY: process.env.API_KEY 
  },
};

module.exports = nextConfig;
