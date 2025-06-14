// src/lib/data.ts

export interface Item {
  id: number;
  tenantId: string;
  name: string;
  memo: string | null;
  imageUrl: string | null;
  isCompleted: boolean;
}

let items: Item[] = [
  {
    id: 1,
    tenantId: "defaultTenant", // tenantId를 'defaultTenant'로 변경하여 프론트엔드와 일치시킴
    name: "Learn Next.js",
    memo: "Finish the official tutorial",
    imageUrl: null,
    isCompleted: false,
  },
  {
    id: 2,
    tenantId: "defaultTenant", // tenantId를 'defaultTenant'로
    name: "Build a todo app",
    memo: "Apply what I learned",
    imageUrl: null,
    isCompleted: true,
  },
  {
    id: 3,
    tenantId: "defaultTenant", // tenantId를 'defaultTenant'로
    name: "Project brainstorming",
    memo: "Come up with new ideas",
    imageUrl: null,
    isCompleted: false,
  },
];

let nextId =
  items.length > 0 ? Math.max(...items.map((item) => item.id)) + 1 : 1;

export const getItems = (
  tenantId: string,
  cursor?: number,
  size: number = 20
): { items: Item[]; nextCursor: number | null; hasNext: boolean } => {
  const filteredItems = items
    .filter((item) => item.tenantId === tenantId)
    .sort((a, b) => a.id - b.id); // ID 순으로 정렬

  let startIndex = 0;
  if (cursor) {
    const cursorIndex = filteredItems.findIndex((item) => item.id === cursor);
    if (cursorIndex !== -1) {
      startIndex = cursorIndex + 1;
    }
  }

  // 이 변수들을 return 문 밖에서 선언합니다.
  const paginatedItems = filteredItems.slice(startIndex, startIndex + size);
  const newNextCursor =
    paginatedItems.length > 0
      ? paginatedItems[paginatedItems.length - 1].id
      : null;
  const newHasNext = startIndex + size < filteredItems.length;

  return {
    items: paginatedItems,
    nextCursor: newNextCursor,
    hasNext: newHasNext,
  };
};

export const getItemById = (
  tenantId: string,
  itemId: number
): Item | undefined => {
  return items.find((item) => item.tenantId === tenantId && item.id === itemId);
};

export const createItem = (
  tenantId: string,
  newItemData: Omit<
    Item,
    "id" | "tenantId" | "isCompleted" | "memo" | "imageUrl"
  > & { memo?: string | null; imageUrl?: string | null; isCompleted?: boolean }
): Item => {
  const newItem: Item = {
    id: nextId++,
    tenantId,
    name: newItemData.name,
    memo: newItemData.memo !== undefined ? newItemData.memo : null,
    imageUrl: newItemData.imageUrl !== undefined ? newItemData.imageUrl : null,
    isCompleted:
      newItemData.isCompleted !== undefined ? newItemData.isCompleted : false,
  };
  items.push(newItem);
  return newItem;
};

export const updateItem = (
  tenantId: string,
  itemId: number,
  updateData: Partial<Omit<Item, "id" | "tenantId">>
): Item | undefined => {
  const itemIndex = items.findIndex(
    (item) => item.tenantId === tenantId && item.id === itemId
  );
  if (itemIndex === -1) {
    return undefined;
  }
  const existingItem = items[itemIndex];
  const updatedItem: Item = {
    ...existingItem,
    ...updateData,
    isCompleted:
      updateData.isCompleted !== undefined
        ? updateData.isCompleted
        : existingItem.isCompleted,
    memo: updateData.memo !== undefined ? updateData.memo : existingItem.memo,
    imageUrl:
      updateData.imageUrl !== undefined
        ? updateData.imageUrl
        : existingItem.imageUrl,
  };
  items[itemIndex] = updatedItem;
  return updatedItem;
};

export const deleteItem = (tenantId: string, itemId: number): boolean => {
  const initialLength = items.length;
  items = items.filter(
    (item) => !(item.tenantId === tenantId && item.id === itemId)
  );
  return items.length < initialLength;
};
