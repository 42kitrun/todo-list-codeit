// src/components/todo/CheckListItem.tsx

"use client"; // 이 컴포넌트가 클라이언트 측에서 렌더링됨을 명시합니다.

import React from "react";
import Image from "next/image"; // Next.js의 Image 컴포넌트를 사용하여 이미지 최적화
import styles from "./CheckListItem.module.css"; // 컴포넌트 전용 CSS 모듈 임포트

/*
  TodoItem: 체크리스트 항목의 데이터 구조를 정의하는 인터페이스입니다.
  이 컴포넌트가 사용하는 할 일 항목의 모든 속성을 포함합니다.
*/
interface TodoItem {
  id: number; // 할 일 항목의 고유 ID
  name: string; // 할 일 항목의 이름 (제목)
  isCompleted: boolean; // 할 일 완료 여부 상태 (true: 완료, false: 미완료)
  memo: string | null; // 할 일에 대한 메모 (선택 사항)
  imageUrl: string | null; // 할 일에 연결된 이미지 URL (선택 사항)
}

/*
  CheckListItemProps: CheckListItem 컴포넌트가 받을 수 있는 속성(props)들을 정의합니다.
*/
interface CheckListItemProps {
  item: TodoItem; // 렌더링할 개별 할 일 항목 데이터
  onToggle: (id: number) => void; // 할 일 완료 상태를 토글할 때 호출될 콜백 함수
  onClick: (item: TodoItem) => void; // 할 일 항목의 이름 클릭 시 상세 페이지로 이동하기 위해 호출될 콜백 함수
}

/*
  CheckListItem 컴포넌트: 할 일 목록에서 각 개별 할 일 항목의 간략한 보기를 렌더링합니다.
  할 일의 완료 상태를 토글하고, 할 일 이름을 클릭하여 상세 페이지로 이동하는 기능을 제공합니다.
*/
const CheckListItem: React.FC<CheckListItemProps> = ({
  item, // 렌더링할 현재 할 일 항목 객체
  onToggle, // 할 일 완료 상태 토글 시 호출될 함수
  onClick, // 할 일 이름 클릭 시 호출될 함수 (상세 페이지 이동용)
}) => {
  // `isCompleted` 상태를 `isDone` 변수에 저장하여 가독성을 높입니다.
  const isDone = item.isCompleted;

  /*
    handleToggleClick: 체크박스 버튼 클릭 시 호출되는 이벤트 핸들러입니다.
    `e.stopPropagation()`을 사용하여 이벤트가 상위 `div` (현재는 없지만, 확장성을 위해) 또는 다른 요소로 전파되는 것을 막습니다.
    `onToggle` 함수를 호출하여 해당 할 일의 완료 상태를 토글합니다.
  */
  const handleToggleClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // 이벤트 버블링 방지: 체크박스 클릭이 부모 요소의 클릭 이벤트로 전파되지 않도록 함
    onToggle(item.id); // 해당 할 일의 완료 상태 토글 요청
  };

  /*
    handleItemNameClick: 할 일의 이름(`span.title`) 클릭 시 호출되는 이벤트 핸들러입니다.
    `onClick` 함수를 호출하여 현재 `item` 객체를 전달합니다. 이는 주로 해당 할 일의 상세 페이지로 이동하는 데 사용됩니다.
  */
  const handleItemNameClick = () => {
    onClick(item); // 할 일 이름 클릭 시 전체 항목 클릭 이벤트 전달
  };

  /*
    컴포넌트 렌더링 부분:
    - `.checklistItem` div: 전체 할 일 항목 컨테이너입니다. `isDone` 값에 따라 `styles.done` 클래스가 동적으로 적용되어 완료 상태를 시각적으로 표시합니다.
      이전과 달리 `div` 전체에 `onClick`을 달지 않고, 각 요소의 역할에 맞는 개별적인 클릭 이벤트를 부여합니다.
    - 체크박스 버튼: `onClick` 시 `handleToggleClick` 함수를 호출하여 완료 상태를 토글합니다. `aria-label`을 통해 접근성을 향상합니다. `Next.js Image` 컴포넌트를 사용하여 `isDone` 상태에 따라 다른 체크박스 아이콘을 표시합니다.
    - 할 일 제목 (`span`): `onClick` 시 `handleItemNameClick` 함수를 호출하여 상세 페이지 이동을 처리합니다. `item.name` 값을 표시합니다.
  */
  return (
    <div
      className={`${styles.checklistItem} ${isDone ? styles.done : ""}`}
      // div 전체에 onClick을 달지 않고, 각 요소의 역할에 맞는 onClick을 개별적으로 부여합니다.
    >
      {/* 체크박스 버튼 */}
      <button
        className={`${styles.checkbox} ${isDone ? styles.checked : ""}`}
        onClick={handleToggleClick} // 체크박스 클릭 시 할 일 완료 상태만 토글
        aria-label={isDone ? "할 일 완료 취소" : "할 일 완료"} // 스크린 리더를 위한 라벨
      >
        <Image
          src={isDone ? "/ic/checkbox-checked.svg" : "/ic/checkbox.svg"}
          alt={isDone ? "체크됨" : "체크되지 않음"} // 이미지 alt 텍스트
          width={24} // 이미지 너비
          height={24} // 이미지 높이
          className={styles.checkboxIcon} // CSS 모듈의 아이콘 스타일 적용
        />
      </button>
      {/* 할 일 이름을 클릭했을 때 상세 페이지로 이동하도록 onClick을 연결 */}
      <span className={styles.title} onClick={handleItemNameClick}>
        {item.name}
      </span>
    </div>
  );
};

export default CheckListItem; // CheckListItem 컴포넌트를 내보냅니다.
