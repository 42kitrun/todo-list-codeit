// src/styles/fonts.ts
import localFont from "next/font/local";

export const nanumSquareRegular = localFont({
  src: "../../public/fonts/NanumSquareR.ttf", // public/fonts 폴더 내 NanumSquareR.ttf 경로
  weight: "400",
  style: "normal",
  display: "swap",
  variable: "--font-nanum-square-regular",
});

export const nanumSquareBold = localFont({
  src: "../../public/fonts/NanumSquareB.ttf", // public/fonts 폴더 내 NanumSquareB.ttf 경로
  weight: "700", // 시안의 font-weight: 700과 일치
  style: "normal",
  display: "swap",
  variable: "--font-nanum-square-bold",
});
