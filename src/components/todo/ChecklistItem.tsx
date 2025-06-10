// src/components/todo/ChecklistItem.tsx
"use client";

import React from "react";
import Image from "next/image";

interface ChecklistItemProps {
  id: string; // 각 할 일 항목을 고유하게 식별할 ID
  text: string; // 할 일 내용
  isCompleted: boolean; // 완료 여부
  onToggleComplete: (id: string) => void; // 완료 상태를 토글하는 함수
}

const ChecklistItem: React.FC<ChecklistItemProps> = ({
  id,
  text,
  isCompleted,
  onToggleComplete,
}) => {
  const handleToggle = () => {
    onToggleComplete(id);
  };

  return (
    // 이 div 태그에 completed 클래스를 추가해야 합니다.
    <div className={`checklist-item ${isCompleted ? "completed" : ""}`}>
      <button
        type="button"
        onClick={handleToggle}
        className="checklist-checkbox-button"
        aria-checked={isCompleted}
        role="checkbox"
      >
        <Image
          src={isCompleted ? "/ic/checkbox-checked.svg" : "/ic/checkbox.svg"}
          alt={isCompleted ? "체크박스 체크됨" : "체크박스 비어있음"}
          width={32}
          height={32}
        />
      </button>
      <span className={`checklist-item-text ${isCompleted ? "completed" : ""}`}>
        {text}
      </span>
    </div>
  );
};

export default ChecklistItem;
