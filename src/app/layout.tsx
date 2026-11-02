import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://convention-temp.kr"),
  title: {
    default: "국방컨벤션 공지사항",
    template: "%s | 국방컨벤션",
  },
  description: "국방컨벤션 공지사항입니다",
  openGraph: {
    type: "website",
    locale: "ko_KR",
    siteName: "국방컨벤션",
    title: "국방컨벤션 공지사항",
    description: "국방컨벤션 공지사항입니다",
    images: ["/og-default.png"],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
