// src/app/page.tsx

"use client";

import React, { useState, useEffect } from "react";
import Button from "../components/todo/Button";
import ChecklistItem from "../components/todo/ChecklistItem";
import CheckListDetail from "../components/todo/CheckListDetail";
import Search from "../components/common/Search"; // Search 컴포넌트 임포트 유지
// Gnb는 layout.tsx에서 렌더링하므로 여기서 임포트할 필요 없음
// import Gnb from "../components/common/Gnb";

import { type TodoItem } from "../components/todo/CheckListDetail";

const API_BASE_URL = "/api";

export default function Home() {
  const [isSubmitActive, setIsSubmitActive] = useState(false);
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDetailItem, setSelectedDetailItem] = useState<TodoItem | null>(
    null
  );

  const fetchTodos = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE_URL}/todos`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: TodoItem[] = await response.json();
      setTodos(data);
      if (data.length > 0) {
        setSelectedDetailItem(data[0]);
      } else {
        setSelectedDetailItem(null);
      }
    } catch (err) {
      setError("할 일 목록을 불러오는 데 실패했습니다.");
      console.error("Failed to fetch todos:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const handleButtonClick = (buttonName: string) => {
    alert(`${buttonName} 버튼 클릭됨!`);
  };

  const handleToggleComplete = async (id: string) => {
    const todoToToggle = todos.find((todo) => todo.id === id);
    if (!todoToToggle) return;

    const newStatus = todoToToggle.status === "TODO" ? "DONE" : "TODO";
    const updatedTodo = { ...todoToToggle, status: newStatus };

    setTodos((prevTodos) =>
      prevTodos.map((todo) => (todo.id === id ? updatedTodo : todo))
    );
    setSelectedDetailItem((prevDetailItem) =>
      prevDetailItem && prevDetailItem.id === id ? updatedTodo : prevDetailItem
    );

    try {
      const response = await fetch(`${API_BASE_URL}/todos/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: updatedTodo.title,
          status: updatedTodo.status,
          memo: updatedTodo.memo || null,
        }),
      });
      if (!response.ok) {
        throw new Error(`Failed to update todo: ${response.status}`);
      }
    } catch (err) {
      console.error("Error updating todo:", err);
      setError("할 일 상태 업데이트에 실패했습니다. UI를 롤백합니다.");
      setTodos(todos);
      setSelectedDetailItem(todoToToggle);
    }
  };

  const handleSaveDetail = async (updatedItem: TodoItem) => {
    alert(
      `상세 정보 저장됨: ${updatedItem.title}, 상태: ${updatedItem.status}`
    );
    console.log("Updated Detail Item:", updatedItem);

    try {
      const response = await fetch(`${API_BASE_URL}/todos/${updatedItem.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: updatedItem.title,
          status: updatedItem.status,
          memo: updatedItem.memo || null,
        }),
      });
      if (!response.ok) {
        throw new Error(`Failed to save detail: ${response.status}`);
      }
      setTodos((prevTodos) =>
        prevTodos.map((todo) =>
          todo.id === updatedItem.id ? updatedItem : todo
        )
      );
      setSelectedDetailItem(updatedItem);
    } catch (err) {
      console.error("Error saving detail:", err);
      setError("할 일 상세 정보 저장에 실패했습니다.");
    }
  };

  const handleDeleteDetail = async (itemId: string) => {
    alert(`할 일 삭제됨: ${itemId}`);
    console.log("Deleted Item ID:", itemId);

    try {
      const response = await fetch(`${API_BASE_URL}/todos/${itemId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error(`Failed to delete todo: ${response.status}`);
      }
      setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== itemId));
      setSelectedDetailItem(null);
    } catch (err) {
      console.error("Error deleting todo:", err);
      setError("할 일 삭제에 실패했습니다.");
    }
  };

  const handleAddTask = async (title: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/todos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, memo: null }),
      });
      if (!response.ok) {
        throw new Error(`Failed to add task: ${response.status}`);
      }
      const newTask: TodoItem = await response.json();
      setTodos((prevTodos) => [newTask, ...prevTodos]);
    } catch (err) {
      console.error("Error adding task:", err);
      setError("할 일 추가에 실패했습니다.");
    }
  };

  if (loading) {
    return (
      <main style={{ padding: "20px" }}>
        <h1>로딩 중...</h1>
      </main>
    );
  }

  if (error) {
    return (
      <main style={{ padding: "20px", color: "red" }}>
        <h1>에러: {error}</h1>
        <button
          onClick={fetchTodos}
          style={{ marginTop: "10px", padding: "8px 15px", cursor: "pointer" }}
        >
          다시 시도
        </button>
      </main>
    );
  }

  return (
    // page.tsx의 메인 콘텐츠
    <main
      style={{
        padding: "20px", // Gnb와의 공간을 고려하여 padding 조정 필요 (Gnb 높이만큼 top padding)
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        alignItems: "flex-start",
        backgroundColor: "var(--background)",
        minHeight: "100vh", // 전체 뷰포트 높이 고려
        width: "100%",
        maxWidth: "600px",
        margin: "0 auto",
        color: "var(--foreground)",
      }}
    >
      {/* Search 컴포넌트가 이제 main 태그 내부에 위치합니다. */}
      <Search onAddTask={handleAddTask} />

      <hr
        style={{
          width: "100%",
          border: "1px solid var(--slate-200)",
          margin: "20px 0",
        }}
      />

      <h2>Button Component Test Page</h2>
      <Button
        variant="add"
        icon="plus"
        onClick={() => handleButtonClick("기본 추가하기")}
      >
        추가하기
      </Button>
      <Button
        variant="addInitial"
        icon="plus"
        onClick={() => handleButtonClick("초기 추가하기 (텍스트)")}
      >
        추가하기
      </Button>
      <Button
        variant="addInitial"
        icon="plus"
        onClick={() => handleButtonClick("초기 추가하기 (아이콘만)")}
      />
      <Button
        variant="delete"
        icon="x"
        onClick={() => handleButtonClick("삭제하기")}
      >
        삭제하기
      </Button>
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <Button
          variant="submitSuccess"
          icon="check"
          isActive={isSubmitActive}
          onClick={() => handleButtonClick("수정 완료")}
          disabled={!isSubmitActive}
        >
          수정 완료
        </Button>
        <button
          onClick={() => setIsSubmitActive(!isSubmitActive)}
          style={{
            padding: "5px 10px",
            backgroundColor: "var(--slate-200)",
            color: "var(--slate-900)",
            borderRadius: "5px",
            cursor: "pointer",
            border: "none",
          }}
        >
          {isSubmitActive ? "비활성화하기" : "활성화하기"}
        </button>
      </div>
      <Button
        variant="iconImageAdd"
        icon="plusLarge"
        onClick={() => handleButtonClick("이미지 추가")}
      />
      <Button
        variant="iconImageEdit"
        icon="edit"
        onClick={() => handleButtonClick("이미지 수정")}
      />
      <hr
        style={{
          width: "100%",
          border: "1px solid var(--slate-200)",
          margin: "20px 0",
        }}
      />

      <h2>ChecklistItem Component Test</h2>
      <p>할 일 목록 아이템 테스트 (로컬 API에서 가져온 데이터):</p>
      <div
        style={{
          width: "100%",
          maxWidth: "527px",
          display: "flex",
          flexDirection: "column",
          gap: "12px",
        }}
      >
        {todos.map((todo) => (
          <ChecklistItem
            key={todo.id}
            item={todo}
            onToggle={handleToggleComplete}
          />
        ))}
      </div>

      <hr
        style={{
          width: "100%",
          border: "1px solid var(--slate-200)",
          margin: "20px 0",
        }}
      />

      {selectedDetailItem && (
        <>
          <h2>CheckListDetail Component Test (목록에서 선택된 아이템)</h2>
          <p>할 일 상세 페이지 컴포넌트 테스트:</p>
          <CheckListDetail
            item={selectedDetailItem}
            onSave={handleSaveDetail}
            onDelete={handleDeleteDetail}
          />
        </>
      )}

      <div style={{ height: "50px" }}></div>
    </main>
  );
}
