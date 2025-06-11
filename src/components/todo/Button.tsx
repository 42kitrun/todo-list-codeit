// src/components/todo/Button.tsx

"use client";

import React from "react";
import Image from "next/image";
import styles from "./Button.module.css"; // CSS Modules 임포트 추가

type ButtonVariant =
  | "add" // 할 일 목록이 있을 때 (흰색 배경, 검정 텍스트/아이콘)
  | "addInitial" // 할 일 목록이 없을 때 (보라색 배경, 흰색 텍스트/아이콘)
  | "delete"
  | "submitSuccess"
  | "detailImageAdd"
  | "detailImageEdit";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  children?: React.ReactNode;
  icon?: "plus" | "x" | "check" | "edit" | "plusLarge";
  iconPosition?: "left" | "right";
  isActive?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  variant = "add",
  children,
  icon,
  iconPosition = "left",
  className = "",
  isActive = true,
  ...props
}) => {
  const buttonClassNames = [styles.btnBase]; // CSS Modules 사용

  let iconSrcPath: string | null = null;
  let iconAlt: string = "";
  let iconSize = 16;

  switch (icon) {
    case "plus":
      // 'add' variant에서는 검정색 '+', 'addInitial'에서는 흰색 '+'
      if (variant === "addInitial") {
        iconSrcPath = "/ic/plus-white.svg";
        iconAlt = "추가 아이콘 (흰색)";
      } else {
        iconSrcPath = "/ic/plus.svg";
        iconAlt = "추가 아이콘";
      }
      break;
    case "x":
      iconSrcPath = "/ic/X.svg";
      iconAlt = "닫기/삭제 아이콘";
      break;
    case "check":
      iconSrcPath = "/ic/check.svg";
      iconAlt = "체크 아이콘";
      break;
    case "edit":
      iconSrcPath = "/ic/edit.svg";
      iconAlt = "수정 아이콘";
      iconSize = 24;
      break;
    case "plusLarge":
      iconSrcPath = "/ic/plus-large.svg";
      iconAlt = "이미지 추가 아이콘";
      iconSize = 24;
      break;
    default:
      iconSrcPath = null;
      iconAlt = "";
  }

  switch (variant) {
    case "add":
      buttonClassNames.push(styles.btnAdd); // 새로운 클래스 추가
      if (!children) {
        // 텍스트가 없는 경우 (아이콘만 있는 경우)
        buttonClassNames.push(styles.btnIconOnly); // 아이콘만 있는 버튼 스타일
      }
      break;
    case "addInitial":
      buttonClassNames.push(styles.btnAddInitial);
      if (!children) {
        buttonClassNames.push(styles.btnIconOnly);
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
        buttonClassNames.push(styles.inactive); // 비활성화 상태 클래스 추가
      }
      break;
    case "detailImageAdd":
      buttonClassNames.push(
        styles.btnIconImageAction,
        styles.detailImageAddStyles
      );
      break;
    case "detailImageEdit":
      buttonClassNames.push(
        styles.btnIconImageAction,
        styles.detailImageEditStyles
      );
      break;
  }

  return (
    <button
      className={`${buttonClassNames.join(" ")} ${className}`}
      disabled={variant === "submitSuccess" && !isActive}
      {...props}
    >
      {icon && iconPosition === "left" && iconSrcPath && (
        <Image
          src={iconSrcPath}
          alt={iconAlt}
          width={iconSize}
          height={iconSize}
          className={`${styles.icon} ${children ? styles.iconMarginRight : ""}`} // 클래스 추가
        />
      )}
      {children}
      {icon && iconPosition === "right" && iconSrcPath && (
        <Image
          src={iconSrcPath}
          alt={iconAlt}
          width={iconSize}
          height={iconSize}
          className={`${styles.icon} ${children ? styles.iconMarginLeft : ""}`} // 클래스 추가
        />
      )}
    </button>
  );
};

export default Button;
