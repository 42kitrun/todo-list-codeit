// src/app/[itemId]/page.tsx
"use client"; // 이 파일이 클라이언트 측에서 렌더링됨을 명시합니다.

/**
 * @file page.tsx
 * @brief 개별 할 일(Todo)의 상세 정보를 표시하고 수정/삭제하는 페이지 컴포넌트입니다.
 *
 * 이 컴포넌트는 Next.js의 동적 라우팅을 사용하여 특정 `itemId`에 해당하는
 * 할 일 데이터를 불러오고, 사용자의 상호작용에 따라 데이터를 업데이트합니다.
 */

import { useEffect, useState, useRef } from "react";
import { useRouter, useParams } from "next/navigation"; // Next.js 라우터 훅
import Image from "next/image"; // Next.js 이미지 컴포넌트 (성능 최적화)
import CheckListDetail from "@/components/todo/CheckListDetail"; // 할 일 이름 및 완료 상태 컴포넌트
import Button from "@/components/todo/Button"; // 공통 버튼 컴포넌트
import { Item } from "@/lib/data"; // 할 일 데이터 타입 정의 (실제 데이터 로직은 아님)
import styles from "./page.module.css"; // CSS 모듈 임포트

// 모든 요청에 사용될 테넌트 ID (상수)
const TENANT_ID = "defaultTenant";

/**
 * ItemDetailPage 컴포넌트
 * 특정 할 일의 상세 정보를 표시하고 관리하는 페이지입니다.
 */
