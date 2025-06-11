// src/app/api/todos/route.ts

import { NextResponse } from "next/server";

// 가상의 Todo 데이터 (데이터베이스 대신 사용)
let todos = [
  {
    id: "1",
    title: "비타민 챙겨 먹기",
    status: "TODO",
    memo: "매일 아침 식사 후 복용",
  },
  {
    id: "2",
    title: "프로젝트 계획서 작성",
    status: "DONE",
    memo: "프론트엔드 심화과정 과제",
  },
  {
    id: "3",
    title: "점심 식사",
    status: "TODO",
    memo: undefined, // 메모 없는 경우
  },
  {
    id: "4",
    title: "운동하기",
    status: "TODO",
    memo: "러닝 30분, 팔굽혀펴기 20회",
  },
];

// GET 요청 처리 (모든 할 일 목록 조회)
export async function GET() {
  return NextResponse.json(todos);
}

// PUT 요청 처리 (할 일 상태 및 내용 수정)
export async function PUT(request: Request) {
  const url = new URL(request.url);
  const id = url.pathname.split("/").pop(); // URL에서 id 추출

  if (!id) {
    return NextResponse.json({ message: "ID is required" }, { status: 400 });
  }

  const body = await request.json();
  const { title, status, memo } = body;

  const todoIndex = todos.findIndex((todo) => todo.id === id);

  if (todoIndex === -1) {
    return NextResponse.json({ message: "Todo not found" }, { status: 404 });
  }

  const updatedTodo = {
    ...todos[todoIndex],
    title: title !== undefined ? title : todos[todoIndex].title,
    status: status !== undefined ? status : todos[todoIndex].status,
    memo: memo !== undefined ? memo : todos[todoIndex].memo,
  };

  todos[todoIndex] = updatedTodo;

  return NextResponse.json(updatedTodo);
}

// DELETE 요청 처리 (할 일 삭제)
export async function DELETE(request: Request) {
  const url = new URL(request.url);
  const id = url.pathname.split("/").pop(); // URL에서 id 추출

  if (!id) {
    return NextResponse.json({ message: "ID is required" }, { status: 400 });
  }

  const initialLength = todos.length;
  todos = todos.filter((todo) => todo.id !== id);

  if (todos.length === initialLength) {
    return NextResponse.json({ message: "Todo not found" }, { status: 404 });
  }

  return new NextResponse(null, { status: 204 }); // No Content
}

// POST 요청 처리 (새 할 일 추가) - 필요하다면 구현
export async function POST(request: Request) {
  const body = await request.json();
  const { title, memo } = body;

  if (!title) {
    return NextResponse.json({ message: "Title is required" }, { status: 400 });
  }

  const newTodo = {
    id: (Math.random() * 1000).toFixed(0).toString(), // 간단한 ID 생성
    title,
    status: "TODO" as "TODO" | "DONE",
    memo: memo || undefined,
  };
  todos.push(newTodo);
  return NextResponse.json(newTodo, { status: 201 });
}
