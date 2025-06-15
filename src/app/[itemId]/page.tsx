// src/app/[itemId]/page.tsx
"use client"; // ⭐ 맨 위에 'use client' 지시어 유지 ⭐

// 'use' 훅은 더 이상 필요 없으므로 제거합니다.
import { useEffect, useState, useRef } from "react";
import { useRouter, useParams } from "next/navigation"; // ⭐ useParams 임포트 추가 ⭐
import Image from "next/image";
import CheckListDetail from "@/components/todo/CheckListDetail";
import Button from "@/components/todo/Button";
import { Item } from "@/lib/data";
import styles from "./page.module.css";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";
const TENANT_ID = "defaultTenant";

// ⭐ ItemDetailPageProps 인터페이스를 제거합니다. ⭐
// interface ItemDetailPageProps {
//   params: {
//     itemId: string;
//   };
// }

// ⭐ 컴포넌트 함수에서 props를 받지 않고, useParams 훅을 사용합니다. ⭐
export default function ItemDetailPage() {
  // ⭐ 여기를 수정했습니다. ⭐
  const router = useRouter();
  const params = useParams(); // ⭐ useParams 훅을 사용하여 params를 가져옵니다. ⭐
  const itemId = Number(params.itemId); // ⭐ params.itemId는 이제 string으로 보장됩니다. ⭐

  const [item, setItem] = useState<Item | null>(null);
  const [editedName, setEditedName] = useState("");
  const [editedMemo, setEditedMemo] = useState("");
  const [editedImageUrl, setEditedImageUrl] = useState<string | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // useParams는 초기 렌더링 시점에 비어있을 수 있으므로, itemId가 유효한지 확인합니다.
    if (!params.itemId || isNaN(itemId)) {
      // ⭐ 조건 수정: params.itemId 존재 여부 확인 추가 ⭐
      setLoading(false);
      setError("아이템 ID가 유효하지 않습니다.");
      router.push("/");
      return;
    }

    const fetchItem = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `${API_BASE_URL}/api/${TENANT_ID}/items/${itemId}`
        );
        if (!res.ok) {
          if (res.status === 404) {
            setError("할 일을 찾을 수 없습니다.");
            router.push("/");
            return;
          }
          throw new Error(`Failed to fetch item: ${res.statusText}`);
        }
        const result = await res.json();
        if (result.success) {
          const fetchedItem: Item = result.data;
          setItem(fetchedItem);
          setEditedName(fetchedItem.name);
          setEditedMemo(fetchedItem.memo || "");
          setIsCompleted(fetchedItem.isCompleted);
          setEditedImageUrl(fetchedItem.imageUrl || null);
        } else {
          throw new Error(result.message || "Failed to fetch item data");
        }
      } catch (err: unknown) {
        console.error("Error fetching item details:", err);
        if (err instanceof Error) {
          setError(err.message || "할 일 정보를 불러오는 데 실패했습니다.");
        } else {
          setError("알 수 없는 오류가 발생했습니다.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [itemId, router, params.itemId]); // ⭐ 의존성 배열에 params.itemId 추가 (안정성 확보) ⭐

  const handleNameChange = (newName: string) => {
    setEditedName(newName);
  };

  const handleMemoChange = (newMemo: string) => {
    setEditedMemo(newMemo);
  };

  const handleToggleTodoStatus = async (id: number, newStatus: boolean) => {
    if (!item || item.id !== id) return;

    setIsCompleted(newStatus);
    const prevItem = item;

    const updatedItem: Item = {
      ...item,
      isCompleted: newStatus,
      name: editedName,
      memo: editedMemo,
      imageUrl: editedImageUrl,
    };

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/${TENANT_ID}/items/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedItem),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `HTTP error! status: ${response.status} - ${
            errorData.message || "Unknown error"
          }`
        );
      }

      const result = await response.json();
      if (result.success) {
        setItem(result.data);
      } else {
        throw new Error(result.message || "Failed to toggle item status");
      }
    } catch (err: unknown) {
      console.error("Failed to toggle todo status:", err);
      if (err instanceof Error) {
        alert(`상태 변경 실패: ${err.message}`);
      } else {
        alert("상태 변경 실패: 알 수 없는 오류");
      }
      setIsCompleted(!newStatus);
      setItem(prevItem);
    }
  };

  const handleImageFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const reader = new FileReader();
        reader.onloadend = () => {
          setEditedImageUrl(reader.result as string);
        };
        reader.readAsDataURL(file);
      } catch (uploadError: unknown) {
        console.error("이미지 업로드 중 오류 발생:", uploadError);
        if (uploadError instanceof Error) {
          alert("이미지 업로드 중 오류가 발생했습니다: " + uploadError.message);
        } else {
          alert("이미지 업로드 중 알 수 없는 오류가 발생했습니다.");
        }
      }
    }
  };

  const handleImageButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleSaveItem = async () => {
    if (!item) return;

    const updatedItem: Item = {
      ...item,
      name: editedName,
      memo: editedMemo,
      imageUrl: editedImageUrl,
      isCompleted: isCompleted,
    };

    try {
      const res = await fetch(
        `${API_BASE_URL}/api/${TENANT_ID}/items/${updatedItem.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedItem),
        }
      );

      if (!res.ok) {
        throw new Error(`Failed to update item: ${res.statusText}`);
      }
      const result = await res.json();
      if (result.success) {
        setItem(result.data);
        alert("할 일이 성공적으로 수정되었습니다.");
        router.push("/");
      } else {
        throw new Error(result.message || "Failed to update item data");
      }
    } catch (err: unknown) {
      console.error("Error saving item:", err);
      if (err instanceof Error) {
        alert(`할 일 수정 실패: ${err.message}`);
      } else {
        alert("할 일 수정 실패: 알 수 없는 에러");
      }
    }
  };

  const handleDeleteItem = async () => {
    if (!item) return;

    const confirmDelete = window.confirm("정말로 이 할 일을 삭제하시겠습니까?");
    if (!confirmDelete) return;

    try {
      const res = await fetch(
        `${API_BASE_URL}/api/${TENANT_ID}/items/${item.id}`,
        {
          method: "DELETE",
        }
      );

      if (!res.ok) {
        throw new Error(`Failed to delete item: ${res.statusText}`);
      }
      const result = await res.json();
      if (result.success) {
        alert("할 일이 성공적으로 삭제되었습니다.");
        router.push("/");
      } else {
        throw new Error(result.message || "Failed to delete item data");
      }
    } catch (err: unknown) {
      console.error("Error deleting item:", err);
      if (err instanceof Error) {
        alert(`할 일 삭제 실패: ${err.message}`);
      } else {
        alert("할 일 삭제 실패: 알 수 없는 에러");
      }
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingErrorState}>로딩 중...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingErrorState}>{error}</div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingErrorState}>
          할 일 데이터를 찾을 수 없습니다. (혹은 잘못된 접근)
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <main className={styles.mainContent}>
        <CheckListDetail
          item={{ id: item.id, name: editedName, isCompleted: isCompleted }}
          onNameChange={handleNameChange}
          onToggleStatus={handleToggleTodoStatus}
        />

        <div className={styles.imageInputContainer}>
          {editedImageUrl ? (
            <>
              <Image
                src={editedImageUrl}
                alt="할 일 관련 이미지"
                width={600}
                height={311}
                style={{ objectFit: "cover", borderRadius: "12px" }}
                className={styles.uploadedImage}
              />
              <div className={styles.imageButtons}>
                <Button
                  variant="detailImageEdit"
                  icon="edit"
                  onClick={handleImageButtonClick}
                  aria-label="이미지 수정"
                />
              </div>
            </>
          ) : (
            <div
              className={styles.imagePlaceholder}
              onClick={handleImageButtonClick}
            >
              <Image
                src="/ic/img.svg"
                alt="이미지 추가 아이콘"
                width={60}
                height={60}
                className={styles.placeholderIcon}
              />
              <Button
                variant="detailImageAdd"
                icon="plusLarge"
                onClick={(e) => {
                  e.stopPropagation();
                  handleImageButtonClick();
                }}
                className={styles.imageAddButton}
                aria-label="이미지 추가"
              />
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleImageFileChange}
            style={{ display: "none" }}
          />
        </div>

        {/* Memo 섹션 - ItemDetailPage에서 직접 구현 */}
        <div className={styles.memoContainer}>
          <div className={styles.memoTitle}>Memo</div>
          <textarea
            className={styles.memoTextarea}
            value={editedMemo}
            onChange={(e) => handleMemoChange(e.target.value)}
            placeholder="메모를 입력하세요..."
          />
        </div>

        {/* 버튼 그룹 */}
        <div className={styles.buttonGroup}>
          <Button
            type="button"
            variant="submitSuccess"
            icon="check"
            onClick={handleSaveItem}
            isActive={isCompleted}
          >
            수정 완료
          </Button>
          <Button
            type="button"
            variant="delete"
            icon="x"
            onClick={handleDeleteItem}
          >
            삭제하기
          </Button>
        </div>
      </main>
    </div>
  );
}
