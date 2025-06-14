// /api/[tenantId]/items/[itemId]/route.ts

import { NextRequest, NextResponse } from "next/server";
import { getItemById, updateItem, deleteItem, Item } from "@/lib/data"; // Item 인터페이스도 import

// UpdateItemDto 스키마 정의 (명세서 기반)
interface UpdateItemDto {
  name?: string;
  memo?: string | null;
  imageUrl?: string | null;
  isCompleted?: boolean;
}

// GET: 특정 아이템 조회
export async function GET(
  request: NextRequest,
  { params }: { params: { tenantId: string; itemId: string } }
): Promise<
  NextResponse<{
    success: boolean;
    data?: Item | undefined;
    message?: string | undefined;
  }>
> {
  const { tenantId, itemId } = params;
  const itemIdNum = parseInt(itemId, 10);

  if (isNaN(itemIdNum)) {
    return NextResponse.json(
      {
        success: false,
        message: "Invalid itemId. Must be a number.",
      },
      { status: 400 }
    );
  }

  console.log(`GET /api/${tenantId}/items/${itemId}`);

  try {
    const item = getItemById(tenantId, itemIdNum);

    if (!item) {
      return NextResponse.json(
        {
          success: false,
          message: "Item not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: item,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(`Error fetching item ${itemId}:`, error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch item",
      },
      { status: 500 }
    );
  }
}

// PUT: 특정 아이템 수정
export async function PUT(
  request: NextRequest,
  { params }: { params: { tenantId: string; itemId: string } }
): Promise<
  NextResponse<{
    success: boolean;
    data?: Item | undefined;
    message?: string | undefined;
  }>
> {
  const { tenantId, itemId } = params;
  const itemIdNum = parseInt(itemId, 10);

  if (isNaN(itemIdNum)) {
    return NextResponse.json(
      {
        success: false,
        message: "Invalid itemId. Must be a number.",
      },
      { status: 400 }
    );
  }

  console.log(`PUT /api/${tenantId}/items/${itemId}`);

  try {
    // 여기서 request.json()의 반환 값을 UpdateItemDto로 명시적으로 캐스팅합니다.
    const body: UpdateItemDto = (await request.json()) as UpdateItemDto;
    const { name, memo, imageUrl, isCompleted } = body;

    // 입력 유효성 검사 (UpdateItemDto 스키마)
    if (name !== undefined && (typeof name !== "string" || name.length === 0)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid name. Name must be a non-empty string.",
        },
        { status: 400 }
      );
    }
    if (memo !== undefined && memo !== null && typeof memo !== "string") {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid memo. Memo must be a string or null.",
        },
        { status: 400 }
      );
    }
    if (
      imageUrl !== undefined &&
      imageUrl !== null &&
      typeof imageUrl !== "string"
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid imageUrl. Image URL must be a string or null.",
        },
        { status: 400 }
      );
    }
    if (isCompleted !== undefined && typeof isCompleted !== "boolean") {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid isCompleted. isCompleted must be a boolean.",
        },
        { status: 400 }
      );
    }

    const updatedItem = updateItem(tenantId, itemIdNum, {
      name,
      memo,
      imageUrl,
      isCompleted,
    });

    if (!updatedItem) {
      return NextResponse.json(
        {
          success: false,
          message: "Item not found for update",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: updatedItem,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(`Error updating item ${itemId}:`, error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to update item",
      },
      { status: 500 }
    );
  }
}

// DELETE: 특정 아이템 삭제
export async function DELETE(
  request: NextRequest,
  { params }: { params: { tenantId: string; itemId: string } }
): Promise<NextResponse<{ success: boolean; message?: string | undefined }>> {
  const { tenantId, itemId } = params;
  const itemIdNum = parseInt(itemId, 10);

  if (isNaN(itemIdNum)) {
    return NextResponse.json(
      {
        success: false,
        message: "Invalid itemId. Must be a number.",
      },
      { status: 400 }
    );
  }

  console.log(`DELETE /api/${tenantId}/items/${itemId}`);

  try {
    const deleted = deleteItem(tenantId, itemIdNum);

    if (!deleted) {
      return NextResponse.json(
        {
          success: false,
          message: "Item not found for deletion",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: `Item ${itemId} deleted successfully`,
      },
      { status: 200 }
    ); // 또는 204 No Content
  } catch (error) {
    console.error(`Error deleting item ${itemId}:`, error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete item",
      },
      { status: 500 }
    );
  }
}
