import { useEffect, useMemo, useState } from "react";

import { createCategory, deleteCategory, getCategories, updateCategory } from "@/api/categoryApi";
import { Button, DataPanel, EmptyState, ErrorState, FormField, PageIntro, SkeletonBlock } from "@/components/ui";

const INITIAL_FORM = {
  name: "",
  parentId: "",
};

export function AdminCategoriesPage() {
  const [state, setState] = useState({
    loading: true,
    saving: false,
    deletingId: null,
    error: "",
    feedback: "",
    data: [],
  });
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(INITIAL_FORM);

  const availableParents = useMemo(
    () => state.data.filter((category) => category.id !== editingId),
    [state.data, editingId]
  );

  useEffect(() => {
    let ignore = false;

    async function load() {
      try {
        const data = await getCategories();
        if (!ignore) {
          setState((current) => ({
            ...current,
            loading: false,
            error: "",
            data,
          }));
        }
      } catch (error) {
        if (!ignore) {
          setState((current) => ({
            ...current,
            loading: false,
            error: error.response?.data?.message || "Không thể tải danh mục.",
            data: [],
          }));
        }
      }
    }

    load();
    return () => {
      ignore = true;
    };
  }, []);

  function resetForm() {
    setEditingId(null);
    setForm(INITIAL_FORM);
  }

  async function reloadWithFeedback(message) {
    const data = await getCategories();
    setState((current) => ({
      ...current,
      loading: false,
      saving: false,
      deletingId: null,
      error: "",
      feedback: message,
      data,
    }));
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  function startEdit(category) {
    setEditingId(category.id);
    setForm({
      name: category.name || "",
      parentId: category.parentId ? String(category.parentId) : "",
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setState((current) => ({
        ...current,
        saving: true,
        error: "",
        feedback: "",
      }));

      const payload = {
        name: form.name,
        parentId: form.parentId ? Number(form.parentId) : null,
      };

      if (editingId) {
        await updateCategory(editingId, payload);
        await reloadWithFeedback("Danh mục đã được cập nhật.");
      } else {
        await createCategory(payload);
        await reloadWithFeedback("Danh mục mới đã được tạo.");
      }

      resetForm();
    } catch (error) {
      setState((current) => ({
        ...current,
        saving: false,
        error: error.response?.data?.message || "Không thể lưu danh mục.",
      }));
    }
  }

  async function handleDelete(category) {
    const confirmed = window.confirm(`Xóa danh mục "${category.name}"?`);
    if (!confirmed) {
      return;
    }

    try {
      setState((current) => ({
        ...current,
        deletingId: category.id,
        error: "",
        feedback: "",
      }));
      await deleteCategory(category.id);
      if (editingId === category.id) {
        resetForm();
      }
      await reloadWithFeedback("Danh mục đã được xóa.");
    } catch (error) {
      setState((current) => ({
        ...current,
        deletingId: null,
        error: error.response?.data?.message || "Không thể xóa danh mục.",
      }));
    }
  }

  return (
    <div className="stack">
      <PageIntro
        meta="Quản trị"
        title="Danh mục"
        description="Giữ taxonomy gọn và rõ để phần public, employer editor và báo cáo nội bộ luôn dùng cùng một hệ phân loại."
      />

      {state.loading ? <SkeletonBlock lines={6} title="Đang tải danh mục..." /> : null}
      {state.feedback ? <div className="message-banner">{state.feedback}</div> : null}
      {state.error ? <ErrorState description={state.error} /> : null}

      {!state.loading && !state.error ? (
        <div className="employer-dashboard-grid">
          <DataPanel
            title={editingId ? "Cập nhật danh mục" : "Tạo danh mục mới"}
            description="Điền tên rõ ràng và chỉ gán danh mục cha khi thật sự cần nhóm nội dung."
          >
            <form className="stack" onSubmit={handleSubmit}>
              <FormField htmlFor="category-name" label="Tên danh mục">
                <input
                  id="category-name"
                  name="name"
                  onChange={handleChange}
                  placeholder="Ví dụ: Công nghệ thông tin"
                  type="text"
                  value={form.name}
                />
              </FormField>

              <FormField htmlFor="category-parent" label="Danh mục cha" hint="Có thể để trống nếu đây là danh mục cấp gốc.">
                <select id="category-parent" name="parentId" onChange={handleChange} value={form.parentId}>
                  <option value="">Không chọn</option>
                  {availableParents.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </FormField>

              <div className="button-row">
                <Button type="submit" variant="primary">
                  {state.saving ? "Đang lưu..." : editingId ? "Lưu thay đổi" : "Tạo danh mục"}
                </Button>
                {editingId ? (
                  <Button onClick={resetForm} type="button" variant="secondary">
                    Hủy chỉnh sửa
                  </Button>
                ) : null}
              </div>
            </form>
          </DataPanel>

          <DataPanel
            title={`Danh sách danh mục (${state.data.length})`}
            description="Bạn có thể chỉnh sửa nhanh từng mục hoặc xóa nếu chưa được dùng bởi tin tuyển dụng hay danh mục con."
          >
            {state.data.length ? (
              <div className="timeline-list">
                {state.data.map((category) => (
                  <div className="timeline-card admin-timeline-card" key={category.id}>
                    <div className="stack stack--xs">
                      <strong>{category.name}</strong>
                      <span className="muted">{category.parentName ? `Thuộc nhóm ${category.parentName}` : "Danh mục cấp gốc"}</span>
                    </div>
                    <div className="table-actions">
                      <button className="button button--secondary" onClick={() => startEdit(category)} type="button">
                        Sửa
                      </button>
                      <button
                        className="button button--danger"
                        disabled={state.deletingId === category.id}
                        onClick={() => handleDelete(category)}
                        type="button"
                      >
                        {state.deletingId === category.id ? "Đang xóa..." : "Xóa"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState title="Chưa có danh mục" description="Tạo vài danh mục đầu tiên để employer có thể phân loại tin tuyển dụng rõ ràng hơn." />
            )}
          </DataPanel>
        </div>
      ) : null}
    </div>
  );
}
