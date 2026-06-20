import type { Metadata } from "next";
import { Outfit, Roboto } from "next/font/google";
import "./globals.css";
import {SITE_CONFIG} from "@/constants/config";

const outfit = Outfit({
    subsets: ["latin"],
    variable: "--font-sans"
});
const roboto = Roboto({
    subsets: ["latin"],
    weight: ["400", "500", "700"],
    variable: "--font-heading",
});

export const metadata: Metadata = {
    title: SITE_CONFIG.brandName
};

export default function RootLayout({
    children,
                                   } : Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <html lang="en" className="light">
        <body className={`${outfit.variable} ${roboto.variable} font-sans-antialiased`}>
          {children}
        </body>
      </html>
  );
}