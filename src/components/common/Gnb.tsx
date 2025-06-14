// src/components/common/Gnb.tsx
"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import styles from "./Gnb.module.css";
import LogoLarge from "../../../public/img/doit-large.svg"; // 큰 로고 이미지
import LogoSmall from "../../../public/img/doit-small.svg"; // 작은 로고 이미지

const Gnb = () => {
  const [isMobile, setIsMobile] = useState(false); // 모바일 상태 관리

  // 클라이언트 측에서만 실행되도록 useEffect 사용
  useEffect(() => {
    const handleResize = () => {
      // 모바일 너비 375px을 기준으로 판단 (시안 정보)
      setIsMobile(window.innerWidth <= 375);
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // 초기 로드 시에도 한 번 실행

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogoClick = () => {
    // 기획 요구사항: '로고' 버튼을 클릭하면 '/' 페이지로 이동합니다. (새로고침)
    window.location.href = "/";
    window.location.reload();
  };

  return (
    <nav className={styles.gnbContainer}>
      <div className={styles.logoContainer}>
        <button onClick={handleLogoClick}>
          <Image
            src={isMobile ? LogoSmall : LogoLarge} // 모바일이면 small, 아니면 large 로고 사용
            alt="Do It Todo List Logo"
            // 시안 정보를 기반으로 로고 크기 설정
            width={isMobile ? 71 : 151} // 모바일 71px, 태블릿/데스크탑 151px
            height={40} // 모든 해상도에서 40px
            priority
          />
        </button>
      </div>
    </nav>
  );
};

export default Gnb;
