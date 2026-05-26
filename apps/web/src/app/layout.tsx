import type { Metadata } from "next";
import { IBM_Plex_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { ClientProviders } from "../components/providers/client-providers";

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700"],
});

const drukTextBold = localFont({
  src: "../../public/fonts/DrukText-Bold-Trial.otf",
  variable: "--font-druk-text-bold",
});

export const metadata: Metadata = {
  title: "KÖNIG URBAN",
  description: "Collection Artic 01",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${ibmPlexMono.variable} ${drukTextBold.variable} antialiased`}>
        <ClientProviders>
            {children}
        </ClientProviders>
      </body>
    </html>
  );
}
