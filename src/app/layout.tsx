import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { AgentationProvider } from "@/components/dev/agentation-provider";
import GDGPreloader from "@/components/GDGPreloader";

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
  width: "device-width",
  initialScale: 1,
};

const productSans = localFont({
  src: [
    {
      path: "../../public/fonts/ProductSans-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/ProductSans-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-product-sans",
  display: "swap",
});

const SITE_URL = "https://bppimtgdg.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "GDG BPPIMT — Google Developer Groups on Campus BPPIMT Kolkata",
    template: "%s | GDG BPPIMT",
  },
  description:
    "Official website of GDG BPPIMT (Google Developer Groups on Campus at B.P. Poddar Institute of Management and Technology, Kolkata). Explore developer workshops, hackathons, open source projects, and tech events.",
  keywords: [
    "GDG BPPIMT",
    "gdg bppimt",
    "GDG On Campus BPPIMT",
    "Google Developer Groups BPPIMT",
    "BPPIMT GDG",
    "B.P. Poddar Institute of Management and Technology",
    "BPPIMT Kolkata",
    "GDG Kolkata",
    "Google Developer Groups Kolkata",
    "Google Developer Student Club BPPIMT",
    "GDSC BPPIMT",
    "BPPIMT Tech Community",
    "GDG BPPIMT Events",
    "GDG BPPIMT Team",
    "Google Developers India",
  ],
  authors: [{ name: "GDG on Campus BPPIMT Core Team", url: `${SITE_URL}/team` }],
  creator: "GDG on Campus BPPIMT",
  publisher: "Google Developer Groups on Campus BPPIMT",
  alternates: {
    canonical: SITE_URL,
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon.png", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png" },
    ],
  },
  openGraph: {
    title: "GDG BPPIMT — Google Developer Groups on Campus BPPIMT",
    description:
      "Connect, Learn, and Grow with Google Developer Groups on Campus at B.P. Poddar Institute of Management and Technology, Kolkata.",
    url: SITE_URL,
    siteName: "GDG BPPIMT",
    images: [
      {
        url: "/images/gdg-logo-square.png",
        width: 512,
        height: 512,
        alt: "GDG on Campus BPPIMT Official Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "GDG BPPIMT — Google Developer Groups on Campus BPPIMT",
    description:
      "Official community portal for Google Developer Groups on Campus at B.P. Poddar Institute of Management and Technology, Kolkata.",
    creator: "@gdg_bppimt",
    images: ["/images/gdg-logo-square.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      "url": SITE_URL,
      "name": "GDG BPPIMT",
      "alternateName": [
        "GDG on Campus BPPIMT",
        "Google Developer Groups BPPIMT",
        "BPPIMT GDG",
        "GDG B.P. Poddar",
      ],
      "description":
        "Official community portal of Google Developer Groups on Campus at B.P. Poddar Institute of Management and Technology, Kolkata.",
      "inLanguage": "en-US",
      "publisher": {
        "@id": `${SITE_URL}/#organization`,
      },
    },
    {
      "@type": ["EducationalOrganization", "Organization"],
      "@id": `${SITE_URL}/#organization`,
      "name": "GDG BPPIMT",
      "alternateName": [
        "GDG on Campus BPPIMT",
        "Google Developer Groups on Campus B.P. Poddar Institute of Management and Technology",
        "Google Developer Student Club BPPIMT",
        "GDSC BPPIMT",
        "BPPIMT GDG",
      ],
      "url": SITE_URL,
      "logo": {
        "@type": "ImageObject",
        "url": `${SITE_URL}/images/gdg-logo-square.png`,
        "width": 512,
        "height": 512,
      },
      "image": `${SITE_URL}/images/gdg-logo-square.png`,
      "description":
        "Official student-led tech community supported by Google Developers at B.P. Poddar Institute of Management and Technology (BPPIMT), Kolkata.",
      "parentOrganization": {
        "@type": "CollegeOrUniversity",
        "name": "B.P. Poddar Institute of Management and Technology",
        "url": "http://www.bppimt.ac.in",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "137, V.I.P. Road, Poddar Vihar",
          "addressLocality": "Kolkata",
          "addressRegion": "West Bengal",
          "postalCode": "700052",
          "addressCountry": "IN",
        },
      },
      "sameAs": [
        "https://gdg.community.dev/gdg-on-campus-b-p-poddar-institute-of-management-and-technology-kolkata-india/",
        "https://www.linkedin.com/company/gdg-bppimt/",
        "https://github.com/Sayim07/GDG_BPPIMT",
        "https://www.instagram.com/gdg_bppimt",
        "https://x.com/gdg_bppimt",
      ],
      "contactPoint": {
        "@type": "ContactPoint",
        "contactType": "Community Support",
        "url": "https://gdg.community.dev/gdg-on-campus-b-p-poddar-institute-of-management-and-technology-kolkata-india/",
      },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth" className={productSans.variable}>
      <body className="min-h-screen bg-surface-page text-text-primary antialiased flex flex-col">
        <script
          id="organization-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <GDGPreloader />
          <Navbar />
          <div className="flex-1">{children}</div>
          <Footer />
          <AgentationProvider />
        </ThemeProvider>
      </body>
    </html>
  );
}

