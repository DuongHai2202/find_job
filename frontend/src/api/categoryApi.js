import { http } from "@/api/http";

export async function getCategories() {
  const { data } = await http.get("/categories");
  return data;
}

export async function createCategory(payload) {
  const { data } = await http.post("/categories", {
    name: payload.name?.trim() || "",
    parentId: payload.parentId ?? null,
  });
  return data;
}

export async function updateCategory(categoryId, payload) {
  const { data } = await http.put(`/categories/${categoryId}`, {
    name: payload.name?.trim() || "",
    parentId: payload.parentId ?? null,
  });
  return data;
}

export async function deleteCategory(categoryId) {
  await http.delete(`/categories/${categoryId}`);
}
