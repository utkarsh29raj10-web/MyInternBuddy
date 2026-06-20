import type { Metadata } from "next";
import { Inter, Afacad, Darker_Grotesque } from "next/font/google";
import "./globals.css";
import {SITE_CONFIG} from "@/constants/config";

const afacad = Afacad({
    subsets: ["latin"],
    variable: "--font-afacad",
});

const inter = Inter({
    subsets: ["latin"],
    variable: "--font-inter"
});

const darkerGrotesque = Darker_Grotesque({
    subsets: ["latin"],
    variable: "--font-darker-grotesque",
});

export const metadata: Metadata = {
    title: SITE_CONFIG.brandName,
};

export default function RootLayout({
    children,
                                   } : Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <html lang="en" suppressHydrationWarning>
        <body className={`${inter.variable} ${afacad.variable} ${darkerGrotesque.variable} antialiased`}>
          {children}
        </body>
      </html>
  );
}