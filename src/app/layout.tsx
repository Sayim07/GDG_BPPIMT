import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { AgentationProvider } from "@/components/dev/agentation-provider";

const productSans = localFont({
  src: [
    {
      path: "../../public/fonts/ProductSans-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/ProductSans-Italic.woff2",
      weight: "400",
      style: "italic",
    },
    {
      path: "../../public/fonts/ProductSans-Bold.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../public/fonts/ProductSans-BoldItalic.woff2",
      weight: "700",
      style: "italic",
    },
  ],
  variable: "--font-product-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "GDG on Campus BPPIMT",
    template: "%s | GDG on Campus BPPIMT",
  },
  description:
    "Official community portal for Google Developer Groups on Campus at B.P. Poddar Institute of Management and Technology, Kolkata.",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "GDG on Campus BPPIMT",
    description: "Connect, Learn, Grow with Google Developer Groups on Campus BPPIMT.",
    url: "https://gdgbppimt.vercel.app",
    siteName: "GDG on Campus BPPIMT",
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={productSans.variable}>
      <body className="min-h-screen bg-surface-page text-text-primary antialiased flex flex-col">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <Navbar />
          <div className="flex-1">{children}</div>
          <Footer />
          <AgentationProvider />
        </ThemeProvider>
      </body>
    </html>
  );
}

