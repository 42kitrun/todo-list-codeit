// src/app/page.tsx

"use client"; // 이 파일이 클라이언트 측에서 렌더링됨을 명시

/**
 * @file page.tsx
 * @brief Todo List 애플리케이션의 메인 페이지 컴포넌트입니다.
 *
 * 할 일 목록을 조회하고, 새로운 할 일을 추가하며,
 * 기존 할 일의 완료 상태를 토글하는 기능을 제공합니다.
 * Next.js의 클라이언트 컴포넌트(Client Component)로 작동합니다.
 */

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image"; // Next.js Image 컴포넌트
import { useRouter } from "next/navigation"; // 페이지 라우팅을 위한 useRouter 훅
import styles from "./page.module.css"; // CSS 모듈 임포트
import Search from "@/components/common/Search"; // 검색 컴포넌트
import Button from "@/components/todo/Button"; // 버튼 컴포넌트
import CheckListItem from "@/components/todo/CheckListItem"; // 할 일 목록 아이템 컴포넌트

// API 명세 및 lib/data.ts의 Item 타입에 맞게 TodoItem 타입 정의
// 이 인터페이스는 할 일 아이템의 구조를 정의합니다.
interface TodoItem {
  id: number; // 할 일의 고유 ID (숫자 타입)
  name: string; // 할 일의 이름 (문자열)
  isCompleted: boolean; // 완료 여부 (불리언: true/false)
  memo: string | null; // 메모 (문자열 또는 null)
  imageUrl: string | null; // 이미지 URL (문자열 또는 null)
}

// API 요청에 사용될 고정된 Tenant ID (실제 배포 시에는 환경 변수 등으로 관리 권장)
const TENANT_ID = "defaultTenant";

/**
 * HomePage 컴포넌트
 *
 * 할 일 목록을 표시하고 관리하는 메인 페이지 UI를 렌더링합니다.
 */
