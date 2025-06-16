// src/app/api/[tenantId]/items/[itemId]/route.ts

/**
 * @file route.ts
 * @brief Next.js Route Handler for specific todo items.
 *
 * 이 파일은 `/api/[tenantId]/items/[itemId]` 경로에 대한 API 요청을 처리합니다.
 * GET: 특정 할 일 아이템 조회
 * PUT: 특정 할 일 아이템 업데이트 (전체 교체)
 * DELETE: 특정 할 일 아이템 삭제
 *
 * `tenantId`와 `itemId`는 동적 라우팅 파라미터로 URL에서 추출됩니다.
 */

import { NextRequest, NextResponse } from "next/server";
// 데이터 모델 및 CRUD 함수 임포트
import { getItemById, updateItem, deleteItem, Item } from "@/lib/data";

/**
 * GET 요청 핸들러: 특정 할 일 아이템 조회
 * GET /api/[tenantId]/items/[itemId]
 *
 * @param {NextRequest} request - Next.js 요청 객체
 * @param {{ params: Record<string, string> }} { params } - 동적 라우팅 파라미터 (tenantId, itemId)
 * @returns {NextResponse} 응답 객체 (성공 시 아이템 데이터, 실패 시 에러 메시지)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Record<string, string> }
) {
  // URL 파라미터에서 tenantId와 itemId 추출
  const { tenantId, itemId } = params;
  // itemId를 정수로 변환
  const parsedItemId = parseInt(itemId, 10);

  // itemId가 유효한 숫자가 아닌 경우 400 Bad Request 응답
  if (isNaN(parsedItemId)) {
    return NextResponse.json(
      { success: false, message: "Invalid itemId" },
      { status: 400 }
    );
  }

  // 데이터 계층에서 특정 아이템 조회
  const item = getItemById(tenantId, parsedItemId);

  // 아이템을 찾을 수 없는 경우 404 Not Found 응답
  if (!item) {
    return NextResponse.json(
      { success: false, message: "Item not found" },
      { status: 404 }
    );
  }

  // 성공적으로 아이템을 찾은 경우 200 OK 응답과 함께 데이터 반환
  return NextResponse.json({ success: true, data: item });
}

/**
 * PUT 요청 핸들러: 특정 할 일 아이템 업데이트 (전체 교체)
 * PUT /api/[tenantId]/items/[itemId]
 *
 * @param {NextRequest} request - Next.js 요청 객체 (요청 본문에 업데이트 데이터 포함)
 * @param {{ params: Record<string, string> }} { params } - 동적 라우팅 파라미터 (tenantId, itemId)
 * @returns {NextResponse} 응답 객체 (성공 시 업데이트된 아이템 데이터, 실패 시 에러 메시지)
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Record<string, string> }
) {
  // URL 파라미터에서 tenantId와 itemId 추출
  const { tenantId, itemId } = params;
  // itemId를 정수로 변환
  const parsedItemId = parseInt(itemId, 10);

  // itemId가 유효한 숫자가 아닌 경우 400 Bad Request 응답
  if (isNaN(parsedItemId)) {
    return NextResponse.json(
      { success: false, message: "Invalid itemId" },
      { status: 400 }
    );
  }

  try {
    // 요청 본문(body)을 JSON으로 파싱
    const body = await request.json();

    // Item 타입에서 id와 tenantId를 제외한 업데이트 데이터 객체 생성
    const updateData: Omit<Item, "id" | "tenantId"> = {
      name: body.name,
      memo: body.memo !== undefined ? body.memo : null, // memo가 undefined면 null로 설정
      imageUrl: body.imageUrl !== undefined ? body.imageUrl : null, // imageUrl이 undefined면 null로 설정
      isCompleted: body.isCompleted,
    };

    // 데이터 유효성 검사: name 필드는 필수이며 비어있지 않아야 함
    if (typeof updateData.name !== "string" || updateData.name.trim() === "") {
      return NextResponse.json(
        {
          success: false,
          message: "Name is required and must be a non-empty string.",
        },
        { status: 400 }
      );
    }
    // 데이터 유효성 검사: isCompleted 필드는 boolean 타입이어야 함
    if (typeof updateData.isCompleted !== "boolean") {
      return NextResponse.json(
        { success: false, message: "isCompleted must be a boolean." },
        { status: 400 }
      );
    }

    // 데이터 계층에서 아이템 업데이트 시도
    const updatedItem = updateItem(tenantId, parsedItemId, updateData);

    // 업데이트에 실패했거나 아이템을 찾지 못한 경우 404 Not Found 응답
    if (!updatedItem) {
      return NextResponse.json(
        { success: false, message: "Item not found or failed to update" },
        { status: 404 }
      );
    }

    // 성공적으로 업데이트된 경우 200 OK 응답과 함께 업데이트된 데이터 반환
    return NextResponse.json({ success: true, data: updatedItem });
  } catch (error) {
    // 요청 본문 파싱 실패 등 예외 발생 시 콘솔에 로그 출력 및 400 Bad Request 응답
    console.error("Error updating item:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to parse request body or internal error",
      },
      { status: 400 }
    );
  }
}

/**
 * DELETE 요청 핸들러: 특정 할 일 아이템 삭제
 * DELETE /api/[tenantId]/items/[itemId]
 *
 * @param {NextRequest} request - Next.js 요청 객체
 * @param {{ params: Record<string, string> }} { params } - 동적 라우팅 파라미터 (tenantId, itemId)
 * @returns {NextResponse} 응답 객체 (성공 시 메시지, 실패 시 에러 메시지)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Record<string, string> }
) {
  // URL 파라미터에서 tenantId와 itemId 추출
  const { tenantId, itemId } = params;
  // itemId를 정수로 변환
  const parsedItemId = parseInt(itemId, 10);

  // itemId가 유효한 숫자가 아닌 경우 400 Bad Request 응답
  if (isNaN(parsedItemId)) {
    return NextResponse.json(
      { success: false, message: "Invalid itemId" },
      { status: 400 }
    );
  }

  // 데이터 계층에서 아이템 삭제 시도
  const deleted = deleteItem(tenantId, parsedItemId);

  // 삭제에 실패했거나 아이템을 찾지 못한 경우 404 Not Found 응답
  if (!deleted) {
    return NextResponse.json(
      { success: false, message: "Item not found or failed to delete" },
      { status: 404 }
    );
  }

  // 성공적으로 삭제된 경우 200 OK 응답과 함께 성공 메시지 반환
  return NextResponse.json({
    success: true,
    message: "Item deleted successfully",
  });
}
