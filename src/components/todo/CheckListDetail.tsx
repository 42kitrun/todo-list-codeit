// src/components/todo/CheckListDetail.tsx

"use client"; // 이 컴포넌트가 클라이언트 측에서 렌더링됨을 명시합니다.

import React from "react";
import Image from "next/image"; // Next.js의 Image 컴포넌트를 사용하여 이미지 최적화
import styles from "./CheckListDetail.module.css"; // 컴포넌트 전용 CSS 모듈 임포트

/*
  TodoItem: 체크리스트 항목의 데이터 구조를 정의하는 인터페이스입니다.
  CheckListDetail 컴포넌트가 필요로 하는 최소한의 속성만 포함합니다.
*/
interface TodoItem {
  id: number; // 할 일 항목의 고유 ID
  name: string; // 할 일 항목의 이름 (제목)
  isCompleted: boolean; // 할 일 완료 여부 상태 (true: 완료, false: 미완료)
}

/*
  CheckListDetailProps: CheckListDetail 컴포넌트가 받을 수 있는 속성(props)들을 정의합니다.
*/
interface CheckListDetailProps {
  item: TodoItem; // 렌더링할 개별 할 일 항목 데이터
  onNameChange: (newName: string) => void; // 할 일 이름이 변경될 때 호출될 콜백 함수
  onToggleStatus: (id: number, newStatus: boolean) => void; // 할 일 완료 상태가 토글될 때 호출될 콜백 함수
}

/*
  CheckListDetail 컴포넌트: 개별 할 일 항목을 표시하고 사용자와 상호작용하는 UI를 렌더링합니다.
  할 일의 완료 상태를 토글하고, 할 일 이름을 편집할 수 있는 기능을 제공합니다.
*/
const CheckListDetail: React.FC<CheckListDetailProps> = ({
  item, // 렌더링할 현재 할 일 항목 객체
  onNameChange, // 할 일 이름 변경 시 호출될 함수
  onToggleStatus, // 할 일 완료 상태 토글 시 호출될 함수
}) => {
  /*
    handleToggle: 체크박스 클릭 시 호출되는 이벤트 핸들러입니다.
    `onToggleStatus` 함수를 호출하여 현재 할 일의 완료 상태를 반전시켜 부모 컴포넌트에 알립니다.
  */
  const handleToggle = () => {
    onToggleStatus(item.id, !item.isCompleted); // item의 ID와 반전된 완료 상태 전달
  };

  /*
    컴포넌트 렌더링 부분:
    - `.checklistItem` div: 전체 할 일 항목 컨테이너입니다. `item.isCompleted` 값에 따라 `styles.done` 클래스가 동적으로 적용되어 완료 상태를 시각적으로 표시합니다.
    - `.topSection` div: 체크박스와 이름 입력 필드를 포함하는 상단 영역입니다.
    - 체크박스 버튼: `onClick` 시 `handleToggle` 함수를 호출하여 상태를 변경합니다. `aria-label`을 통해 스크린 리더 사용자에게 버튼의 목적을 명확히 전달합니다. `Image` 컴포넌트를 사용하여 `item.isCompleted` 상태에 따라 다른 체크박스 아이콘을 표시합니다.
    - 이름 입력 필드 (`<input>`): `type="text"`로 텍스트 입력을 받습니다. `value`는 `item.name`으로 설정되어 동기화되며, `onChange` 이벤트 발생 시 `onNameChange` 함수를 호출하여 변경된 이름을 부모 컴포넌트로 전달합니다.
  */
  return (
    <div
      className={`${styles.checklistItem} ${
        item.isCompleted ? styles.done : ""
      }`}
    >
      {/* 체크박스와 이름 입력 필드를 포함하는 상단 섹션 */}
      <div className={styles.topSection}>
        {/* 체크박스 버튼 */}
        <button
          className={`${styles.checkbox} ${
            item.isCompleted ? styles.checked : "" // CSS 모듈에 .checked 스타일이 있다면 적용됩니다.
          }`}
          onClick={handleToggle} // 클릭 시 할 일 완료 상태 토글
          aria-label={item.isCompleted ? "할 일 완료 취소" : "할 일 완료"} // 접근성 향상을 위한 라벨
        >
          {/* 완료 상태에 따라 다른 체크박스 아이콘 렌더링 */}
          <Image
            src={
              item.isCompleted ? "/ic/checkbox-checked.svg" : "/ic/checkbox.svg"
            }
            alt={item.isCompleted ? "체크됨" : "체크되지 않음"} // 이미지 alt 텍스트
            width={24} // 이미지 너비
            height={24} // 이미지 높이
            className={styles.checkboxIcon} // CSS 모듈의 아이콘 스타일 적용
          />
        </button>
        {/* 할 일 이름 입력 필드 */}
        <input
          type="text"
          className={styles.titleInput} // CSS 모듈의 입력 필드 스타일 적용
          value={item.name} // 할 일 이름을 입력 필드의 값으로 설정
          onChange={(e) => onNameChange(e.target.value)} // 입력 변경 시 부모 컴포넌트로 새 이름 전달
        />
      </div>
      {/*
        참고: 이 CheckListDetail 컴포넌트의 간소화된 버전에서는
        기존의 이미지 섹션, 메모 섹션, 또는 버튼 그룹과 같은 추가 요소들을 렌더링하지 않습니다.
        이는 컴포넌트의 역할을 "체크박스와 제목" 기능에 집중시키기 위함입니다.
      */}
    </div>
  );
};

export default CheckListDetail; // CheckListDetail 컴포넌트를 내보냅니다.
