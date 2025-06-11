// src/components/common/Gnb.tsx

"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "./Gnb.module.css";
import LogoLarge from "../../../public/img/doit-large.svg";

const Gnb = () => {
  return (
    <nav className={styles.gnbContainer}>
      <Link href="/" className={styles.logoLink}>
        <Image
          src={LogoLarge}
          alt="Do It Todo List Logo"
          width={100} // 시안 (image_3c3923.png)에 맞춰 적절한 너비 설정 (예: 100px)
          height={20} // 시안에 맞춰 적절한 높이 설정 (예: 20px, 비율에 따라 조정)
          priority
        />
      </Link>
    </nav>
  );
};

export default Gnb;
