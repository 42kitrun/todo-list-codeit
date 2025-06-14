// src/app/api/[tenantId]/items/route.ts

import { NextRequest, NextResponse } from "next/server";
import { getItems, createItem, Item } from "@/lib/data";

interface CreateItemDto {
  name: string;
}

// GET: 아이템 목록 조회
// { params } 인자를 async 함수에서 안전하게 구조 분해 할당합니다.
export async function GET(
  request: NextRequest,
  { params }: { params: { tenantId: string } } // 이 부분은 그대로 둡니다.
): Promise<
  NextResponse<{
    success: boolean;
    data?:
      | { items: Item[]; page: { nextCursor: number | null; hasNext: boolean } }
      | undefined;
    message?: string | undefined;
  }>
> {
  // params를 여기서 바로 사용합니다.
  const { tenantId } = params;

  const searchParams = request.nextUrl.searchParams;
  const cursorParam = searchParams.get("cursor");
  const sizeParam = searchParams.get("size");

  const cursor = cursorParam ? parseInt(cursorParam, 10) : undefined;
  const size = sizeParam ? parseInt(sizeParam, 10) : undefined;

  console.log(`GET /api/${tenantId}/items`);
  console.log(`Query Params - cursor: ${cursor}, size: ${size}`);

  try {
    const { items, nextCursor, hasNext } = getItems(tenantId, cursor, size);

    return NextResponse.json(
      {
        success: true,
        data: {
          items,
          page: {
            nextCursor,
            hasNext,
          },
        },
      },
      { status: 200 }
    );
  } catch (error) {
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

// POST 함수도 동일하게 적용
export async function POST(
  request: NextRequest,
  { params }: { params: { tenantId: string } }
): Promise<
  NextResponse<{
    success: boolean;
    data?: Item | undefined;
    message?: string | undefined;
  }>
> {
  const { tenantId } = params; // 동일하게 바로 사용

  console.log(`POST /api/${tenantId}/items`);

  try {
    const body: CreateItemDto = (await request.json()) as CreateItemDto;
    const { name } = body;

    if (!name || typeof name !== "string" || name.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid or missing name. Name must be a non-empty string.",
        },
        { status: 400 }
      );
    }

    const newItem = createItem(tenantId, { name });

    return NextResponse.json(
      {
        success: true,
        data: newItem,
      },
      { status: 201 }
    );
  } catch (error) {
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
