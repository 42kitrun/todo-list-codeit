// src/components/todo/Button.tsx

"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import styles from "./Button.module.css";

type ButtonVariant =
  | "add"
  | "addInitial"
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
  const [isMobileView, setIsMobileView] = useState(false);

  const TABLET_MIN_WIDTH_FOR_JS = 376;

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < TABLET_MIN_WIDTH_FOR_JS);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const buttonClassNames = [styles.btnBase];

  let iconSrcPath: string | null = null;
  let iconAlt: string = "";
  let iconSize = 16;

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
    case "plusLarge":
      iconSrcPath = "/ic/plus.svg";
      iconAlt = "이미지 추가 아이콘";
      iconSize = 16;
      break;
    default:
      iconSrcPath = null;
      iconAlt = "";
  }

  // 각 variant에 따라 버튼 스타일 클래스 추가
  switch (variant) {
    case "add":
      buttonClassNames.push(styles.btnAdd);
      if (isMobileView) {
        buttonClassNames.push(styles.btnIconOnly);
      }
      break;
    case "addInitial":
      buttonClassNames.push(styles.btnAddInitial);
      if (isMobileView) {
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
        buttonClassNames.push(styles.inactive);
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

  const shouldRenderChildren = children && !isMobileView;

  const iconClass = `${styles.icon} ${
    shouldRenderChildren ? styles.iconMarginRight : ""
  }`;

  // ⭐ 새로운 변수: buttonShadowBackground를 렌더링할지 여부 결정 ⭐
  const shouldRenderShadow =
    variant !== "detailImageAdd" && variant !== "detailImageEdit";

  return (
    <div className={`${styles.buttonWrapper} ${className}`}>
      {shouldRenderShadow && ( // ⭐ 조건부 렌더링 추가 ⭐
        <div className={styles.buttonShadowBackground}></div>
      )}
      <button
        className={buttonClassNames.join(" ")}
        // disabled={variant === "submitSuccess" && !isActive} // ⭐ 이 줄을 주석 처리하거나 삭제 ⭐
        // 만약 submitSuccess 버튼만 항상 활성화하고 싶다면
        // disabled={props.disabled || (variant === "submitSuccess" ? false : !isActive)}
        // 아니면 다른 variant의 disabled 로직만 유지
        {...props}
      >
        {icon && iconPosition === "left" && iconSrcPath && (
          <Image
            src={iconSrcPath}
            alt={iconAlt}
            width={iconSize}
            height={iconSize}
            className={iconClass}
          />
        )}
        {shouldRenderChildren && children}
        {icon && iconPosition === "right" && iconSrcPath && (
          <Image
            src={iconSrcPath}
            alt={iconAlt}
            width={iconSize}
            height={iconSize}
            className={`${styles.icon} ${
              shouldRenderChildren ? styles.iconMarginLeft : ""
            }`}
          />
        )}
      </button>
    </div>
  );
};

export default Button;
