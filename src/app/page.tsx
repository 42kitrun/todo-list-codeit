// src/app/page.tsx

"use client";

import React, { useEffect, useState } from "react";
import Search from "../components/common/Search";
import CheckListItem from "../components/todo/CheckListItem";
import CheckListDetail from "../components/todo/CheckListDetail";
import Image from "next/image";
import styles from "./page.module.css"; // page.module.css 임포트 (새로 생성)

interface TodoItem {
  id: string;
  title: string;
  status: "TODO" | "DONE";
  memo: string | null;
}

const HomePage: React.FC = () => {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [filter, setFilter] = useState<"ALL" | "TODO" | "DONE">("ALL");
  const [selectedTodo, setSelectedTodo] = useState<TodoItem | null>(null);

  useEffect(() => {
    const dummyTodos: TodoItem[] = [
      {
        id: "1",
        title: "비타민 챙겨 먹기",
        status: "TODO",
        memo: "하루 한 번, 식후 30분",
      },
      {
        id: "2",
        title: "프로젝트 계획서 작성",
        status: "DONE",
        memo: "기획안 초안 완성, 회의 준비",
      },
      { id: "3", title: "장보기", status: "TODO", memo: "우유, 계란, 사과" },
    ];
    setTodos(dummyTodos);
  }, []);

  const handleAddTask = (title: string) => {
    const newTask: TodoItem = {
      id: Date.now().toString(),
      title,
      status: "TODO",
      memo: null,
    };
    setTodos((prevTodos) => [...prevTodos, newTask]);
  };

  const handleToggleTodo = (id: string) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === id
          ? { ...todo, status: todo.status === "DONE" ? "TODO" : "DONE" }
          : todo
      )
    );
  };

  const handleOpenDetail = (item: TodoItem) => {
    setSelectedTodo(item);
  };

  const handleSaveDetail = (
    id: string,
    newTitle: string,
    newMemo: string | null
  ) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === id ? { ...todo, title: newTitle, memo: newMemo } : todo
      )
    );
    setSelectedTodo(null);
  };

  const handleDeleteDetail = (id: string) => {
    if (confirm("이 할 일을 삭제하시겠습니까?")) {
      setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
      setSelectedTodo(null);
    }
  };

  const handleCloseDetail = () => {
    setSelectedTodo(null);
  };

  const hasTodos = todos.length > 0;
  const filteredTodos = todos.filter((item) => {
    if (filter === "ALL") return true;
    return item.status === filter;
  });

  return (
    <>
      <main className={styles.mainContainer}>
        {" "}
        {/* 인라인 스타일 대신 클래스 적용 */}
        <Search onAddTask={handleAddTask} hasTodos={hasTodos} />
        <hr className={styles.divider} /> {/* 인라인 스타일 대신 클래스 적용 */}
        <div className={styles.filterButtonContainer}>
          {" "}
          {/* 필터링 버튼 컨테이너 */}
          <button
            onClick={() => setFilter("ALL")}
            className={`${styles.filterButton} ${
              filter === "ALL" ? styles.filterActive : ""
            }`}
          >
            ALL
          </button>
          <button
            onClick={() => setFilter("TODO")}
            className={`${styles.filterButton} ${
              filter === "TODO" ? styles.filterActive : ""
            }`}
          >
            TO DO
          </button>
          <button
            onClick={() => setFilter("DONE")}
            className={`${styles.filterButton} ${
              filter === "DONE" ? styles.filterActive : ""
            }`}
          >
            DONE
          </button>
        </div>
        <div className={styles.checkListContainer}>
          {" "}
          {/* 할 일 목록 컨테이너 */}
          {filteredTodos.length > 0 ? (
            filteredTodos.map((item) => (
              <CheckListItem
                key={item.id}
                item={item}
                onToggle={handleToggleTodo}
                onClick={() => handleOpenDetail(item)}
              />
            ))
          ) : (
            <div className={styles.emptyStateContainer}>
              {" "}
              {/* 빈 상태 컨테이너 */}
              <div className={styles.emptyStateColumn}>
                <Image
                  src="/img/empty-todo-large.svg"
                  alt="할 일 없음"
                  width={100}
                  height={100}
                />
                <p className={styles.emptyStateText}>할 일이 없어요.</p>
                <p className={styles.emptyStateText}>
                  TODO를 새롭게 추가해주세요!
                </p>
              </div>
              <div className={styles.emptyStateColumn}>
                <Image
                  src="/img/empty-done-large.svg"
                  alt="완료된 할 일 없음"
                  width={100}
                  height={100}
                />
                <p className={styles.emptyStateText}>
                  아직 다 한 할 일이 없어요!
                </p>
                <p className={styles.emptyStateText}>
                  해야 할 일을 확인해보세요!
                </p>
              </div>
            </div>
          )}
        </div>
      </main>

      {selectedTodo && (
        <CheckListDetail
          id={selectedTodo.id}
          initialTitle={selectedTodo.title}
          initialStatus={selectedTodo.status}
          initialMemo={selectedTodo.memo}
          onSave={handleSaveDetail}
          onDelete={handleDeleteDetail}
          onClose={handleCloseDetail}
        />
      )}
    </>
  );
};

export default HomePage;
