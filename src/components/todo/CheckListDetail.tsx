// src/components/todo/CheckListDetail.tsx
"use client";

import React from "react";
import Image from "next/image";
import styles from "./CheckListDetail.module.css";

interface TodoItem {
  // 이 컴포넌트가 사용하는 Item의 최소 속성만 정의
  id: number;
  name: string;
  isCompleted: boolean;
}

interface CheckListDetailProps {
  item: TodoItem; // 간소화된 TodoItem 타입 사용
  onNameChange: (newName: string) => void; // 이름 변경 핸들러 추가
  onToggleStatus: (id: number, newStatus: boolean) => void; // 상태 토글 함수
}

const CheckListDetail: React.FC<CheckListDetailProps> = ({
  item,
  onNameChange,
  onToggleStatus,
}) => {
  const handleToggle = () => {
    onToggleStatus(item.id, !item.isCompleted); // 현재 item의 isCompleted를 반전하여 전달
  };

  return (
    <div
      className={`${styles.checklistItem} ${
        item.isCompleted ? styles.done : ""
      }`}
    >
      {/* 체크박스와 이름 입력 필드 */}
      <div className={styles.topSection}>
        <button
          className={`${styles.checkbox} ${
            item.isCompleted ? styles.checked : ""
          }`}
          onClick={handleToggle}
          aria-label={item.isCompleted ? "할 일 완료 취소" : "할 일 완료"}
        >
          <Image
            src={
              item.isCompleted ? "/ic/checkbox-checked.svg" : "/ic/checkbox.svg"
            }
            alt={item.isCompleted ? "체크됨" : "체크되지 않음"}
            width={24}
            height={24}
            className={styles.checkboxIcon}
          />
        </button>
        <input
          type="text"
          className={styles.titleInput}
          value={item.name} // props로 받은 item.name 사용
          onChange={(e) => onNameChange(e.target.value)} // 부모로 이름 변경 이벤트 전달
        />
      </div>
      {/* 이 컴포넌트에서는 이미지 섹션이나 메모 섹션, 버튼 그룹을 렌더링하지 않습니다. */}
    </div>
  );
};

export default CheckListDetail;
