// src/app/api/[tenantId]/items/route.ts

/**
 * @file route.ts
 * @brief Next.js Route Handler for todo item collection.
 *
 * 이 파일은 `/api/[tenantId]/items` 경로에 대한 API 요청을 처리합니다.
 * GET: 할 일 아이템 목록 조회 (페이지네이션 지원)
 * POST: 새로운 할 일 아이템 생성
 *
 * `tenantId`는 동적 라우팅 파라미터로 URL에서 추출됩니다.
 */

import { NextRequest, NextResponse } from "next/server";
import { getItems, createItem, Item } from "@/lib/data";

/**
 * 새로운 아이템 생성을 위한 데이터 전송 객체 (DTO) 인터페이스.
 * 요청 본문(body)에 포함될 필드를 정의합니다.
 */
interface CreateItemDto {
  name: string; // 할 일의 이름 (필수)
}

/**
 * GET 요청 핸들러: 아이템 목록 조회
 * GET /api/[tenantId]/items?cursor={number}&size={number}
 *
 * @param {NextRequest} request - Next.js 요청 객체 (쿼리 파라미터 포함)
 * @param {{ params: Record<string, string> }} { params } - 동적 라우팅 파라미터 (tenantId)
 * @returns {Promise<NextResponse<any>>} 응답 객체 (성공 시 아이템 목록 및 페이지 정보, 실패 시 에러 메시지)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Record<string, string> }
): Promise<
  NextResponse<{
    success: boolean;
    data?:
      | { items: Item[]; page: { nextCursor: number | null; hasNext: boolean } }
      | undefined;
    message?: string | undefined;
  }>
> {
  // URL 파라미터에서 tenantId 추출
  const { tenantId } = params;

  // URL에서 쿼리 파라미터 추출
  const searchParams = request.nextUrl.searchParams;
  const cursorParam = searchParams.get("cursor"); // 'cursor' 쿼리 파라미터
  const sizeParam = searchParams.get("size"); // 'size' 쿼리 파라미터

  // cursor와 size를 정수로 변환, 없으면 undefined
  const cursor = cursorParam ? parseInt(cursorParam, 10) : undefined;
  const size = sizeParam ? parseInt(sizeParam, 10) : undefined;

  // 서버 콘솔에 요청 정보 로깅
  console.log(`GET /api/${tenantId}/items`);
  console.log(`Query Params - cursor: ${cursor}, size: ${size}`);

  try {
    // 데이터 계층에서 아이템 목록 조회 (페이지네이션 적용)
    const { items, nextCursor, hasNext } = getItems(tenantId, cursor, size);

    // 성공적으로 아이템을 조회한 경우 200 OK 응답과 함께 데이터 반환
    return NextResponse.json(
      {
        success: true,
        data: {
          items, // 조회된 아이템 배열
          page: {
            nextCursor, // 다음 페이지를 위한 커서 값
            hasNext, // 다음 페이지 존재 여부
          },
        },
      },
      { status: 200 }
    );
  } catch (error) {
    // 아이템 조회 중 에러 발생 시 콘솔에 로그 출력 및 500 Internal Server Error 응답
    console.error("Error fetching items:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch items",
      },
      { status: 500 }
    );
  }
}

/**
 * POST 요청 핸들러: 새로운 아이템 생성
 * POST /api/[tenantId]/items
 *
 * @param {NextRequest} request - Next.js 요청 객체 (요청 본문에 생성할 아이템 데이터 포함)
 * @param {{ params: Record<string, string> }} { params } - 동적 라우팅 파라미터 (tenantId)
 * @returns {Promise<NextResponse<any>>} 응답 객체 (성공 시 생성된 아이템 데이터, 실패 시 에러 메시지)
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Record<string, string> }
): Promise<
  NextResponse<{
    success: boolean;
    data?: Item | undefined;
    message?: string | undefined;
  }>
> {
  // URL 파라미터에서 tenantId 추출
  const { tenantId } = params;

  // 서버 콘솔에 요청 정보 로깅
  console.log(`POST /api/${tenantId}/items`);

  try {
    // 요청 본문(body)을 JSON으로 파싱하고 CreateItemDto 타입으로 캐스팅
    const body: CreateItemDto = (await request.json()) as CreateItemDto;
    const { name } = body; // 'name' 필드 추출

    // 데이터 유효성 검사: name 필드는 필수이며 문자열이고 비어있지 않아야 함
    if (!name || typeof name !== "string" || name.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid or missing name. Name must be a non-empty string.",
        },
        { status: 400 }
      );
    }

    // 데이터 계층에서 새로운 아이템 생성
    const newItem = createItem(tenantId, { name });

    // 성공적으로 아이템을 생성한 경우 201 Created 응답과 함께 생성된 데이터 반환
    return NextResponse.json(
      {
        success: true,
        data: newItem,
      },
      { status: 201 }
    );
  } catch (error) {
    // 아이템 생성 중 에러 발생 시 콘솔에 로그 출력 및 500 Internal Server Error 응답
    console.error("Error creating item:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to create item",
      },
      { status: 500 }
    );
  }
}
