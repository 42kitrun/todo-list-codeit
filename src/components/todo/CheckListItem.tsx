// src/components/todo/CheckListItem.tsx

"use client";

import React from "react";
import Image from "next/image";
import styles from "./CheckListItem.module.css";

// API 명세 및 lib/data.ts의 Item 타입에 맞게 TodoItem 타입 정의
interface TodoItem {
  id: number; // string -> number
  name: string; // title -> name
  isCompleted: boolean; // status: "TODO" | "DONE" -> isCompleted: boolean
  memo: string | null;
  imageUrl: string | null;
}

interface CheckListItemProps {
  item: TodoItem;
  onToggle: (id: number) => void; // id 타입 string -> number
  onClick: (item: TodoItem) => void;
}

const CheckListItem: React.FC<CheckListItemProps> = ({
  item,
  onToggle,
  onClick,
}) => {
  const isDone = item.isCompleted; // item.status === "DONE" -> item.isCompleted

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
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
        <Image
          src={isDone ? "/ic/checkbox-checked.svg" : "/ic/checkbox.svg"}
          alt={isDone ? "체크됨" : "체크되지 않음"}
          width={24}
          height={24}
          className={styles.checkboxIcon}
        />
      </button>
      <span className={styles.title}>{item.name}</span>{" "}
      {/* item.title -> item.name */}
    </div>
  );
};

export default CheckListItem;
