// src/components/todo/Button.tsx

"use client"; // 이 컴포넌트가 클라이언트 컴포넌트임을 Next.js에 알립니다.

import React, { useState, useEffect } from "react";
import Image from "next/image"; // Next.js의 최적화된 Image 컴포넌트 임포트
import styles from "./Button.module.css"; // CSS 모듈 임포트

/*
  ButtonVariant: 버튼의 시각적 형태와 목적을 정의하는 타입 별칭입니다.
  각 변형은 CSS 모듈에서 해당 스타일과 매핑됩니다.
*/
type ButtonVariant =
  | "add" // 일반적인 추가 버튼 (회색 배경)
  | "addInitial" // 초기 상태에서 사용되는 추가 버튼 (보라색 배경)
  | "delete" // 삭제 버튼 (빨간색 배경)
  | "submitSuccess" // 폼 제출 또는 확인 버튼 (활성화/비활성화 상태 가짐)
  | "detailImageAdd" // 이미지 추가 아이콘 버튼
  | "detailImageEdit"; // 이미지 수정 아이콘 버튼

/*
  ButtonProps: Button 컴포넌트가 받을 수 있는 속성(props)들을 정의하는 인터페이스입니다.
  React의 기본 버튼 속성(`React.ButtonHTMLAttributes<HTMLButtonElement>`)을 확장하여
  사용자 정의 속성들을 추가합니다.
*/
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant; // 버튼의 변형 (기본값: "add")
  children?: React.ReactNode; // 버튼 내부에 렌더링될 내용 (텍스트, 다른 요소 등)
  icon?: "plus" | "x" | "check" | "edit" | "plusLarge"; // 버튼에 표시될 아이콘의 종류
  iconPosition?: "left" | "right"; // 아이콘이 텍스트 대비 위치 (기본값: "left")
  isActive?: boolean; // 'submitSuccess' variant에 대한 활성화/비활성화 상태 제어 (기본값: true)
}

