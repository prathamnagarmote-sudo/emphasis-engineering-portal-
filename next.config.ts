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
      // .php Legacy Redirects (Crucial for Google Search Results)
      {
        source: "/about.php",
        destination: "/about",
        permanent: true,
      },
      {
        source: "/contact.php",
        destination: "/contact",
        permanent: true,
      },
      {
        source: "/team.php",
        destination: "/about",
        permanent: true,
      },
      {
        source: "/our-testimonial.php",
        destination: "/testimonials",
        permanent: true,
      },
      {
        source: "/dashboard.php",
        destination: "/dashboard",
        permanent: true,
      },
      {
        source: "/uk-chartered.php",
        destination: "/services/ICE",
        permanent: true,
      },
      {
        source: "/us-professional-engineer.php",
        destination: "/services/NCEES",
        permanent: true,
      },
      // General Search Result Redirects
      {
        source: "/uk-chartered",
        destination: "/services/ICE",
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
      // Ensure about and contact are perfectly mapped
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
