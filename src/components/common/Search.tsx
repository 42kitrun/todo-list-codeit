// src/components/common/Search.tsx

import React, { useState } from "react";
import Button from "../todo/Button";
import styles from "./Search.module.css";

interface SearchProps {
  onAddTask: (taskTitle: string) => void;
  hasTodos: boolean;
}

const Search: React.FC<SearchProps> = ({ onAddTask, hasTodos }) => {
  const [taskTitle, setTaskTitle] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (taskTitle.trim()) {
      onAddTask(taskTitle.trim());
      setTaskTitle("");
    }
  };

  const buttonVariant = hasTodos ? "add" : "addInitial";

  return (
    <form className={styles.searchContainer} onSubmit={handleSubmit}>
      <input
        type="text"
        className={styles.searchInput}
        placeholder="할 일을 입력해주세요"
        value={taskTitle}
        onChange={(e) => setTaskTitle(e.target.value)}
      />
      <Button
        variant={buttonVariant}
        icon="plus"
        type="submit"
        disabled={!taskTitle.trim()} // taskTitle이 비어있으면 버튼 비활성화
      >
        추가하기
      </Button>
    </form>
  );
};

export default Search;
