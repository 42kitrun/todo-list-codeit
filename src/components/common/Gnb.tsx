// src/components/common/Gnb.tsx

"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "./Gnb.module.css";
// Search 컴포넌트 임포트 제거 (Gnb에서 직접 렌더링하지 않음)
// import Search from './Search';
import LogoLarge from "../../../public/img/doit-large.svg";

// Gnb 컴포넌트는 이제 어떤 프롭스도 받지 않습니다.
// interface GnbProps { onAddTask: (taskTitle: string) => void; }

const Gnb = () => {
  // handleSearch 함수는 이제 필요 없으므로 제거 (Search 컴포넌트가 Gnb 외부에 있으므로)
  // const handleSearch = (query: string) => { console.log('Search Query:', query); };

  return (
    <nav className={styles.gnbContainer}>
      <Link href="/" className={styles.logoLink}>
        <Image
          src={LogoLarge} // doit-large.svg 이미지 사용
          alt="Do It Todo List Logo"
          // width={150} // 이미지의 적절한 너비 설정 (Gnb 시안에 맞춰)
          // height={30} // 이미지의 적절한 높이 설정
          priority
        />
      </Link>
      {/* Search 컴포넌트를 렌더링하는 div 제거 */}
      {/* <div className={styles.searchWrapper}>
        <Search onAddTask={onAddTask} />
      </div> */}
    </nav>
  );
};

export default Gnb;
