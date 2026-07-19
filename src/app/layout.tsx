import type { Metadata } from "next";
import { Google_Sans, Manrope, Darker_Grotesque } from "next/font/google";
import "./globals.css";
import {SITE_CONFIG} from "@/constants/config";
import {Providers} from "@/components/Providers";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const manrope = Manrope({
    subsets: ["latin"],
    variable: "--font-manrope",
});

const googleSans = Google_Sans({
    subsets: ["latin"],
    variable: "--font-google-sans"
});

// const darkerGrotesque = Darker_Grotesque({
//     subsets: ["latin"],
//     variable: "--font-darker-grotesque",
// });

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
            <body className={`${googleSans.variable} ${manrope.variable} ${googleSans.variable} antialiased`}>
                <script
                    dangerouslySetInnerHTML={{
                        __html: `
                          (function() {
                            try {
                              var theme = localStorage.getItem('theme');
                              if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                                document.documentElement.classList.add('dark');
                              } else {
                                document.documentElement.classList.remove('dark');
                                document.documentElement.classList.add('light');
                              }
                            } catch (e) {}
                          })();
                        `,
                    }}
                />
                <Providers>
                    <div className="flex flex-col min-h-screen">
                        <Navbar/>
                        <main className="flex-grow pt-28">
                            {children}
                        </main>
                        <Footer/>
                    </div>
                </Providers>
            </body>
        </html>
    );
}