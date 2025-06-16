// src/components/common/Search.tsx

/**
 * @file Search.tsx
 * @brief 검색 입력 필드 컴포넌트를 정의합니다.
 *
 * 이 컴포넌트는 사용자로부터 텍스트 입력을 받아
 * 할 일 추가 등에 활용될 수 있도록 합니다.
 * 입체적인 시각 효과를 위해 그림자 배경을 함께 렌더링합니다.
 */

import React from "react";
import styles from "./Search.module.css"; // CSS 모듈 임포트

/**
 * SearchProps 인터페이스
 * Search 컴포넌트가 받을 props의 타입을 정의합니다.
 */
interface SearchProps {
  value: string; // 입력 필드의 현재 값
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; // 입력 값이 변경될 때 호출될 핸들러 함수
}

/**
 * Search 컴포넌트
 *
 * 사용자에게 텍스트를 입력할 수 있는 검색 필드를 제공합니다.
 * `value`와 `onChange` prop을 통해 제어되는(controlled) 컴포넌트로 동작합니다.
 *
 * @param {SearchProps} { value, onChange } - 입력 필드의 값과 변경 이벤트 핸들러
 * @returns {JSX.Element} 검색 입력 필드 JSX 요소
 */
const Search: React.FC<SearchProps> = ({ value, onChange }) => {
  return (
    <div className={styles.searchContainer}>
      {/*
       * .ShadowBackground: 입체적인 시각 효과를 위한 그림자 배경 요소
       * CSS에서 position: absolute와 z-index를 통해 입력 필드 뒤에 배치됩니다.
       */}
      <div className={styles.ShadowBackground}></div>
      {/*
       * 실제 텍스트 입력 필드
       * type="text": 일반 텍스트 입력
       * placeholder: 입력 필드가 비어있을 때 표시되는 안내 텍스트
       * value: React 상태와 연결되어 입력 필드의 현재 값을 제어
       * onChange: 입력 값이 변경될 때마다 부모 컴포넌트의 상태를 업데이트하는 함수 호출
       */}
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
