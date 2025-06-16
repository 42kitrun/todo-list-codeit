// src/components/common/Gnb.tsx

"use client"; // 이 파일이 클라이언트 측에서 렌더링됨을 명시

/**
 * @file Gnb.tsx
 * @brief 전역 내비게이션 바(Global Navigation Bar) 컴포넌트입니다.
 *
 * 이 컴포넌트는 애플리케이션의 상단에 표시되며,
 * 반응형 로고 (모바일/데스크톱에 따라 다른 이미지)를 렌더링하고,
 * 로고 클릭 시 메인 페이지로 이동하는 기능을 제공합니다.
 */

import React, { useState, useEffect } from "react";
import Image from "next/image"; // Next.js Image 컴포넌트
import styles from "./Gnb.module.css"; // CSS 모듈 임포트
import LogoLarge from "../../../public/img/doit-large.svg"; // 데스크톱/태블릿용 큰 로고 이미지
import LogoSmall from "../../../public/img/doit-small.svg"; // 모바일용 작은 로고 이미지

/**
 * Gnb 컴포넌트
 * 애플리케이션의 최상단 내비게이션 바를 렌더링합니다.
 */
const Gnb = () => {
  // `isMobile` 상태는 현재 뷰포트가 모바일 크기인지 여부를 저장합니다.
  const [isMobile, setIsMobile] = useState(false);

  /**
   * useEffect 훅을 사용하여 클라이언트 측에서만 뷰포트 너비를 감지하고
   * `isMobile` 상태를 업데이트합니다.
   * 이는 서버 사이드 렌더링(SSR) 시 `window` 객체에 접근하는 문제를 방지합니다.
   */
  useEffect(() => {
    // 뷰포트 크기가 변경될 때 호출될 핸들러 함수
    const handleResize = () => {
      // 뷰포트 너비가 375px 이하(모바일 시안 기준)이면 `isMobile`을 true로 설정
      setIsMobile(window.innerWidth <= 375);
    };

    // 'resize' 이벤트 리스너를 추가하여 뷰포트 크기 변경 감지
    window.addEventListener("resize", handleResize);
    handleResize(); // 컴포넌트가 마운트될 때 초기 크기 설정을 위해 한 번 호출

    // 컴포넌트 언마운트 시 이벤트 리스너 제거 (클린업 함수)
    return () => window.removeEventListener("resize", handleResize);
  }, []); // 의존성 배열이 비어 있으므로 컴포넌트 마운트 시 한 번만 실행

  /**
   * 로고 클릭 핸들러
   * 기획 요구사항에 따라 로고 클릭 시 메인 페이지('/')로 이동하고 새로고침합니다.
   */
  const handleLogoClick = () => {
    // `window.location.href`를 변경하여 페이지를 리디렉션하고 새로고침
    window.location.href = "/";
    window.location.reload(); // 명시적 새로고침
  };

  return (
    // `nav` 태그를 사용하여 내비게이션 영역임을 명시
    <nav className={styles.gnbContainer}>
      <div className={styles.logoContainer}>
        {/*
         * 로고 이미지 버튼
         * 클릭 시 `handleLogoClick` 함수가 실행됩니다.
         */}
        <button onClick={handleLogoClick}>
          <Image
            // 뷰포트 크기에 따라 다른 로고 이미지 사용 (isMobile 상태에 따라 동적 변경)
            src={isMobile ? LogoSmall : LogoLarge}
            alt="Do It Todo List Logo" // 이미지의 대체 텍스트 (SEO 및 접근성)
            // 시안 정보를 기반으로 로고의 너비 설정 (isMobile 상태에 따라 동적 변경)
            width={isMobile ? 71 : 151} // 모바일(375px 이하)일 때 71px, 그 외 151px
            height={40} // 모든 해상도에서 40px 높이 유지
            priority // 이 이미지는 페이지 로드 시 가장 먼저 로드되도록 우선순위 부여
          />
        </button>
      </div>
    </nav>
  );
};

export default Gnb;
