/** @type {import('next').NextConfig} */
const nextConfig = {
    images:{
        domains: [
            'res.cloudinary.com'
        ]
        
    },async headers() {
        return [
            {
              // matching all API routes
               source: "/api/:path*",
               headers: [
                   { key: "Access-Control-Allow-Origin", value: "*" },
                    { key: "Access-Control-Allow-Methods", value: "GET, POST, PUT, DELETE, OPTIONS" },
                    { key: "Access-Control-Allow-Credentials", value: "true" },
                    { key: "Access-Control-Allow-Headers", value: "Origin, X-Requested-With, Content-Type, Accept" },
                 ]
            }
        ]
    }
}

module.exports = nextConfig
