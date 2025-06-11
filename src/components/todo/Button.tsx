// src/components/Button.tsx
"use client";

import React from "react";
import Image from "next/image";

type ButtonVariant =
  | "add"
  | "addInitial"
  | "delete"
  | "submitSuccess"
  | "iconImageAdd" // 이미지 추가 버튼
  | "iconImageEdit"; // 이미지 수정 버튼

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  children?: React.ReactNode;
  icon?: "plus" | "x" | "check" | "edit" | "plusLarge"; // "plus"는 이제 검정색, "plus-white" 추가할 수 있음
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
  const buttonClassNames = ["btn-base"];

  let iconSrcPath: string | null = null;
  let iconAlt: string = "";
  let iconSize = 16; // 기본 아이콘 사이즈

  switch (icon) {
    case "plus":
      // 'add' variant (흰색 배경) 에서 사용될 검정색 '+' 아이콘
      iconSrcPath = "/ic/plus.svg";
      iconAlt = "추가 아이콘";
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

  // variant가 addInitial일 경우 plus-white.svg를 사용하도록 강제
  if (variant === "addInitial" && icon === "plus") {
    iconSrcPath = "/ic/plus-white.svg";
    iconAlt = "추가 아이콘 (흰색)";
    iconSize = 16; // 또는 필요한 경우 24로 설정
  }
  // 만약 addInitial에서 다른 아이콘을 사용할 경우 해당 아이콘도 흰색이 되도록 iconClassName을 조작해야 합니다.
  // 여기서는 'plus' 아이콘만 가정합니다.

  switch (variant) {
    case "add":
      buttonClassNames.push("btn-text-primary");
      break;
    case "addInitial":
      buttonClassNames.push("btn-add-initial");
      if (!children) {
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
      break;
    case "iconImageAdd":
      buttonClassNames.push("btn-icon-image-action", "variant-add");
      break;
    case "iconImageEdit":
      buttonClassNames.push("btn-icon-image-action", "variant-edit");
      break;
  }

  let iconClassName = "";
  // variant에 따라 iconClassName을 설정하되,
  // iconSrcPath를 직접 변경했으므로 iconClassName은 이제 해당 variant의 텍스트/아이콘 색상을 따라갑니다.
  if (variant === "add") {
    // 'add' variant는 검정색 텍스트/아이콘
    iconClassName = "icon-color-text-primary";
  } else if (variant === "addInitial") {
    // 'addInitial' variant는 흰색 텍스트/아이콘 (plus-white.svg를 사용하므로 이 클래스는 사실상 불필요)
    // 하지만 일관성을 위해 유지하거나, 만약 plus-white.svg에 currentColor가 있다면 필요합니다.
    iconClassName = "icon-color-white";
  } else if (variant === "iconImageAdd") {
    iconClassName = "icon-color-image-action-add";
  } else if (variant === "iconImageEdit") {
    iconClassName = "icon-color-image-action-edit";
  } else if (variant === "submitSuccess" && isActive) {
    iconClassName = "icon-color-submit-success-active";
  } else if (variant === "submitSuccess" && !isActive) {
    iconClassName = "icon-color-submit-success-inactive";
  } else {
    // 그 외의 경우 (예: delete 버튼의 X 아이콘 등)
    iconClassName = "icon-color-white";
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
          style={children ? { marginRight: "4px" } : {}}
          className={iconClassName}
        />
      )}
      {children}
      {icon && iconPosition === "right" && iconSrcPath && (
        <Image
          src={iconSrcPath}
          alt={iconAlt}
          width={iconSize}
          height={iconSize}
          style={children ? { marginLeft: "4px" } : {}}
          className={iconClassName}
        />
      )}
    </button>
  );
};

export default Button;
