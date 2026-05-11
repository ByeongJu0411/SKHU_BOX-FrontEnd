import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SKHU BOX",
  description: "성공회대 사물함 관리 서비스",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: "#fff",
              color: "#191f28",
              fontSize: "14px",
              fontWeight: 600,
              borderRadius: "12px",
              padding: "14px 20px",
              boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
            },
            success: {
              iconTheme: { primary: "#69db7c", secondary: "#fff" },
            },
            error: {
              iconTheme: { primary: "#f04452", secondary: "#fff" },
            },
          }}
        />
        {children}
      </body>
    </html>
  );
}
