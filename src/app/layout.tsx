// src/app/layout.tsx

/**
 * @file layout.tsx
 * @brief Next.js 애플리케이션의 루트 레이아웃을 정의합니다.
 *
 * 이 파일은 앱의 모든 페이지에 공통적으로 적용될 HTML 구조,
 * 메타데이터, 전역 스타일, 커스텀 폰트, 그리고 최상단 내비게이션 바(Gnb)를 설정합니다.
 */

import type { Metadata } from "next/types"; // Next.js 메타데이터 타입 임포트
import localFont from "next/font/local"; // 로컬 폰트를 사용하기 위한 Next.js 폰트 로더
import "./globals.css"; // 전역 스타일시트 임포트 (모든 페이지에 적용)
import Gnb from "@/components/common/Gnb"; // Gnb(Global Navigation Bar) 컴포넌트 임포트

// --- 폰트 설정 ---
// Next.js의 `next/font/local`을 사용하여 로컬 폰트 파일을 로드합니다.
// `display: "swap"`은 폰트가 로드되기 전까지 시스템 폰트를 보여주어 텍스트 깜빡임을 줄입니다.
// `variable`을 통해 CSS 변수 형태로 폰트에 접근할 수 있게 합니다.

// NanumSquareR (Regular) 폰트 로드
const nanumSquareR = localFont({
  src: "../../public/fonts/NanumSquareR.ttf", // 폰트 파일 경로
  display: "swap", // 폰트 로딩 전략
  variable: "--font-nanum-square-regular", // CSS 변수명
});

// NanumSquareB (Bold) 폰트 로드
const nanumSquareB = localFont({
  src: "../../public/fonts/NanumSquareB.ttf", // 폰트 파일 경로
  display: "swap", // 폰트 로딩 전략
  variable: "--font-nanum-square-bold", // CSS 변수명
});

// --- 메타데이터 설정 ---
// `Metadata` 객체를 export하여 페이지의 <head> 태그에 메타데이터를 추가합니다.
// SEO(검색 엔진 최적화) 및 소셜 미디어 공유에 활용됩니다.
export const metadata: Metadata = {
  title: "Todo-List Codeit", // 페이지 타이틀
  description: "Codeit Assignment - Todo List Application", // 페이지 설명
};

/**
 * RootLayout 컴포넌트
 * Next.js 애플리케이션의 최상위 레이아웃 컴포넌트입니다.
 * 이 컴포넌트 내부에 `children`으로 모든 페이지 컨텐츠가 렌더링됩니다.
 *
 * @param {Readonly<{ children: React.ReactNode; }>} { children } - 렌더링될 페이지 컨텐츠
 * @returns {JSX.Element} HTML 문서 구조를 포함하는 JSX 요소
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // HTML 문서의 루트 요소
    <html
      lang="ko" // 문서 언어 설정 (한국어)
      // 로드된 폰트의 CSS 변수를 html 태그의 className으로 적용
      className={`${nanumSquareR.variable} ${nanumSquareB.variable}`}
    >
      <head>
        {/*
         * 뷰포트 메타 태그 설정 (반응형 웹 디자인에 필수)
         * - width=device-width: 페이지 너비를 기기의 화면 너비에 맞춥니다.
         * - initial-scale=1: 초기 확대/축소 레벨을 1배로 설정합니다.
         * 모바일 기기에서 웹 페이지가 올바르게 렌더링되도록 보장합니다.
         */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        {/* Gnb(Global Navigation Bar) 컴포넌트 - 모든 페이지 상단에 표시 */}
        <Gnb />
        {/* `children` prop은 현재 라우트의 페이지 컴포넌트가 렌더링되는 위치입니다. */}
        {children}
      </body>
    </html>
  );
}
