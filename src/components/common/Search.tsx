// src/components/common/Search.tsx

"use client";

import React, { useState } from "react";
import styles from "./Search.module.css";
import Button from "../todo/Button"; // Button 컴포넌트 임포트

interface SearchProps {
  // onSearch: (query: string) => void; // 기존 검색 기능 프롭스 (이제 할 일 추가 기능으로 변경될 수 있음)
  onAddTask: (taskTitle: string) => void; // 새로운 할 일 추가를 위한 프롭스
}

const Search: React.FC<SearchProps> = ({ onAddTask }) => {
  // onAddTask 프롭스 받기
  const [taskTitle, setTaskTitle] = useState(""); // 입력 필드 상태

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTaskTitle(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // 폼 기본 제출 동작 방지
    if (taskTitle.trim()) {
      // 입력값이 비어있지 않은지 확인
      onAddTask(taskTitle.trim()); // 상위 컴포넌트로 할 일 제목 전달
      setTaskTitle(""); // 입력 필드 초기화
    }
  };

  return (
    <form className={styles.searchForm} onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="할 일을 입력해주세요" // 시안에 맞는 플레이스홀더
        className={styles.searchInput}
        value={taskTitle}
        onChange={handleChange}
      />
      <Button
        variant="addInitial" // 시안 이미지에 보이는 "+ 추가하기" 버튼과 유사한 variant
        icon="plus" // "+ 추가하기" 버튼의 아이콘
        type="submit" // 폼 제출 버튼
        disabled={!taskTitle.trim()} // 입력값이 없으면 버튼 비활성화
      >
        추가하기
      </Button>
    </form>
  );
};

export default Search;
