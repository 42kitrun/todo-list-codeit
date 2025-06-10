// src/components/Button.tsx
"use client"; // 클릭 이벤트를 위해 클라이언트 컴포넌트로 지정

import React from "react";
import Image from "next/image";

// 필요한 아이콘들을 import
import PlusIcon from "../../public/ic/plus.svg";
import XIcon from "../../public/ic/X.svg";
import CheckIcon from "../../public/ic/check.svg";
import EditIcon from "../../public/ic/edit.svg";

// 버튼의 타입을 정의합니다.
type ButtonVariant =
  | "add" // 흰 배경 '추가하기' (텍스트 + 아이콘)
  | "addInitial" // 보라색 '추가하기' (텍스트 + 아이콘, 또는 아이콘만 있는 원형 버튼)
  | "delete" // 붉은색 '삭제하기' (텍스트 + 아이콘)
  | "submitSuccess" // 연두색 '수정 완료' (텍스트 + 아이콘, 활성화/비활성화)
  | "iconImageAdd" // 상세 페이지 이미지 '추가' (+) 아이콘 버튼
  | "iconImageEdit"; // 상세 페이지 이미지 '수정' (연필) 아이콘 버튼

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  children?: React.ReactNode; // children을 선택적으로 변경
  icon?: "plus" | "x" | "check" | "edit"; // 버튼에 들어갈 아이콘 종류
  iconPosition?: "left" | "right";
  isActive?: boolean; // 'submitSuccess' 버튼의 활성화/비활성화 여부
}

const Button: React.FC<ButtonProps> = ({
  variant = "add",
  children,
  icon,
  iconPosition = "left",
  className = "",
  isActive = true, // isActive 기본값 true로 설정
  ...props
}) => {
  const buttonClassNames = ["btn-base"]; // 모든 버튼에 공통적으로 적용될 클래스

  // iconSrc와 iconAlt를 Button 컴포넌트 스코프의 최상단에서 선언
  let iconSrc: string | null = null;
  let iconAlt: string = "";
  const iconSize = 20; // 아이콘 크기 통일

  // 아이콘 src 결정 로직
  switch (icon) {
    case "plus":
      iconSrc = PlusIcon;
      iconAlt = "추가 아이콘";
      break;
    case "x":
      iconSrc = XIcon;
      iconAlt = "닫기/삭제 아이콘";
      break;
    case "check":
      iconSrc = CheckIcon;
      iconAlt = "체크 아이콘";
      break;
    case "edit":
      iconSrc = EditIcon;
      iconAlt = "수정 아이콘";
      break;
    default:
      iconSrc = null; // icon prop이 없거나 일치하지 않을 경우
      iconAlt = "";
  }

  switch (variant) {
    case "add":
      buttonClassNames.push("btn-text-primary");
      break;
    case "addInitial":
      buttonClassNames.push("btn-add-initial");
      if (!children) {
        // 텍스트(children)가 없는 경우 (원형 + 아이콘 버튼)
        buttonClassNames.push("btn-icon-only");
      }
      break;
    case "delete":
      buttonClassNames.push("btn-delete");
      break;
    case "submitSuccess":
      buttonClassNames.push("btn-submit-success");
      if (isActive) {
        buttonClassNames.push("active");
      }
      // 비활성화 상태에서는 cursor: not-allowed는 CSS에서 처리
      // disabled 속성은 props로 전달
      break;
    case "iconImageAdd":
    case "iconImageEdit":
      buttonClassNames.push("btn-icon-image-action");
      break;
  }

  return (
    <button
      className={`${buttonClassNames.join(" ")} ${className}`} // 클래스 배열을 문자열로 합치고 외부 className 추가
      disabled={variant === "submitSuccess" && !isActive} // submitSuccess이고 isActive가 false일 때만 disabled
      {...props}
    >
      {icon && iconPosition === "left" && iconSrc && (
        <Image
          src={iconSrc}
          alt={iconAlt}
          width={iconSize}
          height={iconSize}
          className={children ? "mr-2" : ""}
        />
      )}
      {children}
      {icon && iconPosition === "right" && iconSrc && (
        <Image
          src={iconSrc}
          alt={iconAlt}
          width={iconSize}
          height={iconSize}
          className={children ? "ml-2" : ""}
        />
      )}
    </button>
  );
};

export default Button;
