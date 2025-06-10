// src/app/page.tsx
"use client"; // 클라이언트 컴포넌트로 지정

import React, { useState } from "react"; // useState 훅을 사용하기 위해 import
import Button from "../components/Button"; // Button 컴포넌트 import
import ChecklistItem from "../components/todo/ChecklistItem"; // ChecklistItem 임포트

export default function Home() {
  const [isSubmitActive, setIsSubmitActive] = useState(false);
  const [todos, setTodos] = useState([
    // 임시 할 일 목록 상태
    { id: "1", text: "비타민 챙겨 먹기", isCompleted: false },
    { id: "2", text: "프로젝트 계획서 작성", isCompleted: true },
    { id: "3", text: "장보기", isCompleted: false },
  ]);

  const handleButtonClick = (buttonName: string) => {
    alert(`${buttonName} 버튼 클릭됨!`);
  };

  // 할 일 완료 상태 토글 함수
  const handleToggleComplete = (id: string) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === id ? { ...todo, isCompleted: !todo.isCompleted } : todo
      )
    );
  };

  return (
    <div
      style={{
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        alignItems: "flex-start",
        backgroundColor: "var(--background)",
        minHeight: "100vh",
      }}
    >
      <h1>Button Component Test Page</h1>
      <div
        style={{
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          alignItems: "flex-start",
          backgroundColor: "var(--background)",
          minHeight: "100vh",
        }}
      >
        <h1>Button Component Test Page</h1>
        <p>다양한 버튼 variant 테스트:</p>

        {/* 1. textPrimary (흰 배경 '추가하기' 버튼) */}
        <Button
          variant="add"
          icon="plus"
          onClick={() => handleButtonClick("기본 추가하기")}
        >
          추가하기
        </Button>

        {/* 2. addInitial (보라색 '추가하기' 버튼 - 텍스트 포함) */}
        <Button
          variant="addInitial"
          icon="plus"
          onClick={() => handleButtonClick("초기 추가하기 (텍스트)")}
        >
          추가하기
        </Button>

        {/* 3. addInitial (보라색 '추가하기' 버튼 - 아이콘만 - 모바일 버전) */}
        <Button
          variant="addInitial"
          icon="plus"
          onClick={() => handleButtonClick("초기 추가하기 (아이콘만)")}
        />

        {/* 4. delete (붉은색 '삭제하기' 버튼) */}
        <Button
          variant="delete"
          icon="x"
          onClick={() => handleButtonClick("삭제하기")}
        >
          삭제하기
        </Button>

        {/* 5. submitSuccess (수정 완료 버튼 - 활성화/비활성화 테스트) */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <Button
            variant="submitSuccess"
            icon="check"
            isActive={isSubmitActive}
            onClick={() => handleButtonClick("수정 완료")}
            disabled={!isSubmitActive} // isActive가 false일 때 disabled 속성 추가
          >
            수정 완료
          </Button>
          <button
            onClick={() => setIsSubmitActive(!isSubmitActive)}
            style={{
              padding: "5px 10px",
              backgroundColor: "lightblue",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            {isSubmitActive ? "비활성화하기" : "활성화하기"}
          </button>
        </div>

        {/* 6. iconImageAdd (상세 페이지 이미지 '추가' 버튼) */}
        <Button
          variant="iconImageAdd"
          icon="plus"
          onClick={() => handleButtonClick("이미지 추가")}
        />

        {/* 7. iconImageEdit (상세 페이지 이미지 '수정' 버튼) */}
        <Button
          variant="iconImageEdit"
          icon="edit"
          onClick={() => handleButtonClick("이미지 수정")}
        />
        <hr
          style={{
            width: "100%",
            border: "1px solid var(--slate-200)",
            margin: "20px 0",
          }}
        />

        <h2>ChecklistItem Component Test</h2>
        <p>할 일 목록 아이템 테스트:</p>
        {todos.map((todo) => (
          <ChecklistItem
            key={todo.id}
            id={todo.id}
            text={todo.text}
            isCompleted={todo.isCompleted}
            onToggleComplete={handleToggleComplete}
          />
        ))}

        {/* 추가적인 테스트를 위한 여백 */}
        <div style={{ height: "50px" }}></div>
      </div>
    </div>
  );
}
