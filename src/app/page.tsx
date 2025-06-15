// src/app/page.tsx
"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation"; // useRouter 임포트 추가
import styles from "./page.module.css";
import Search from "@/components/common/Search";
import Button from "@/components/todo/Button";
import CheckListItem from "@/components/todo/CheckListItem";

// API 명세 및 lib/data.ts의 Item 타입에 맞게 TodoItem 타입 정의
interface TodoItem {
  id: number; // API 명세에 따라 number
  name: string; // title 대신 name
  isCompleted: boolean; // status 대신 isCompleted (boolean)
  memo: string | null; // memo는 string 또는 null (optional 아님)
  imageUrl: string | null; // imageUrl은 string 또는 null (optional 아님)
}

// API 기본 URL과 고정된 tenantId
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000"; // 로컬 개발 시 기본값 설정
const TENANT_ID = "defaultTenant"; // 여기에 실제 tenantId를 사용하거나 동적으로 가져와야 함

const HomePage: React.FC = () => {
  const router = useRouter(); // useRouter 훅 초기화
  const [todoItems, setTodoItems] = useState<TodoItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [taskNameInput, setTaskNameInput] = useState<string>(""); // title 대신 name 입력

  // 할 일 목록 조회
  const fetchTodos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/api/${TENANT_ID}/items`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      // API 응답 데이터 구조에 맞춰 파싱
      // **이 부분 수정:** message 속성 추가
      const result: {
        success: boolean;
        data?: { items: TodoItem[]; page: unknown }; // data는 success가 false일 때 없을 수도 있으니 optional로
        message?: string; // message 속성 추가
      } = await response.json();

      if (!result.success) {
        throw new Error(result.message || "Failed to fetch items from API");
      }
      // data가 없을 경우를 대비하여 방어 코드 추가
      if (!result.data || !result.data.items) {
        throw new Error("API response data is malformed: missing items array.");
      }

      // id는 number 타입이므로 정렬 방식 변경
      result.data.items.sort((a, b) => a.id - b.id);
      setTodoItems(result.data.items);
    } catch (err) {
      console.error("Failed to fetch todos:", err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred.");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  // 할 일 추가 버튼 클릭 핸들러
  const handleAddTaskClick = async () => {
    if (!taskNameInput.trim()) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/${TENANT_ID}/items`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: taskNameInput }), // CreateItemDto는 name만 가짐
      });

      if (!response.ok) {
        const errorData = await response.json(); // 에러 응답도 파싱
        throw new Error(
          `HTTP error! status: ${response.status} - ${
            errorData.message || "Unknown error"
          }`
        );
      }

      await response.json(); // 새로 생성된 아이템 데이터를 받을 수도 있음 (여기서는 일단 무시)
      await fetchTodos();
      setTaskNameInput(""); // 입력 필드 초기화
    } catch (err) {
      console.error("Failed to add task:", err);
      if (err instanceof Error) {
        alert(`할 일 추가 실패: ${err.message}`);
      } else {
        alert("할 일 추가 실패: 알 수 없는 오류");
      }
    }
  };

  // 할 일 상태 토글 (PUT 사용)
  const handleToggleTodoStatus = async (id: number) => {
    // id 타입을 string -> number로 변경
    const itemToUpdate = todoItems.find((item) => item.id === id);
    if (!itemToUpdate) return;

    const newIsCompleted = !itemToUpdate.isCompleted;

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/${TENANT_ID}/items/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          // PUT 요청 시 모든 필드를 보내야 함 (명세에 따라)
          body: JSON.stringify({
            name: itemToUpdate.name,
            memo: itemToUpdate.memo,
            imageUrl: itemToUpdate.imageUrl,
            isCompleted: newIsCompleted, // 상태만 변경
          }),
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

      await response.json();
      await fetchTodos();
    } catch (err) {
      console.error("Failed to toggle todo status:", err);
      if (err instanceof Error) {
        alert(`상태 변경 실패: ${err.message}`);
      } else {
        alert("상태 변경 실패: 알 수 없는 오류");
      }
    }
  };

  // 할 일 항목 클릭 시 상세 페이지로 이동
  const handleItemClick = (item: TodoItem) => {
    router.push(`/${item.id}`); // /${itemId} 경로로 이동
  };

  // isCompleted 필드를 사용하여 필터링
  const todoList = todoItems.filter((item) => !item.isCompleted);
  const doneList = todoItems.filter((item) => item.isCompleted);

  const isEmptyTodoList = todoItems.length === 0; // 전체 todoItems 배열이 비어있는지 확인

  return (
    <div className={styles.container}>
      <main className={styles.mainContent}>
        {/* Search 컴포넌트와 Button 컴포넌트 분리 배치 */}
        <div className={styles.searchAndButtonContainer}>
          <Search
            value={taskNameInput} // taskTitleInput -> taskNameInput
            onChange={(e) => setTaskNameInput(e.target.value)} // taskTitleInput -> taskNameInput
          />

          {/* Button 컴포넌트 사용자의 variant에 맞게 수정 */}
          <Button
            type="button"
            variant={isEmptyTodoList ? "addInitial" : "add"}
            icon="plus"
            iconPosition="left"
            onClick={handleAddTaskClick}
          >
            추가하기
          </Button>
        </div>

        {loading && <p className={styles.loadingText}>Loading tasks...</p>}
        {error && (
          <p className={styles.errorText}>
            Error: {error}
            <br />
            API 서버가 실행 중인지 확인해주세요.
          </p>
        )}

        {!loading && !error && (
          <div className={styles.todoAndDoneSection}>
            <section className={styles.todoSection}>
              <Image
                src="/img/todo.svg"
                alt="할 일"
                width={101}
                height={36}
                className={styles.sectionIcon}
              />

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
                <div className={styles.todoList}>
                  {todoList.map((item) => (
                    <CheckListItem
                      key={item.id}
                      item={item} // TodoItem 타입 변경에 따라 CheckListItem의 item prop도 조정 필요
                      onToggle={handleToggleTodoStatus}
                      onClick={handleItemClick} // 여기에 handleItemClick 연결
                    />
                  ))}
                </div>
              )}
            </section>

            <section className={styles.doneSection}>
              <Image
                src="/img/done.svg"
                alt="완료"
                width={101}
                height={36}
                className={styles.sectionIcon}
              />

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
                <div className={styles.doneList}>
                  {doneList.map((item) => (
                    <CheckListItem
                      key={item.id}
                      item={item} // TodoItem 타입 변경에 따라 CheckListItem의 item prop도 조정 필요
                      onToggle={handleToggleTodoStatus}
                      onClick={handleItemClick} // 여기에 handleItemClick 연결
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
