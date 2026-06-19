import type { Metadata } from "next";
import { Inter, Roboto } from "next/font/google";
import "./globals.css";
import {SITE_CONFIG} from "@/constants/config";

const inter = Inter({subsets: ["latin"]});
const roboto = Roboto({subsets: ["latin"], weight: ["400", "500", "700"]});

export const metadata: Metadata = {
  title: SITE_CONFIG.brandName,
};

export default function RootLayout({
    children,
                                   } : Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <html lang="en" className="light">
        <body className={inter.className}>
          {children}
        </body>
      </html>
  );
}