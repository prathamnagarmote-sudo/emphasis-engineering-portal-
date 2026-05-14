import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/terms",
        destination: "/terms-of-service",
        permanent: true,
      },
      // Legacy Search Result Redirects
      {
        source: "/about-us",
        destination: "/about",
        permanent: true,
      },
      {
        source: "/contact-us",
        destination: "/contact",
        permanent: true,
      },
      {
        source: "/uk-chartered-engineer",
        destination: "/services/ICE",
        permanent: true,
      },
      {
        source: "/us-professional-engineer",
        destination: "/services/NCEES",
        permanent: true,
      },
      {
        source: "/team",
        destination: "/about",
        permanent: true,
      },
      {
        source: "/our-testimonial",
        destination: "/testimonials",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
