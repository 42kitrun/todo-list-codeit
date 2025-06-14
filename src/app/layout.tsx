// src/app/layout.tsx
import type { Metadata } from "next/types";
import localFont from "next/font/local";
import "./globals.css"; // 전역 스타일 임포트
import Gnb from "@/components/common/Gnb"; // Gnb 컴포넌트 임포트
import styles from "./layout.module.css"; // 새로운 layout.module.css 임포트

// NanumSquare 폰트 로드
const nanumSquareR = localFont({
  src: "../../public/fonts/NanumSquareR.ttf",
  display: "swap",
  variable: "--font-nanum-square-regular",
});

const nanumSquareB = localFont({
  src: "../../public/fonts/NanumSquareB.ttf",
  display: "swap",
  variable: "--font-nanum-square-bold",
});

export const metadata: Metadata = {
  title: "Todo-List Codeit",
  description: "Codeit Assignment - Todo List Application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${nanumSquareR.variable} ${nanumSquareB.variable}`}
    >
      <body>
        <Gnb />
        {children}
      </body>
    </html>
  );
}
