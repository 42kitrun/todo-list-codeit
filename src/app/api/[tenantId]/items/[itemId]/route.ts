// src/app/api/[tenantId]/items/[itemId]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getItemById, updateItem, deleteItem, Item } from "@/lib/data";

// GET /api/[tenantId]/items/[itemId] - 특정 아이템 조회
export async function GET(
  request: NextRequest,
  // { params }: { params: { tenantId: string; itemId: string } } <-- 기존
  { params }: { params: Record<string, string> } // <-- 여기를 이렇게 변경합니다.
) {
  const { tenantId, itemId } = params;
  const parsedItemId = parseInt(itemId, 10);

  if (isNaN(parsedItemId)) {
    return NextResponse.json(
      { success: false, message: "Invalid itemId" },
      { status: 400 }
    );
  }

  const item = getItemById(tenantId, parsedItemId);

  if (!item) {
    return NextResponse.json(
      { success: false, message: "Item not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true, data: item });
}

// PUT /api/[tenantId]/items/[itemId] - 특정 아이템 업데이트 (전체 교체)
export async function PUT(
  request: NextRequest,
  // { params }: { params: { tenantId: string; itemId: string } } <-- 기존
  { params }: { params: Record<string, string> } // <-- 여기를 이렇게 변경합니다.
) {
  const { tenantId, itemId } = params;
  const parsedItemId = parseInt(itemId, 10);

  if (isNaN(parsedItemId)) {
    return NextResponse.json(
      { success: false, message: "Invalid itemId" },
      { status: 400 }
    );
  }

  try {
    const body = await request.json();

    const updateData: Omit<Item, "id" | "tenantId"> = {
      name: body.name,
      memo: body.memo !== undefined ? body.memo : null,
      imageUrl: body.imageUrl !== undefined ? body.imageUrl : null,
      isCompleted: body.isCompleted,
    };

    if (typeof updateData.name !== "string" || updateData.name.trim() === "") {
      return NextResponse.json(
        {
          success: false,
          message: "Name is required and must be a non-empty string.",
        },
        { status: 400 }
      );
    }
    if (typeof updateData.isCompleted !== "boolean") {
      return NextResponse.json(
        { success: false, message: "isCompleted must be a boolean." },
        { status: 400 }
      );
    }

    const updatedItem = updateItem(tenantId, parsedItemId, updateData);

    if (!updatedItem) {
      return NextResponse.json(
        { success: false, message: "Item not found or failed to update" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: updatedItem });
  } catch (error) {
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

// DELETE /api/[tenantId]/items/[itemId] - 특정 아이템 삭제
export async function DELETE(
  request: NextRequest,
  // { params }: { params: { tenantId: string; itemId: string } } <-- 기존
  { params }: { params: Record<string, string> } // <-- 여기를 이렇게 변경합니다.
) {
  const { tenantId, itemId } = params;
  const parsedItemId = parseInt(itemId, 10);

  if (isNaN(parsedItemId)) {
    return NextResponse.json(
      { success: false, message: "Invalid itemId" },
      { status: 400 }
    );
  }

  const deleted = deleteItem(tenantId, parsedItemId);

  if (!deleted) {
    return NextResponse.json(
      { success: false, message: "Item not found or failed to delete" },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    message: "Item deleted successfully",
  });
}
