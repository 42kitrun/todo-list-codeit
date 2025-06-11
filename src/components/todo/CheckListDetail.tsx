// src/components/todo/CheckListDetail.tsx

"use client"; // useState 사용을 위해 클라이언트 컴포넌트로 선언

import React, { useState, useEffect } from "react";
import Image from "next/image"; // 이미지 업로드/미리보기를 위해 다시 임포트
import Button from "./Button"; // Button 컴포넌트 재사용을 위해 임포트
import styles from "./CheckListDetail.module.css";

interface TodoItem {
  id: string;
  title: string;
  status: "TODO" | "DONE";
  memo?: string;
  imageUrl?: string; // 사용자가 추가/수정할 수 있는 할 일 이미지
}

interface CheckListDetailProps {
  item: TodoItem;
  onSave: (updatedItem: TodoItem) => void;
  onDelete: (itemId: string) => void;
  onClose: () => void; // 상세 페이지 닫기 기능
}

const CheckListDetail: React.FC<CheckListDetailProps> = ({
  item,
  onSave,
  onDelete,
  onClose,
}) => {
  const [editedTitle, setEditedTitle] = useState(item.title);
  const [editedMemo, setEditedMemo] = useState(item.memo || "");
  const [editedStatus, setEditedStatus] = useState(item.status);
  const [editedImageUrl, setEditedImageUrl] = useState(item.imageUrl || ""); // 할 일 이미지 상태

  // item prop이 변경될 때 내부 상태를 업데이트
  useEffect(() => {
    setEditedTitle(item.title);
    setEditedMemo(item.memo || "");
    setEditedStatus(item.status);
    setEditedImageUrl(item.imageUrl || ""); // 이미지 상태도 초기화
  }, [item]);

  const handleSave = () => {
    const updatedItem: TodoItem = {
      ...item,
      title: editedTitle,
      memo: editedMemo.trim() || undefined,
      status: editedStatus,
      imageUrl: editedImageUrl.trim() || undefined, // 비어있으면 undefined
    };
    onSave(updatedItem);
    onClose();
  };

  // 변경 사항이 있을 때만 저장 버튼 활성화
  const isSaveButtonActive =
    editedTitle.trim() !== item.title.trim() ||
    editedMemo.trim() !== (item.memo || "").trim() ||
    editedStatus !== item.status ||
    editedImageUrl.trim() !== (item.imageUrl || "").trim();

  // 이미지 추가/수정 버튼 클릭 핸들러 (실제 파일 업로드 로직은 외부에서 처리 필요)
  const handleImageAddEdit = () => {
    // 실제 이미지 업로드 로직 (예: 파일 입력 필드 트리거, 모달 열기 등)
    // 여기서는 임시로 이미지 URL을 토글하는 예시를 보여줍니다.
    if (editedImageUrl) {
      setEditedImageUrl(""); // 이미지가 있으면 제거 (예시)
    } else {
      // 실제로는 파일을 선택하고 업로드한 후 URL을 받아와야 합니다.
      setEditedImageUrl("/img/placeholder-image.jpg"); // 임시 플레이스홀더 이미지
    }
    alert(
      "이미지 추가/수정 기능은 현재 개발 중입니다. (실제 파일 업로드 로직 필요)"
    );
  };

  return (
    <div className={styles.detailContainer}>
      {/* 닫기 버튼 */}
      <Button
        variant="delete"
        icon="x"
        className={styles.closeButton}
        onClick={onClose}
      >
        닫기
      </Button>

      {/* 제목 입력 필드 */}
      <input
        type="text"
        className={styles.titleInput}
        value={editedTitle}
        onChange={(e) => setEditedTitle(e.target.value)}
        placeholder="할 일 제목"
      />

      {/* 상태 토글 섹션 */}
      <div className={styles.statusSection}>
        <span className={styles.statusLabel}>상태:</span>
        <Button
          variant={editedStatus === "DONE" ? "submitSuccess" : "add"}
          onClick={() =>
            setEditedStatus(editedStatus === "DONE" ? "TODO" : "DONE")
          }
          isActive={true}
        >
          {editedStatus === "DONE" ? "완료" : "진행 중"}
        </Button>
      </div>

      {/* 할 일 이미지 영역 및 추가/수정 버튼 */}
      <div className={styles.todoImageSection}>
        {editedImageUrl ? (
          // 이미지가 있을 때 미리보기와 수정 버튼
          <div className={styles.imagePreviewWrapper}>
            <Image
              src={editedImageUrl}
              alt="할 일 첨부 이미지"
              width={280} // 시안 (image_225033.png) 에 맞춰 적절한 크기
              height={180} // 시안 (image_225033.png) 에 맞춰 적절한 크기
              className={styles.uploadedImage}
            />
            <Button
              variant="detailImageEdit" // 이미지 수정 버튼 variant
              icon="edit" // 연필 아이콘
              className={styles.imageActionButton}
              onClick={handleImageAddEdit}
            />
          </div>
        ) : (
          // 이미지가 없을 때 추가 버튼
          <div className={styles.noImagePlaceholder}>
            <Button
              variant="detailImageAdd" // 이미지 추가 버튼 variant
              icon="plusLarge" // 큰 플러스 아이콘
              className={styles.imageActionButton}
              onClick={handleImageAddEdit}
            />
            <span className={styles.imagePlaceholderText}>이미지 추가</span>
          </div>
        )}
      </div>

      {/* 메모 입력 필드 (배경은 CSS로 처리) */}
      <div className={styles.memoSection}>
        <textarea
          className={styles.memoInput}
          value={editedMemo}
          onChange={(e) => setEditedMemo(e.target.value)}
          placeholder="메모를 입력해주세요"
          rows={5} // 시안 (image_225033.png) 에 맞춰 적절한 초기 높이
        />
      </div>

      <div className={styles.buttonGroup}>
        <Button
          variant="submitSuccess"
          isActive={isSaveButtonActive}
          onClick={handleSave}
          type="button"
        >
          수정 완료
        </Button>
        <Button
          variant="delete"
          onClick={() => onDelete(item.id)}
          type="button"
        >
          삭제하기
        </Button>
      </div>
    </div>
  );
};

export default CheckListDetail;
