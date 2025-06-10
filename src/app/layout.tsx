import type { Metadata } from "next";
import { nanumSquareRegular, nanumSquareBold } from "../styles/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Todo-List-Codeit",
  description: "Todo-List-Codeit project",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="ko"
      className={`${nanumSquareRegular.variable} ${nanumSquareBold.variable}`}
    >
      <body className={nanumSquareRegular.className}>
        {" "}
        {/* 기본 폰트를 Regular로 설정 */}
        {children}
      </body>
    </html>
  );
}
