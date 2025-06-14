// src/components/common/Search.tsx
import React from "react";
// import Image from "next/image"; // Image 컴포넌트 더 이상 사용하지 않음
import styles from "./Search.module.css";

interface SearchProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Search: React.FC<SearchProps> = ({ value, onChange }) => {
  return (
    <div className={styles.searchContainer}>
      <div className={styles.ShadowBackground}></div>
      <input
        type="text"
        placeholder="할 일을 입력해주세요"
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

export default Search;