/*
  Button 컴포넌트: 재사용 가능한 버튼 UI 요소를 렌더링합니다.
  다양한 `variant`와 `icon` 옵션을 통해 유연하게 버튼을 구성할 수 있습니다.
  모바일 뷰에 따라 아이콘 전용 버튼으로 전환되는 반응형 로직을 포함합니다.
*/
const Button: React.FC<ButtonProps> = ({
  variant = "add", // 기본 variant는 "add"
  children, // 버튼의 자식 요소 (텍스트 등)
  icon, // 사용할 아이콘 (선택 사항)
  iconPosition = "left", // 아이콘의 기본 위치는 왼쪽
  className = "", // 외부에서 추가될 CSS 클래스
  isActive = true, // 버튼 활성화 상태 (submitSuccess variant에서 사용)
  ...props // 나머지 모든 표준 HTML 버튼 속성 (onClick, disabled 등)
}) => {
  // `isMobileView` 상태: 현재 뷰포트가 모바일 크기(376px 미만)인지 여부를 저장합니다.
  const [isMobileView, setIsMobileView] = useState(false);

  // 모바일 뷰를 결정하는 기준 너비 (JavaScript에서 사용)
  const TABLET_MIN_WIDTH_FOR_JS = 376;

  /*
    useEffect: 클라이언트 측에서 뷰포트 너비를 감지하여 `isMobileView` 상태를 업데이트합니다.
    컴포넌트 마운트 시 리사이즈 이벤트 리스너를 등록하고, 언마운트 시 제거하여 메모리 누수를 방지합니다.
  */
  useEffect(() => {
    // 뷰포트 너비에 따라 `isMobileView` 상태를 설정하는 함수
    const handleResize = () => {
      setIsMobileView(window.innerWidth < TABLET_MIN_WIDTH_FOR_JS);
    };

    handleResize(); // 컴포넌트 마운트 시 초기 값 설정
    window.addEventListener("resize", handleResize); // 리사이즈 이벤트 리스너 등록

    // 클린업 함수: 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []); // 빈 의존성 배열: 컴포넌트 마운트/언마운트 시 한 번만 실행

  // 버튼에 적용될 CSS 클래스들을 담는 배열 (기본 스타일 포함)
  const buttonClassNames = [styles.btnBase];

  // 아이콘의 경로, alt 텍스트, 크기를 저장할 변수 초기화
  let iconSrcPath: string | null = null;
  let iconAlt: string = "";
  let iconSize = 16; // 기본 아이콘 크기

  /*
    아이콘 종류에 따라 `iconSrcPath`, `iconAlt`, `iconSize`를 설정하는 switch 문입니다.
    'plus' 아이콘의 경우, 'addInitial' variant에서는 흰색 아이콘을 사용합니다.
  */
  switch (icon) {
    case "plus":
      if (variant === "addInitial") {
        iconSrcPath = "/ic/plus-white.svg";
        iconAlt = "추가 아이콘 (흰색)";
      } else {
        iconSrcPath = "/ic/plus.svg"; // 검정색 플러스 아이콘
        iconAlt = "추가 아이콘";
      }
      iconSize = 16;
      break;
    case "x":
      iconSrcPath = "/ic/X.svg";
      iconAlt = "닫기/삭제 아이콘";
      iconSize = 16;
      break;
    case "check":
      iconSrcPath = "/ic/check.svg";
      iconAlt = "체크 아이콘";
      iconSize = 16;
      break;
    case "edit":
      iconSrcPath = "/ic/edit.svg";
      iconAlt = "수정 아이콘";
      iconSize = 24;
      break;
    case "plusLarge": // 큰 플러스 아이콘 (주로 이미지 추가/수정 버튼에서 사용될 것으로 예상)
      iconSrcPath = "/ic/plus.svg";
      iconAlt = "이미지 추가 아이콘";
      iconSize = 16;
      break;
    default:
      iconSrcPath = null; // 아이콘이 지정되지 않은 경우 경로 없음
      iconAlt = ""; // 아이콘이 지정되지 않은 경우 alt 텍스트 없음
  }

  /*
    선택된 `variant`에 따라 추가적인 CSS 클래스를 `buttonClassNames` 배열에 추가합니다.
    모바일 뷰에서는 'add' 및 'addInitial' variant가 아이콘 전용 버튼으로 전환됩니다.
    'submitSuccess' variant는 `isActive` prop에 따라 'active' 또는 'inactive' 클래스를 가집니다.
  */
  switch (variant) {
    case "add":
      buttonClassNames.push(styles.btnAdd);
      if (isMobileView) {
        buttonClassNames.push(styles.btnIconOnly); // 모바일에서 아이콘 전용 스타일 적용
      }
      break;
    case "addInitial":
      buttonClassNames.push(styles.btnAddInitial);
      if (isMobileView) {
        buttonClassNames.push(styles.btnIconOnly); // 모바일에서 아이콘 전용 스타일 적용
      }
      break;
    case "delete":
      buttonClassNames.push(styles.btnDelete);
      break;
    case "submitSuccess":
      buttonClassNames.push(styles.btnSubmitSuccess);
      if (isActive) {
        buttonClassNames.push(styles.active);
      } else {
        buttonClassNames.push(styles.inactive);
      }
      break;
    case "detailImageAdd":
      buttonClassNames.push(
        styles.btnIconImageAction, // 이미지 액션 버튼 공통 스타일
        styles.detailImageAddStyles // 이미지 추가 버튼 전용 스타일
      );
      break;
    case "detailImageEdit":
      buttonClassNames.push(
        styles.btnIconImageAction, // 이미지 액션 버튼 공통 스타일
        styles.detailImageEditStyles // 이미지 수정 버튼 전용 스타일
      );
      break;
  }

  // 자식 요소(텍스트)를 렌더링할지 여부를 결정합니다. 모바일 뷰에서는 렌더링하지 않습니다.
  const shouldRenderChildren = children && !isMobileView;

  // 아이콘에 적용될 CSS 클래스를 결정합니다. 텍스트가 있을 경우 마진을 추가합니다.
  const iconClass = `${styles.icon} ${
    shouldRenderChildren ? styles.iconMarginRight : ""
  }`;

  // `buttonShadowBackground`를 렌더링할지 여부를 결정합니다.
  // 'detailImageAdd'와 'detailImageEdit' variant는 그림자를 사용하지 않습니다.
  const shouldRenderShadow =
    variant !== "detailImageAdd" && variant !== "detailImageEdit";

  /*
    컴포넌트 렌더링 부분:
    - `buttonWrapper` div로 버튼과 그림자를 감쌉니다.
    - `shouldRenderShadow` 값에 따라 `buttonShadowBackground`를 조건부 렌더링합니다.
    - `<button>` 태그에 모든 동적으로 생성된 클래스와 전달받은 props를 적용합니다.
    - 아이콘과 자식 요소(텍스트)는 `iconPosition` 및 `shouldRenderChildren` 값에 따라 조건부로 렌더링됩니다.
  */
  return (
    <div className={`${styles.buttonWrapper} ${className}`}>
      {/* 그림자를 렌더링할지 여부를 결정합니다. */}
      {shouldRenderShadow && (
        <div className={styles.buttonShadowBackground}></div>
      )}
      <button
        className={buttonClassNames.join(" ")} // 배열의 클래스들을 하나의 문자열로 결합
        // ⭐ 주의: 아래 disabled 로직은 주석 처리되어 있습니다.
        // `disabled={variant === "submitSuccess" && !isActive}`
        // `submitSuccess` 버튼의 `disabled` 상태를 `isActive` prop으로 제어하고 싶다면 이 줄의 주석을 해제하세요.
        // 또는 다른 `variant`에도 `disabled`를 적용하려면 로직을 수정해야 합니다.
        {...props} // 부모 컴포넌트에서 전달된 나머지 HTML 버튼 속성 적용 (예: onClick, type 등)
      >
        {/* 아이콘이 있고, 아이콘 위치가 'left'이고, 아이콘 경로가 있을 경우 아이콘 렌더링 */}
        {icon && iconPosition === "left" && iconSrcPath && (
          <Image
            src={iconSrcPath}
            alt={iconAlt}
            width={iconSize}
            height={iconSize}
            className={iconClass} // 아이콘 스타일 및 마진 클래스 적용
          />
        )}
        {/* 자식 요소(텍스트)를 렌더링할지 여부를 결정합니다. (모바일이 아니거나 자식이 있을 경우) */}
        {shouldRenderChildren && children}
        {/* 아이콘이 있고, 아이콘 위치가 'right'이고, 아이콘 경로가 있을 경우 아이콘 렌더링 */}
        {icon && iconPosition === "right" && iconSrcPath && (
          <Image
            src={iconSrcPath}
            alt={iconAlt}
            width={iconSize}
            height={iconSize}
            className={`${styles.icon} ${
              shouldRenderChildren ? styles.iconMarginLeft : "" // 텍스트가 있을 경우 좌측 마진 추가
            }`}
          />
        )}
      </button>
    </div>
  );
};

export default Button; // Button 컴포넌트를 내보냅니다.
