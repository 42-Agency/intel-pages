import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Unily AEO/GEO Intel Report | 42 Agency",
  description: "AI Engine Optimization report for Unily - analyzing visibility across ChatGPT, Perplexity, and Gemini for employee experience platform and enterprise intranet queries.",
  openGraph: {
    title: "Unily AEO/GEO Intel Report | 42 Agency",
    description: "AI Engine Optimization report for Unily - analyzing visibility across ChatGPT, Perplexity, and Gemini.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
