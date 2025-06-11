// src/components/todo/CheckListItem.tsx

"use client";

import React from "react";
import Image from "next/image";
import styles from "./CheckListItem.module.css"; // CSS Modules 임포트 경로 확인 (파일명과 일치해야 함)

interface TodoItem {
  id: string;
  title: string;
  status: "TODO" | "DONE";
  memo: string | null; // memo 속성은 유지하되, UI에 직접 표시하지 않음
}

interface CheckListItemProps {
  item: TodoItem;
  onToggle: (id: string) => void;
  onClick: (item: TodoItem) => void;
}

const CheckListItem: React.FC<CheckListItemProps> = ({
  item,
  onToggle,
  onClick,
}) => {
  const isDone = item.status === "DONE";

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation(); // 체크박스 클릭이 아이템 전체 클릭 이벤트로 전파되는 것을 방지
    onToggle(item.id);
  };

  return (
    <div
      className={`${styles.checklistItem} ${isDone ? styles.done : ""}`}
      onClick={() => onClick(item)}
    >
      <button
        className={`${styles.checkbox} ${isDone ? styles.checked : ""}`}
        onClick={handleToggle}
        aria-label={isDone ? "할 일 완료 취소" : "할 일 완료"}
      >
        {/* 체크 여부에 따라 이미지 렌더링 방식 조정 */}
        {/* 간결한 표현: isDone 상태에 따라 src와 alt 속성만 변경 */}
        <Image
          src={isDone ? "/ic/checkbox-checked.svg" : "/ic/checkbox.svg"}
          alt={isDone ? "체크됨" : "체크되지 않음"}
          width={24} // 시안 (image_3c3923.png) 에서 체크박스 크기 고려
          height={24} // 시안 (image_3c3923.png) 에서 체크박스 크기 고려
          className={styles.checkboxIcon}
        />
      </button>
      <span className={styles.title}>{item.title}</span>
      {/* 메모 아이콘은 시안 (image_150a55.png) 에 없으므로 추가하지 않습니다. */}
    </div>
  );
};

export default CheckListItem;
