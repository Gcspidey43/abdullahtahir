import type { Metadata, Viewport } from "next";
import { Bebas_Neue, Syne, DM_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const bebasNeue = Bebas_Neue({
  variable: "--font-bebas-neue",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Abdullah Tahir — Digital Designer | Brand Visuals · Web Solutions · Digital Solutions",
  description: "Abdullah Tahir is a Digital Designer from Pakistan specializing in brand visuals, web solutions, AI-powered digital solutions, and event designs including Pakistani weddings. 300+ projects delivered.",
  keywords: [
    "Digital Designer Pakistan",
    "Brand Visuals",
    "Web Solutions",
    "Pakistani Wedding Designer",
    "Graphic Designer",
    "Abdullah Tahir",
    "Event Design",
    "Islamic Design",
    "Ramadan Design",
    "Logo Design Pakistan",
    "Social Media Designer"
  ],
  authors: [{ name: "Abdullah Tahir" }],
  creator: "Abdullah Tahir",
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    type: "website",
    title: "Abdullah Tahir — Digital Designer",
    description: "Digital Designer crafting bold brand visuals, web solutions, and digital experiences that get results. 300+ projects delivered.",
    siteName: "Abdullah Tahir Portfolio",
    images: [
      {
        url: "/abdullah-hero.jpeg",
        width: 1200,
        height: 630,
        alt: "Abdullah Tahir — Digital Designer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Abdullah Tahir — Digital Designer",
    description: "Digital Designer crafting bold brand visuals, web solutions, and digital experiences.",
    images: ["/abdullah-hero.jpeg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${bebasNeue.variable} ${syne.variable} ${dmSans.variable} antialiased`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