const HomePage: React.FC = () => {
  const router = useRouter(); // Next.js 라우터 훅 초기화

  // 상태 관리 훅
  const [todoItems, setTodoItems] = useState<TodoItem[]>([]); // 할 일 아이템 목록
  const [loading, setLoading] = useState<boolean>(true); // 로딩 상태
  const [error, setError] = useState<string | null>(null); // 에러 메시지
  const [taskNameInput, setTaskNameInput] = useState<string>(""); // 새로운 할 일 이름 입력 필드 값

  /**
   * 할 일 목록을 서버에서 가져오는 비동기 함수.
   * useCallback 훅을 사용하여 의존성 배열(dependency array)이 변경될 때만 함수가 재생성되도록 최적화.
   */
  const fetchTodos = useCallback(async () => {
    setLoading(true); // 로딩 시작
    setError(null); // 에러 상태 초기화
    try {
      // API 엔드포인트로 GET 요청
      const response = await fetch(`/api/${TENANT_ID}/items`);
      // HTTP 응답 상태가 2xx가 아닌 경우 에러 발생
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // API 응답 데이터를 JSON으로 파싱
      const result: {
        success: boolean;
        data?: { items: TodoItem[]; page: unknown }; // `data`는 `success`가 false일 때 없을 수 있으므로 optional
        message?: string; // `message` 속성 추가 (API 응답 명세에 따라)
      } = await response.json();

      // API 응답의 `success` 필드가 false인 경우 에러 처리
      if (!result.success) {
        throw new Error(result.message || "Failed to fetch items from API");
      }
      // `data` 또는 `data.items`가 없는 경우 방어 코드
      if (!result.data || !result.data.items) {
        throw new Error("API response data is malformed: missing items array.");
      }

      // `id`를 기준으로 할 일 목록을 오름차순 정렬
      result.data.items.sort((a, b) => a.id - b.id);
      setTodoItems(result.data.items); // 정렬된 목록으로 상태 업데이트
    } catch (err) {
      // 에러 발생 시 콘솔에 로그 출력 및 에러 상태 업데이트
      console.error("Failed to fetch todos:", err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred.");
      }
    } finally {
      setLoading(false); // 로딩 종료
    }
  }, []); // 의존성 배열이 비어 있으므로 컴포넌트 마운트 시 한 번만 생성

  // 컴포넌트 마운트 시 할 일 목록을 가져오도록 useEffect 훅 사용
  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]); // `fetchTodos` 함수가 변경될 때만 실행 (최초 마운트 시 한 번)

  /**
   * '추가하기' 버튼 클릭 시 새로운 할 일을 생성하는 핸들러.
   */
  const handleAddTaskClick = async () => {
    if (!taskNameInput.trim()) return; // 입력 필드가 비어있으면 아무것도 하지 않음

    try {
      // API 엔드포인트로 POST 요청 (새로운 할 일 생성)
      const response = await fetch(`/api/${TENANT_ID}/items`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // JSON 형식으로 데이터 전송 명시
        },
        body: JSON.stringify({ name: taskNameInput }), // 요청 본문에 name 필드만 포함
      });

      // 응답이 성공적이지 않은 경우 에러 처리
      if (!response.ok) {
        const errorData = await response.json(); // 서버에서 보낸 에러 메시지 파싱
        throw new Error(
          `HTTP error! status: ${response.status} - ${
            errorData.message || "Unknown error"
          }`
        );
      }

      await response.json(); // 새로 생성된 아이템 데이터를 받을 수도 있지만, 여기서는 다시 목록을 불러옴
      await fetchTodos(); // 할 일 목록 새로고침
      setTaskNameInput(""); // 입력 필드 초기화
    } catch (err) {
      // 에러 발생 시 사용자에게 알림
      console.error("Failed to add task:", err);
      if (err instanceof Error) {
        alert(`할 일 추가 실패: ${err.message}`);
      } else {
        alert("할 일 추가 실패: 알 수 없는 오류");
      }
    }
  };

  /**
   * 할 일 아이템의 완료 상태를 토글하는 핸들러.
   * @param {number} id - 상태를 변경할 할 일 아이템의 ID
   */
  const handleToggleTodoStatus = async (id: number) => {
    const itemToUpdate = todoItems.find((item) => item.id === id); // 해당 ID의 아이템 찾기
    if (!itemToUpdate) return; // 아이템이 없으면 함수 종료

    const newIsCompleted = !itemToUpdate.isCompleted; // 현재 상태의 반대 값

    try {
      // API 엔드포인트로 PUT 요청 (특정 할 일 아이템 업데이트)
      const response = await fetch(`/api/${TENANT_ID}/items/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        // PUT 요청 시 API 명세에 따라 모든 필드를 포함하여 보냄
        body: JSON.stringify({
          name: itemToUpdate.name,
          memo: itemToUpdate.memo,
          imageUrl: itemToUpdate.imageUrl,
          isCompleted: newIsCompleted, // 변경된 완료 상태
        }),
      });

      // 응답이 성공적이지 않은 경우 에러 처리
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `HTTP error! status: ${response.status} - ${
            errorData.message || "Unknown error"
          }`
        );
      }

      await response.json(); // 업데이트된 아이템 데이터를 받을 수 있음 (여기서는 무시)
      await fetchTodos(); // 할 일 목록 새로고침하여 UI 업데이트
    } catch (err) {
      // 에러 발생 시 사용자에게 알림
      console.error("Failed to toggle todo status:", err);
      if (err instanceof Error) {
        alert(`상태 변경 실패: ${err.message}`);
      } else {
        alert("상태 변경 실패: 알 수 없는 오류");
      }
    }
  };

  /**
   * 할 일 항목 클릭 시 상세 페이지로 이동하는 핸들러.
   * @param {TodoItem} item - 클릭된 할 일 아이템 객체
   */
  const handleItemClick = (item: TodoItem) => {
    router.push(`/${item.id}`); // Next.js 라우터를 사용하여 동적 경로로 이동
  };

  // '할 일' (isCompleted: false) 목록과 '완료된 일' (isCompleted: true) 목록 필터링
  const todoList = todoItems.filter((item) => !item.isCompleted);
  const doneList = todoItems.filter((item) => item.isCompleted);

  // 전체 todoItems 배열이 비어있는지 확인하여 '추가하기' 버튼의 variant 결정
  const isEmptyTodoList = todoItems.length === 0;

  return (
    <div className={styles.container}>
      <main className={styles.mainContent}>
        {/* 검색 입력 필드와 할 일 추가 버튼 컨테이너 */}
        <div className={styles.searchAndButtonContainer}>
          <Search
            value={taskNameInput} // 입력 필드 값 바인딩
            onChange={(e) => setTaskNameInput(e.target.value)} // 입력 값 변경 핸들러
          />
          {/* '추가하기' 버튼 */}
          <Button
            type="button"
            variant={isEmptyTodoList ? "addInitial" : "add"} // 조건부 variant 적용
            icon="plus" // 아이콘 설정
            iconPosition="left" // 아이콘 위치
            onClick={handleAddTaskClick} // 클릭 핸들러
          >
            추가하기
          </Button>
        </div>

        {/* 로딩 및 에러 메시지 표시 */}
        {loading && <p className={styles.loadingText}>Loading tasks...</p>}
        {error && (
          <p className={styles.errorText}>
            Error: {error}
            <br />
            API 서버가 실행 중인지 확인해주세요.
          </p>
        )}

        {/* 로딩 중이 아니고 에러도 없을 때만 할 일 목록 표시 */}
        {!loading && !error && (
          <div className={styles.todoAndDoneSection}>
            {/* '할 일' 섹션 */}
            <section className={styles.todoSection}>
              <Image
                src="/img/todo.svg"
                alt="할 일"
                width={101}
                height={36}
                className={styles.sectionIcon}
              />

              {/* 할 일 목록이 비어있는 경우 Empty State 표시 */}
              {todoList.length === 0 ? (
                <div className={styles.emptyState}>
                  <Image
                    src="/img/empty-todo-large.svg"
                    alt="할 일 없음"
                    width={180}
                    height={180}
                    className={styles.emptyImageLarge}
                  />
                  <Image
                    src="/img/empty-todo-small.svg"
                    alt="할 일 없음"
                    width={120}
                    height={120}
                    className={styles.emptyImageSmall}
                  />
                  <p className={styles.emptyText}>
                    할 일이 없어요. TODO를 새로 추가해주세요!
                  </p>
                </div>
              ) : (
                // 할 일 목록이 있는 경우 CheckListItem 렌더링
                <div className={styles.todoList}>
                  {todoList.map((item) => (
                    <CheckListItem
                      key={item.id} // 고유 key prop
                      item={item} // 아이템 데이터 전달
                      onToggle={handleToggleTodoStatus} // 상태 토글 핸들러
                      onClick={handleItemClick} // 아이템 클릭 핸들러 (상세 페이지 이동)
                    />
                  ))}
                </div>
              )}
            </section>

            {/* '완료된 일' 섹션 */}
            <section className={styles.doneSection}>
              <Image
                src="/img/done.svg"
                alt="완료"
                width={101}
                height={36}
                className={styles.sectionIcon}
              />

              {/* 완료된 할 일 목록이 비어있는 경우 Empty State 표시 */}
              {doneList.length === 0 ? (
                <div className={styles.emptyState}>
                  <Image
                    src="/img/empty-done-large.svg"
                    alt="완료된 할 일 없음"
                    width={180}
                    height={180}
                    className={styles.emptyImageLarge}
                  />
                  <Image
                    src="/img/empty-done-small.svg"
                    alt="완료된 할 일 없음"
                    width={120}
                    height={120}
                    className={styles.emptyImageSmall}
                  />
                  <p className={styles.emptyText}>
                    아직 다 한 할 일이 없어요. 해야 할 일을 체크해보세요!
                  </p>
                </div>
              ) : (
                // 완료된 할 일 목록이 있는 경우 CheckListItem 렌더링
                <div className={styles.doneList}>
                  {doneList.map((item) => (
                    <CheckListItem
                      key={item.id}
                      item={item}
                      onToggle={handleToggleTodoStatus}
                      onClick={handleItemClick}
                    />
                  ))}
                </div>
              )}
            </section>
          </div>
        )}
      </main>
    </div>
  );
};

export default HomePage;
