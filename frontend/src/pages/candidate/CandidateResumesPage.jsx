import { useEffect, useState } from "react";

import { createResume, deleteResume, getMyResumes, updateResume, uploadResume } from "@/api/candidateApi";
import { env } from "@/config/env";
import { DataPanel, EmptyState, PageIntro, SkeletonBlock } from "@/components/ui";
import { buildResumeDownloadUrl, formatCompactNumber, formatDateTime } from "@/utils/format";

const initialResumeForm = {
  title: "",
  fileUrl: "",
  content: "",
};

export function CandidateResumesPage() {
  const [resumes, setResumes] = useState([]);
  const [form, setForm] = useState(initialResumeForm);
  const [uploadTitle, setUploadTitle] = useState("");
  const [file, setFile] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function loadResumes() {
    const data = await getMyResumes();
    setResumes(data);
  }

  useEffect(() => {
    loadResumes()
      .catch((requestError) => setError(requestError.response?.data?.message || "Không thể tải danh sách CV."))
      .finally(() => setLoading(false));
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setMessage("");
    setError("");

    try {
      if (editingId) {
        await updateResume(editingId, form);
        setMessage("Đã cập nhật CV.");
      } else {
        await createResume(form);
        setMessage("Đã tạo CV mới.");
      }
      setForm(initialResumeForm);
      setEditingId(null);
      await loadResumes();
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Không thể lưu CV.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleUpload(event) {
    event.preventDefault();
    if (!file || !uploadTitle) {
      setError("Cần chọn file và tiêu đề CV.");
      return;
    }

    setSubmitting(true);
    setMessage("");
    setError("");

    try {
      const formData = new FormData();
      formData.append("title", uploadTitle);
      formData.append("file", file);
      await uploadResume(formData);
      setUploadTitle("");
      setFile(null);
      setMessage("Đã tải CV lên hệ thống.");
      await loadResumes();
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Tải CV lên thất bại.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(resumeId) {
    try {
      await deleteResume(resumeId);
      setMessage("Đã xóa CV.");
      await loadResumes();
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Không thể xóa CV.");
    }
  }

  function startEdit(resume) {
    setEditingId(resume.id);
    setForm({
      title: resume.title || "",
      fileUrl: resume.fileUrl || "",
      content: resume.content || "",
    });
  }

  return (
    <div className="stack">
      <PageIntro description="Bạn có thể tạo CV dạng nội dung, gắn file URL hoặc tải file trực tiếp lên hệ thống." meta="Ứng viên" title="Quản lý CV" />
      {message ? <div className="message-banner">{message}</div> : null}
      {error ? <div className="message-banner message-banner--error">{error}</div> : null}

      <div className="dashboard-grid">
        <DataPanel description="Dùng khi bạn muốn lưu CV dưới dạng nội dung hoặc đường dẫn file." title={editingId ? "Cập nhật CV" : "Tạo CV thủ công"}>
          <form className="form-grid" onSubmit={handleSubmit}>
            <div className="field">
              <label htmlFor="resume-title">Tiêu đề</label>
              <input id="resume-title" onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))} required value={form.title} />
            </div>
            <div className="field">
              <label htmlFor="resume-url">File URL</label>
              <input id="resume-url" onChange={(event) => setForm((current) => ({ ...current, fileUrl: event.target.value }))} value={form.fileUrl} />
            </div>
            <div className="field">
              <label htmlFor="resume-content">Nội dung</label>
              <textarea id="resume-content" onChange={(event) => setForm((current) => ({ ...current, content: event.target.value }))} value={form.content} />
            </div>
            <div className="button-row">
              <button className="button button--primary" disabled={submitting} type="submit">
                {submitting ? "Đang lưu..." : editingId ? "Cập nhật CV" : "Tạo CV"}
              </button>
              {editingId ? (
                <button
                  className="button button--secondary"
                  onClick={() => {
                    setEditingId(null);
                    setForm(initialResumeForm);
                  }}
                  type="button"
                >
                  Hủy sửa
                </button>
              ) : null}
            </div>
          </form>
        </DataPanel>

        <DataPanel description="Dùng endpoint tải tệp để lưu file CV thật lên hệ thống." title="Tải file CV">
          <form className="form-grid" onSubmit={handleUpload}>
            <div className="field">
              <label htmlFor="resume-upload-title">Tiêu đề CV</label>
              <input id="resume-upload-title" onChange={(event) => setUploadTitle(event.target.value)} required value={uploadTitle} />
            </div>
            <div className="field">
              <label htmlFor="resume-upload-file">File</label>
              <input id="resume-upload-file" onChange={(event) => setFile(event.target.files?.[0] || null)} type="file" />
            </div>
            <button className="button button--primary" disabled={submitting} type="submit">
              {submitting ? "Đang tải lên..." : "Tải CV lên"}
            </button>
          </form>
        </DataPanel>
      </div>

      <DataPanel title={`Danh sách CV (${formatCompactNumber(resumes.length)})`}>
        {loading ? (
          <SkeletonBlock lines={6} />
        ) : resumes.length ? (
          <div className="table-card">
            {resumes.map((resume) => (
              <div className="table-row" key={resume.id}>
                <div className="table-cell">
                  <strong>{resume.title}</strong>
                  <span className="muted">{resume.originalFileName || "CV dạng nội dung hoặc liên kết"}</span>
                </div>
                <div className="table-cell">
                  <span>{resume.storageProvider || "Inline/URL"}</span>
                </div>
                <div className="table-cell">
                  <span>{formatDateTime(resume.updatedAt)}</span>
                </div>
                <div className="table-actions">
                  <button className="button button--secondary" onClick={() => startEdit(resume)} type="button">
                    Sửa
                  </button>
                  {resume.fileUrl ? (
                    <a className="button button--ghost" href={resume.fileUrl} rel="noreferrer" target="_blank">
                      Mở file
                    </a>
                  ) : (
                    <a className="button button--ghost" href={buildResumeDownloadUrl(env.apiUrl, resume.id)} rel="noreferrer" target="_blank">
                      Tải xuống
                    </a>
                  )}
                  <button className="button button--danger" onClick={() => handleDelete(resume.id)} type="button">
                    Xóa
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState description="Bạn có thể tạo CV thủ công hoặc tải file CV thật lên hệ thống." title="Chưa có CV nào" />
        )}
      </DataPanel>
    </div>
  );
}
