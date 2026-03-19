import type { Metadata } from "next";
import AppFooter from "@/components/AppFooter/AppFooter";
import AppHeader from "@/components/AppHeader/AppHeader";
import "./globals.scss";

export const metadata: Metadata = {
  title: "TMDB AI RECO",
  description: "Cinematic discovery and AI-powered recommendation experience.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <link
          rel="stylesheet"
          as="style"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css"
        />
      </head>
      <body>
        <AppHeader />
        {children}
        <AppFooter />
      </body>
    </html>
  );
}
