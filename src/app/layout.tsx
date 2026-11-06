import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
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
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="min-h-screen bg-surface-page text-text-primary antialiased flex flex-col">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <Navbar />
          <div className="flex-1">{children}</div>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}

