import type { Metadata } from "next";
import { IBM_Plex_Sans, IBM_Plex_Sans_Condensed } from "next/font/google";
import "./globals.css";

const perkoMain = IBM_Plex_Sans({
  variable: "--font-main",
  subsets: ["latin"],
});

const perkoThin = IBM_Plex_Sans_Condensed({
  weight: "300",
  variable: "--font-thin",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Perko",
  description: "Loyalty cards, one wallet.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${perkoMain.variable} ${perkoThin.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
