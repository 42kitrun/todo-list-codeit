// src/components/todo/ChecklistItem.tsx

import React from "react";
import Image from "next/image";

// ChecklistItemProps 인터페이스를 정의합니다.
interface ChecklistItemProps {
  item: {
    id: string;
    text: string;
    isCompleted: boolean;
  };
  onToggle: (id: string) => void;
  // 필요한 경우 여기에 다른 prop들을 추가합니다.
}

// React.FC 타입을 명시적으로 지정하고 JSX를 반환하도록 합니다.
const ChecklistItem: React.FC<ChecklistItemProps> = ({ item, onToggle }) => {
  const handleToggleComplete = () => {
    onToggle(item.id);
  };

  // 체크박스 아이콘의 사이즈는 시안에서 32x32로 명시되었으므로 변경합니다.
  const checkboxIconSize = 32;

  return (
    <div className={`checklist-item ${item.isCompleted ? "completed" : ""}`}>
      <button
        className="checklist-checkbox-button"
        onClick={handleToggleComplete}
      >
        {item.isCompleted ? (
          // 완료된 할 일: 보라색 배경에 흰색 체크 아이콘 (checkbox-checked.svg 사용)
          <Image
            src="/ic/checkbox-checked.svg" // <-- 이 부분을 checkbox-checked.svg로 변경합니다.
            alt="체크 완료"
            width={checkboxIconSize}
            height={checkboxIconSize}
            className="icon-color-white" // 흰색으로 보이도록 클래스 적용
          />
        ) : (
          // 완료 전 할 일: 흰색 배경에 검정색 테두리 원형 체크박스 (checkbox.svg 사용)
          <Image
            src="/ic/checkbox.svg" // 빈 원형 체크박스 SVG 파일
            alt="체크 전"
            width={checkboxIconSize}
            height={checkboxIconSize}
            className="icon-color-text-primary" // 검정색 테두리로 보이도록 클래스 적용
          />
        )}
      </button>
      <span
        className={`checklist-item-text ${item.isCompleted ? "completed" : ""}`}
      >
        {item.text}
      </span>
    </div>
  );
};

export default ChecklistItem;
