import type { Metadata } from "next";
import { IBM_Plex_Sans, IBM_Plex_Sans_Condensed, Geist } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { AuthProvider } from "./context/AuthContext";

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' });

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
  description: "Loyalty cards",
  icons: {
    icon: "/perkologo.ico",
    shortcut: "/perkologo.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", perkoMain.variable, perkoThin.variable, "font-sans", geist.variable)}
    >
      <body className="min-h-full flex flex-col">
        <AuthProvider>
          {children}
        </AuthProvider>

      </body>
    </html>
  );
}
