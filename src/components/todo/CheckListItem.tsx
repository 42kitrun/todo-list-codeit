// src/components/todo/CheckListItem.tsx

"use client";

import React from "react";
import Image from "next/image";
import styles from "./CheckListItem.module.css";

interface TodoItem {
  id: number;
  name: string;
  isCompleted: boolean;
  memo: string | null;
  imageUrl: string | null;
}

interface CheckListItemProps {
  item: TodoItem;
  onToggle: (id: number) => void;
  onClick: (item: TodoItem) => void; // 상세 페이지 이동을 위한 prop
}

const CheckListItem: React.FC<CheckListItemProps> = ({
  item,
  onToggle,
  onClick,
}) => {
  const isDone = item.isCompleted;

  const handleToggleClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // ⭐ 이 부분이 중요: 체크박스를 클릭했을 때만 이벤트 전파를 막습니다. ⭐
    onToggle(item.id);
  };

  const handleItemNameClick = () => {
    // ⭐ 새로 추가된 함수: 이름 클릭 시 상세 페이지로 이동 ⭐
    onClick(item);
  };

  return (
    <div
      className={`${styles.checklistItem} ${isDone ? styles.done : ""}`}
      // 이제 div 전체에 onClick을 달지 않습니다.
      // 각 요소의 역할에 맞는 onClick을 개별적으로 부여합니다.
    >
      <button
        className={`${styles.checkbox} ${isDone ? styles.checked : ""}`}
        onClick={handleToggleClick} // 체크박스 클릭 시 토글 기능만 수행
        aria-label={isDone ? "할 일 완료 취소" : "할 일 완료"}
      >
        <Image
          src={isDone ? "/ic/checkbox-checked.svg" : "/ic/checkbox.svg"}
          alt={isDone ? "체크됨" : "체크되지 않음"}
          width={24}
          height={24}
          className={styles.checkboxIcon}
        />
      </button>
      {/* ⭐ 이름을 클릭했을 때만 상세 페이지로 이동하도록 onClick을 여기에 연결합니다. ⭐ */}
      <span className={styles.title} onClick={handleItemNameClick}>
        {item.name}
      </span>{" "}
    </div>
  );
};

export default CheckListItem;
