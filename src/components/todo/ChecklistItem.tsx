// src/components/todo/ChecklistItem.tsx (예시)
import React from "react";
// import Link from 'next/link'; // 필요하다면 Link 임포트
import styles from "./ChecklistItem.module.css"; // CheckListItem.module.css 파일이 있다면

interface TodoItem {
  id: string;
  title: string;
  status: "TODO" | "DONE"; // `isCompleted` 대신 `status` 사용
  memo?: string;
  imageUrl?: string;
}

interface ChecklistItemProps {
  item: TodoItem;
  onToggle: (id: string) => void;
  // onClick?: (id: string) => void; // 항목 클릭 시 상세 페이지로 이동할 경우
}

const ChecklistItem: React.FC<ChecklistItemProps> = ({
  item,
  onToggle /*, onClick*/,
}) => {
  // 아이콘 컴포넌트를 Button 컴포넌트처럼 따로 만들어서 사용하면 좋습니다.
  // 여기서는 임시로 텍스트로 대체하거나, SVG를 직접 넣어둡니다.
  const CheckIcon = () => (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {item.status === "DONE" ? (
        <path
          d="M9 16.17L4.83 12L3.41 13.41L9 19L21 7L19.59 5.59L9 16.17Z"
          fill="currentColor"
        />
      ) : (
        <rect
          x="3"
          y="3"
          width="18"
          height="18"
          rx="4"
          stroke="currentColor"
          strokeWidth="2"
        />
      )}
    </svg>
  );

  return (
    <div
      className={`${styles.checklist_item} ${
        item.status === "DONE" ? styles.completed : ""
      }`}
      // onClick={() => onClick && onClick(item.id)} // 항목 클릭 시 상세 페이지로 이동
    >
      <button
        className={styles.checklist_checkbox_button}
        onClick={() => onToggle(item.id)}
      >
        <CheckIcon />
        {/* 시안에 따라 실제 체크박스 UI가 들어갈 것입니다. */}
      </button>
      <span
        className={`${styles.checklist_item_text} ${
          item.status === "DONE" ? styles.completed : ""
        }`}
      >
        {item.title}
      </span>
      {/* 기타 아이콘이나 수정/삭제 버튼 등이 추가될 수 있습니다. */}
    </div>
  );
};

export default ChecklistItem;
