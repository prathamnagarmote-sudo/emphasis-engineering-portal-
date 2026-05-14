import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import Providers from "./Providers";

export const metadata: Metadata = {
  title: {
    default: "Emphasis Engineering | Professional Licensure & Mentorship",
    template: "%s | Emphasis Engineering"
  },
  description:
    "Expert-led engineering licensure support, NPPE/PE exam preparation, and professional mentorship for ICE (UK), P.Eng (Canada), and NCEES (USA) certifications.",
  keywords: ["Engineering Licensure", "CEng UK", "P.Eng Canada", "NPPE Exam Prep", "NCEES PE Exam", "ICE Mentorship", "Engineering Career Guidance"],
  authors: [{ name: "Emphasis Engineering" }],
  creator: "Emphasis Engineering",
  publisher: "Emphasis Engineering",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_CA",
    url: "https://emphasisengineering.com",
    siteName: "Emphasis Engineering",
    title: "Emphasis Engineering | Professional Licensure & Mentorship",
    description: "Empowering engineers with expert-led courses, practice tests, and professional certification services.",
    images: [
      {
        url: "https://res.cloudinary.com/dwk1cnlw2/image/upload/v1775721626/logo-nobackground-500_prbht7.png",
        width: 1200,
        height: 630,
        alt: "Emphasis Engineering",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Emphasis Engineering | Professional Licensure & Mentorship",
    description: "Expert-led engineering licensure support and certification services.",
    images: ["https://res.cloudinary.com/dwk1cnlw2/image/upload/v1775721626/logo-nobackground-500_prbht7.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Poppins:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
