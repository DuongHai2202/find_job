import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { getCategories } from "@/api/categoryApi";
import { createJob, getEmployerJobs, updateJob, updateJobStatus } from "@/api/employerApi";
import { ErrorState, PageIntro, SkeletonBlock } from "@/components/ui";

const initialForm = {
  title: "",
  location: "",
  salaryMin: "",
  salaryMax: "",
  jobType: "FULLTIME",
  level: "JUNIOR",
  categoryId: "",
  deadline: "",
  description: "",
  requirements: "",
  benefits: "",
  status: "DRAFT",
};

function buildJobPayload(form) {
  return {
    title: form.title,
    location: form.location,
    salaryMin: form.salaryMin ? Number(form.salaryMin) : null,
    salaryMax: form.salaryMax ? Number(form.salaryMax) : null,
    jobType: form.jobType,
    level: form.level,
    categoryId: form.categoryId ? Number(form.categoryId) : null,
    deadline: form.deadline || null,
    description: form.description,
    requirements: form.requirements,
    benefits: form.benefits,
  };
}

export function EmployerJobEditorPage({ mode }) {
  const navigate = useNavigate();
  const { jobId } = useParams();
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(mode === "edit");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    async function load() {
      try {
        const categoriesData = await getCategories();
        if (!ignore) {
          setCategories(categoriesData);
        }

        if (mode === "edit" && jobId) {
          const jobs = await getEmployerJobs({ page: 0, size: 100 });
          const job = jobs.content.find((item) => String(item.id) === String(jobId));

          if (!ignore) {
            if (!job) {
              setError("Không tìm thấy tin tuyển dụng cần chỉnh sửa.");
            } else {
              setForm({
                title: job.title || "",
                location: job.location || "",
                salaryMin: job.salaryMin || "",
                salaryMax: job.salaryMax || "",
                jobType: job.jobType || "FULLTIME",
                level: job.level || "JUNIOR",
                categoryId: job.category?.id ? String(job.category.id) : "",
                deadline: job.deadline ? String(job.deadline).slice(0, 10) : "",
                description: job.description || "",
                requirements: job.requirements || "",
                benefits: job.benefits || "",
                status: job.status || "DRAFT",
              });
            }
          }
        }
      } catch (requestError) {
        if (!ignore) {
          setError(requestError.response?.data?.message || "Không thể tải dữ liệu cho màn hình tin tuyển dụng.");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    load();
    return () => {
      ignore = true;
    };
  }, [jobId, mode]);

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");

    try {
      const payload = buildJobPayload(form);

      if (mode === "edit" && jobId) {
        const updatedJob = await updateJob(jobId, payload);
        if (form.status && form.status !== updatedJob.status) {
          await updateJobStatus(jobId, form.status);
        }
        setMessage("Đã cập nhật tin tuyển dụng.");
      } else {
        const createdJob = await createJob(payload);
        if (form.status && form.status !== createdJob.status) {
          await updateJobStatus(createdJob.id, form.status);
        }
        navigate("/employer/jobs");
        return;
      }
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Không thể lưu tin tuyển dụng.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <SkeletonBlock lines={8} />;
  }

  if (error && mode === "edit" && !form.title) {
    return <ErrorState description={error} />;
  }

  return (
    <div className="stack">
      <PageIntro
        action={
          <Link className="button button--secondary" to="/employer/jobs">
            Quay lại danh sách
          </Link>
        }
        description="Form này giờ đã khớp vòng đời job của backend và lưu đầy đủ các trường employer đang nhập, gồm cả quyền lợi."
        meta="Nhà tuyển dụng"
        title={mode === "edit" ? "Chỉnh sửa tin tuyển dụng" : "Đăng tin tuyển dụng mới"}
      />

      <form className="panel data-panel candidate-form-shell" onSubmit={handleSubmit}>
        {message ? <div className="message-banner">{message}</div> : null}
        {error ? <div className="message-banner message-banner--error">{error}</div> : null}
        <div className="grid-2">
          <div className="field">
            <label htmlFor="job-title">Tiêu đề</label>
            <input id="job-title" onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))} required value={form.title} />
          </div>
          <div className="field">
            <label htmlFor="job-location">Địa điểm</label>
            <input id="job-location" onChange={(event) => setForm((current) => ({ ...current, location: event.target.value }))} value={form.location} />
          </div>
        </div>
        <div className="grid-3">
          <div className="field">
            <label htmlFor="job-salary-min">Lương tối thiểu</label>
            <input id="job-salary-min" onChange={(event) => setForm((current) => ({ ...current, salaryMin: event.target.value }))} type="number" value={form.salaryMin} />
          </div>
          <div className="field">
            <label htmlFor="job-salary-max">Lương tối đa</label>
            <input id="job-salary-max" onChange={(event) => setForm((current) => ({ ...current, salaryMax: event.target.value }))} type="number" value={form.salaryMax} />
          </div>
          <div className="field">
            <label htmlFor="job-deadline">Hạn nộp</label>
            <input id="job-deadline" onChange={(event) => setForm((current) => ({ ...current, deadline: event.target.value }))} type="date" value={form.deadline} />
          </div>
        </div>
        <div className="grid-3">
          <div className="field">
            <label htmlFor="job-type">Loại công việc</label>
            <select id="job-type" onChange={(event) => setForm((current) => ({ ...current, jobType: event.target.value }))} value={form.jobType}>
              <option value="FULLTIME">Toàn thời gian</option>
              <option value="PARTTIME">Bán thời gian</option>
              <option value="REMOTE">Làm việc từ xa</option>
              <option value="CONTRACT">Hợp đồng</option>
            </select>
          </div>
          <div className="field">
            <label htmlFor="job-level">Cấp độ</label>
            <select id="job-level" onChange={(event) => setForm((current) => ({ ...current, level: event.target.value }))} value={form.level}>
              <option value="INTERN">Thực tập</option>
              <option value="JUNIOR">Junior</option>
              <option value="MIDDLE">Middle</option>
              <option value="SENIOR">Senior</option>
              <option value="MANAGER">Manager</option>
            </select>
          </div>
          <div className="field">
            <label htmlFor="job-category">Danh mục</label>
            <select id="job-category" onChange={(event) => setForm((current) => ({ ...current, categoryId: event.target.value }))} value={form.categoryId}>
              <option value="">Chọn danh mục</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="field">
          <label htmlFor="job-status">Trạng thái</label>
          <select id="job-status" onChange={(event) => setForm((current) => ({ ...current, status: event.target.value }))} value={form.status}>
            <option value="DRAFT">Bản nháp</option>
            <option value="PENDING">Gửi admin duyệt</option>
            <option value="HIDDEN">Ẩn tin</option>
          </select>
        </div>
        <div className="field">
          <label htmlFor="job-description">Mô tả công việc</label>
          <textarea id="job-description" onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))} value={form.description} />
        </div>
        <div className="field">
          <label htmlFor="job-requirements">Yêu cầu ứng viên</label>
          <textarea id="job-requirements" onChange={(event) => setForm((current) => ({ ...current, requirements: event.target.value }))} value={form.requirements} />
        </div>
        <div className="field">
          <label htmlFor="job-benefits">Quyền lợi</label>
          <textarea id="job-benefits" onChange={(event) => setForm((current) => ({ ...current, benefits: event.target.value }))} value={form.benefits} />
        </div>
        <div className="button-row">
          <button className="button button--primary" disabled={saving} type="submit">
            {saving ? "Đang lưu..." : mode === "edit" ? "Lưu cập nhật" : "Tạo tin tuyển dụng"}
          </button>
        </div>
      </form>
    </div>
  );
}
