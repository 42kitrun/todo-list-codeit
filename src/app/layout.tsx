// src/app/layout.tsx

import type { Metadata } from "next";
import "./globals.css";
import Gnb from "../components/common/Gnb";

// Next.js 로컬 폰트 설정
import localFont from "next/font/local";

// public/fonts 디렉토리에 있는 NanumSquareB.ttf (Bold)와 NanumSquareR.ttf (Regular) 파일을 사용
const nanumSquare = localFont({
  src: [
    {
      path: "../../public/fonts/NanumSquareR.ttf", // Regular 폰트 파일 경로
      weight: "400", // 시안에 'Regular'로 명시된 폰트 웨이트
      style: "normal",
    },
    {
      path: "../../public/fonts/NanumSquareB.ttf", // Bold 폰트 파일 경로
      weight: "700", // 시안에 'Bold'로 명시된 폰트 웨이트
      style: "normal",
    },
  ],
  variable: "--font-nanum-square", // CSS 변수 이름 설정
  display: "swap", // 폰트 로딩 전략
});

export const metadata: Metadata = {
  title: "Do it;", // todo-list-codeit 프로젝트 이름
  description: "할 일 목록 관리 앱",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // 폰트 변수를 <html> 태그의 className으로 적용
    <html lang="ko" className={nanumSquare.variable}>
      <body>
        <Gnb />
        {children}
      </body>
    </html>
  );
}