export default function ItemDetailPage() {
  const router = useRouter(); // Next.js 라우터 객체
  const params = useParams(); // URL 파라미터 가져오기 (여기서는 itemId)
  const itemId = Number(params.itemId); // URL 파라미터에서 할 일 ID 추출 및 숫자로 변환

  // 상태 관리: 할 일 데이터 및 수정 필드들
  const [item, setItem] = useState<Item | null>(null); // 현재 표시 중인 할 일 객체
  const [editedName, setEditedName] = useState(""); // 수정될 할 일 이름
  const [editedMemo, setEditedMemo] = useState(""); // 수정될 메모 내용
  const [editedImageUrl, setEditedImageUrl] = useState<string | null>(null); // 수정될 이미지 URL
  const [isCompleted, setIsCompleted] = useState(false); // 할 일 완료 상태

  // UI 상태 관리
  const [loading, setLoading] = useState(true); // 데이터 로딩 중 여부
  const [error, setError] = useState<string | null>(null); // 에러 메시지

  // 파일 입력(input type="file")에 접근하기 위한 ref
  const fileInputRef = useRef<HTMLInputElement>(null);

  /**
   * 할 일 데이터 불러오기 이펙트
   * 컴포넌트 마운트 시 또는 itemId 변경 시 해당 할 일 데이터를 API로부터 불러옵니다.
   */
  useEffect(() => {
    // itemId가 유효하지 않으면 홈으로 리다이렉트
    if (!params.itemId || isNaN(itemId)) {
      setLoading(false);
      setError("아이템 ID가 유효하지 않습니다.");
      router.push("/");
      return;
    }

    /**
     * 비동기 함수: 할 일 데이터를 서버로부터 가져옵니다.
     */
    const fetchItem = async () => {
      setLoading(true); // 로딩 상태 시작
      setError(null); // 이전 에러 초기화
      try {
        // API 엔드포인트로 GET 요청
        const res = await fetch(`/api/${TENANT_ID}/items/${itemId}`);
        if (!res.ok) {
          // HTTP 응답이 실패(res.ok가 false)한 경우
          if (res.status === 404) {
            // 404 Not Found 에러인 경우 특정 메시지 설정 및 홈으로 리다이렉트
            setError("할 일을 찾을 수 없습니다.");
            router.push("/");
            return;
          }
          // 그 외의 HTTP 에러 발생 시 오류 throw
          throw new Error(`Failed to fetch item: ${res.statusText}`);
        }
        const result = await res.json(); // JSON 응답 파싱
        if (result.success) {
          // API 응답이 성공(result.success가 true)한 경우
          const fetchedItem: Item = result.data;
          setItem(fetchedItem); // 할 일 데이터 설정
          setEditedName(fetchedItem.name); // 수정 필드 초기화 (이름)
          setEditedMemo(fetchedItem.memo || ""); // 수정 필드 초기화 (메모, 없으면 빈 문자열)
          setIsCompleted(fetchedItem.isCompleted); // 완료 상태 설정
          setEditedImageUrl(fetchedItem.imageUrl || null); // 이미지 URL 설정 (없으면 null)
        } else {
          // API 응답은 성공했으나, 로직 상 실패(result.success가 false)한 경우
          throw new Error(result.message || "Failed to fetch item data");
        }
      } catch (err: unknown) {
        // 네트워크 오류 등 예외 발생 시
        console.error("Error fetching item details:", err);
        if (err instanceof Error) {
          setError(err.message || "할 일 정보를 불러오는 데 실패했습니다.");
        } else {
          setError("알 수 없는 오류가 발생했습니다.");
        }
      } finally {
        setLoading(false); // 로딩 상태 종료
      }
    };

    fetchItem(); // 할 일 데이터 불러오기 함수 호출
  }, [itemId, router, params.itemId]); // 의존성 배열: itemId, router, params.itemId가 변경될 때마다 이펙트 재실행

  /**
   * 할 일 이름 변경 핸들러
   * @param {string} newName - 새로 입력된 할 일 이름
   */
  const handleNameChange = (newName: string) => {
    setEditedName(newName);
  };

  /**
   * 메모 내용 변경 핸들러
   * @param {string} newMemo - 새로 입력된 메모 내용
   */
  const handleMemoChange = (newMemo: string) => {
    setEditedMemo(newMemo);
  };

  /**
   * 할 일 완료 상태 토글 핸들러
   * API를 호출하여 할 일의 완료 상태를 업데이트합니다.
   * @param {number} id - 변경할 할 일의 ID
   * @param {boolean} newStatus - 변경될 완료 상태 (true: 완료, false: 미완료)
   */
  const handleToggleTodoStatus = async (id: number, newStatus: boolean) => {
    if (!item || item.id !== id) return; // 현재 아이템이 없거나 ID가 일치하지 않으면 종료

    setIsCompleted(newStatus); // UI를 즉시 업데이트 ( optimistic update )
    const prevItem = item; // 에러 발생 시 되돌리기 위한 이전 상태 저장

    // 업데이트될 할 일 객체 생성
    const updatedItem: Item = {
      ...item, // 기존 아이템 데이터 복사
      isCompleted: newStatus, // 완료 상태 업데이트
      name: editedName, // 현재 편집 중인 이름으로 업데이트
      memo: editedMemo, // 현재 편집 중인 메모로 업데이트
      imageUrl: editedImageUrl, // 현재 편집 중인 이미지 URL로 업데이트
    };

    try {
      // API 엔드포인트로 PUT 요청 (데이터 수정)
      const response = await fetch(`/api/${TENANT_ID}/items/${itemId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json", // JSON 형식으로 전송
        },
        body: JSON.stringify(updatedItem), // 업데이트된 아이템 데이터를 JSON 문자열로 변환하여 전송
      });

      if (!response.ok) {
        // HTTP 응답이 실패한 경우
        const errorData = await response.json();
        throw new Error(
          `HTTP error! status: ${response.status} - ${
            errorData.message || "Unknown error"
          }`
        );
      }

      const result = await response.json();
      if (result.success) {
        // API 응답이 성공한 경우, 서버로부터 반환된 최신 데이터로 상태 업데이트
        setItem(result.data);
      } else {
        // API 응답은 성공했으나, 로직 상 실패한 경우
        throw new Error(result.message || "Failed to toggle item status");
      }
    } catch (err: unknown) {
      // 에러 발생 시 콘솔에 로그 출력 및 사용자에게 알림
      console.error("Failed to toggle todo status:", err);
      if (err instanceof Error) {
        alert(`상태 변경 실패: ${err.message}`);
      } else {
        alert("상태 변경 실패: 알 수 없는 오류");
      }
      // UI 상태를 이전으로 되돌림 ( optimistic update 롤백 )
      setIsCompleted(!newStatus);
      setItem(prevItem);
    }
  };

  /**
   * 이미지 파일 변경 핸들러
   * 사용자가 파일을 선택하면 해당 파일을 읽어 데이터 URL로 변환하고 `editedImageUrl` 상태를 업데이트합니다.
   * @param {React.ChangeEvent<HTMLInputElement>} event - 파일 입력 변경 이벤트 객체
   */
  const handleImageFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0]; // 선택된 첫 번째 파일 가져오기
    if (file) {
      try {
        const reader = new FileReader(); // FileReader 객체 생성
        reader.onloadend = () => {
          // 파일 읽기 완료 시 실행될 콜백 함수
          setEditedImageUrl(reader.result as string); // 읽은 결과를 이미지 URL로 설정
        };
        reader.readAsDataURL(file); // 파일을 Data URL로 읽기 시작
      } catch (uploadError: unknown) {
        // 파일 읽기 중 에러 발생 시
        console.error("이미지 업로드 중 오류 발생:", uploadError);
        if (uploadError instanceof Error) {
          alert("이미지 업로드 중 오류가 발생했습니다: " + uploadError.message);
        } else {
          alert("이미지 업로드 중 알 수 없는 오류가 발생했습니다.");
        }
      }
    }
  };

  /**
   * 이미지 버튼 클릭 핸들러
   * 숨겨진 파일 입력 필드를 클릭하여 파일 선택 대화상자를 엽니다.
   */
  const handleImageButtonClick = () => {
    fileInputRef.current?.click(); // ref를 통해 input[type="file"] 클릭 이벤트 발생
  };

  /**
   * 할 일 저장 핸들러
   * 현재 편집 중인 이름, 메모, 이미지 URL을 포함하여 할 일 데이터를 API를 통해 업데이트합니다.
   */
  const handleSaveItem = async () => {
    if (!item) return; // 현재 아이템 데이터가 없으면 종료

    // 업데이트될 할 일 객체 생성
    const updatedItem: Item = {
      ...item,
      name: editedName,
      memo: editedMemo,
      imageUrl: editedImageUrl,
      isCompleted: isCompleted,
    };

    try {
      // API 엔드포인트로 PUT 요청 (데이터 수정)
      const res = await fetch(`/api/${TENANT_ID}/items/${itemId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedItem),
      });

      if (!res.ok) {
        throw new Error(`Failed to update item: ${res.statusText}`);
      }
      const result = await res.json();
      if (result.success) {
        setItem(result.data); // 서버로부터 반환된 최신 데이터로 상태 업데이트
        alert("할 일이 성공적으로 수정되었습니다.");
        router.push("/"); // 수정 완료 후 홈 페이지로 이동
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

  /**
   * 할 일 삭제 핸들러
   * 사용자 확인 후 API를 호출하여 할 일을 삭제합니다.
   */
  const handleDeleteItem = async () => {
    if (!item) return; // 현재 아이템 데이터가 없으면 종료

    // 사용자에게 삭제 확인 메시지 표시
    const confirmDelete = window.confirm("정말로 이 할 일을 삭제하시겠습니까?");
    if (!confirmDelete) return; // 사용자가 취소하면 종료

    try {
      // API 엔드포인트로 DELETE 요청
      const res = await fetch(`/api/${TENANT_ID}/items/${itemId}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        throw new Error(`Failed to delete item: ${res.statusText}`);
      }
      const result = await res.json();
      if (result.success) {
        alert("할 일이 성공적으로 삭제되었습니다.");
        router.push("/"); // 삭제 완료 후 홈 페이지로 이동
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

  // -------------------------------------------------------------
  // UI 렌더링 부분
  // -------------------------------------------------------------

  // 로딩 중일 때 표시되는 UI
  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingErrorState}>로딩 중...</div>
      </div>
    );
  }

  // 에러 발생 시 표시되는 UI
  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingErrorState}>{error}</div>
      </div>
    );
  }

  // 할 일 데이터를 찾을 수 없을 때 (로딩/에러가 아님에도 item이 null인 경우)
  if (!item) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingErrorState}>
          할 일 데이터를 찾을 수 없습니다. (혹은 잘못된 접근)
        </div>
      </div>
    );
  }

  // 할 일 데이터가 성공적으로 로드되었을 때의 UI
  return (
    <div className={styles.container}>
      <main className={styles.mainContent}>
        {/* 할 일 이름 및 완료 상태를 표시하고 수정하는 컴포넌트 */}
        <CheckListDetail
          item={{ id: item.id, name: editedName, isCompleted: isCompleted }}
          onNameChange={handleNameChange}
          onToggleStatus={handleToggleTodoStatus}
        />
        <div className={styles.detailContainer}>
          {/* 이미지 입력/표시 섹션 */}
          <div className={styles.imageInputContainer}>
            {editedImageUrl ? (
              // 이미지가 있을 경우 이미지와 수정 버튼 표시
              <>
                <Image
                  src={editedImageUrl}
                  alt="할 일 관련 이미지"
                  width={600}
                  height={311}
                  // Next.js Image 컴포넌트의 스타일 속성
                  style={{ objectFit: "cover", borderRadius: "12px" }}
                  className={styles.uploadedImage}
                />
                <div className={styles.imageButtons}>
                  <Button
                    variant="detailImageEdit"
                    icon="edit"
                    onClick={handleImageButtonClick} // 이미지 수정 버튼 클릭 시 파일 선택 열기
                    aria-label="이미지 수정"
                  />
                </div>
              </>
            ) : (
              // 이미지가 없을 경우 플레이스홀더 및 이미지 추가 버튼 표시
              <div
                className={styles.imagePlaceholder}
                onClick={handleImageButtonClick} // 플레이스홀더 클릭 시 파일 선택 열기
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
                    e.stopPropagation(); // 부모 div의 onClick 이벤트 전파 방지
                    handleImageButtonClick(); // 이미지 추가 버튼 클릭 시 파일 선택 열기
                  }}
                  className={styles.imageAddButton}
                  aria-label="이미지 추가"
                />
              </div>
            )}
            {/* 실제 파일 선택을 위한 숨겨진 input 요소 */}
            <input
              type="file"
              accept="image/*" // 이미지 파일만 허용
              ref={fileInputRef} // useRef로 접근
              onChange={handleImageFileChange} // 파일 변경 시 핸들러 호출
              style={{ display: "none" }} // 화면에 표시하지 않음
            />
          </div>

          <div className={styles.moveContainer}>
            {/* 메모 섹션 */}
            <div className={styles.memoContainer}>
              <div className={styles.memoTitle}>Memo</div>
              <textarea
                className={styles.memoTextarea}
                value={editedMemo}
                onChange={(e) => handleMemoChange(e.target.value)} // 텍스트 영역 변경 시 핸들러 호출
                placeholder="메모를 입력하세요..."
              />
            </div>

            {/* 버튼 그룹 (수정 완료, 삭제) */}
            <div className={styles.buttonGroup}>
              <Button
                type="button"
                variant="submitSuccess"
                icon="check"
                onClick={handleSaveItem} // 저장 버튼 클릭 시 핸들러 호출
                isActive={isCompleted} // 완료 상태에 따라 버튼 활성화/비활성화 (스타일)
              >
                수정 완료
              </Button>
              <Button
                type="button"
                variant="delete"
                icon="x"
                onClick={handleDeleteItem} // 삭제 버튼 클릭 시 핸들러 호출
              >
                삭제하기
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
