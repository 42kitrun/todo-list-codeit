// src/components/todo/CheckListDetail.tsx

import React from "react";
import Image from "next/image"; // Image 컴포넌트 임포트
import styles from "./CheckListDetail.module.css";

// Todo 아이템의 데이터 구조를 정의하는 인터페이스
// imageUrl 속성 제거
interface TodoItem {
  id: string;
  title: string;
  status: "TODO" | "DONE";
  memo?: string;
  // imageUrl?: string; // 이 속성을 제거합니다.
}

interface CheckListDetailProps {
  item: TodoItem; // item은 이제 imageUrl 속성이 없는 TodoItem
  onSave: (updatedItem: TodoItem) => void;
  onDelete: (itemId: string) => void;
}

const CheckListDetail: React.FC<CheckListDetailProps> = ({
  item,
  onSave,
  onDelete,
}) => {
  // 이미지를 고정 경로로 사용
  const fixedMemoImageUrl = "/img/memo.svg";

  return (
    <div className={styles.detailContainer}>
      <h2 className={styles.title}>{item.title}</h2>
      <p className={styles.status}>
        상태:{" "}
        <span
          className={
            item.status === "DONE" ? styles.statusDone : styles.statusTodo
          }
        >
          {item.status === "DONE" ? "완료" : "진행 중"}
        </span>
      </p>

      {/* memo가 있을 때만 메모 텍스트 표시 */}
      {item.memo && <p className={styles.memo}>메모: {item.memo}</p>}

      {/* 이미지는 항상 고정 경로로 표시 */}
      <div className={styles.imageWrapper}>
        <Image
          src={fixedMemoImageUrl} // 고정된 이미지 경로 사용
          alt="메모 이미지" // alt 텍스트도 고정 이미지에 맞게 변경
          width={500} // 실제 memo.svg의 비율에 맞게 조정 필요
          height={300} // 실제 memo.svg의 비율에 맞게 조정 필요
          className={styles.itemImage}
        />
      </div>

      <div className={styles.buttonGroup}>
        <button className={styles.saveButton} onClick={() => onSave(item)}>
          수정 완료
        </button>
        <button
          className={styles.deleteButton}
          onClick={() => onDelete(item.id)}
        >
          삭제하기
        </button>
      </div>
    </div>
  );
};

export default CheckListDetail;
