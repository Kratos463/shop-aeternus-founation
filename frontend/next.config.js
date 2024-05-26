/** @type {import('next').NextConfig} */

// const nextConfig = {
//   env: {
//     API_URL: "https://multikart-graphql-reactpixelstrap.vercel.app/server.js",
//   },

//   // if you want to run with local graphQl un-comment below one and comment the above code
//   // env: {
//   //   API_URL: "http://localhost:4000/graphql",
//   // },
//   reactStrictMode: true,
// };

// module.exports = nextConfig;

const nextConfig = {
  env: {
    API_URL:process.env.API_URL || "http://localhost:9000" ,
    API_KEY: process.env.API_KEY || "ShopATERNO9073" ,
  },
};

module.exports = nextConfig;
