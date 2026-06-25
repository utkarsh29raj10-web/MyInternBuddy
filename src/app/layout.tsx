import type { Metadata } from "next";
import { Google_Sans, Afacad, Darker_Grotesque } from "next/font/google";
import "./globals.css";
import {SITE_CONFIG} from "@/constants/config";

const afacad = Afacad({
    subsets: ["latin"],
    variable: "--font-afacad",
});

const googleSans = Google_Sans({
    subsets: ["latin"],
    variable: "--font-google-sans"
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
        <body className={`${googleSans.variable} ${afacad.variable} ${darkerGrotesque.variable} antialiased`}>
          {children}
        </body>
      </html>
  );
}