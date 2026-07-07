import { useEffect, useState } from "react";

import { getMyCandidateProfile, updateMyCandidateProfile } from "@/api/candidateApi";
import { ErrorState, PageIntro, SkeletonBlock } from "@/components/ui";

const initialForm = {
  fullName: "",
  phone: "",
  dateOfBirth: "",
  gender: "",
  address: "",
  headline: "",
  summary: "",
};

export function CandidateProfilePage() {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    getMyCandidateProfile()
      .then((profile) => {
        setForm({
          fullName: profile.fullName || "",
          phone: profile.phone || "",
          dateOfBirth: profile.dateOfBirth || "",
          gender: profile.gender || "",
          address: profile.address || "",
          headline: profile.headline || "",
          summary: profile.summary || "",
        });
      })
      .catch((requestError) => {
        setError(requestError.response?.data?.message || "Không thể tải hồ sơ.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");

    try {
      await updateMyCandidateProfile({
        ...form,
        dateOfBirth: form.dateOfBirth || null,
      });
      setMessage("Đã cập nhật hồ sơ ứng viên.");
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Cập nhật hồ sơ thất bại.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="stack">
      <PageIntro description="Hoàn thiện thông tin cá nhân, headline nghề nghiệp và phần tóm tắt để tăng chất lượng gợi ý việc làm." meta="Ứng viên" title="Hồ sơ ứng viên" />
      {loading ? (
        <SkeletonBlock lines={8} />
      ) : error && !message ? (
        <ErrorState description={error} />
      ) : (
        <form className="panel data-panel candidate-form-shell" onSubmit={handleSubmit}>
          <div className="candidate-form-shell__intro">
            <strong>Thông tin này được dùng để hiển thị trong hồ sơ và hỗ trợ hệ thống gợi ý việc làm phù hợp hơn.</strong>
          </div>
          {message ? <div className="message-banner">{message}</div> : null}
          {error ? <div className="message-banner message-banner--error">{error}</div> : null}
          <div className="grid-2">
            <div className="field">
              <label htmlFor="candidate-name">Họ và tên</label>
              <input id="candidate-name" onChange={(event) => setForm((current) => ({ ...current, fullName: event.target.value }))} value={form.fullName} />
            </div>
            <div className="field">
              <label htmlFor="candidate-phone">Số điện thoại</label>
              <input id="candidate-phone" onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))} value={form.phone} />
            </div>
          </div>
          <div className="grid-2">
            <div className="field">
              <label htmlFor="candidate-dob">Ngày sinh</label>
              <input id="candidate-dob" onChange={(event) => setForm((current) => ({ ...current, dateOfBirth: event.target.value }))} type="date" value={form.dateOfBirth} />
            </div>
            <div className="field">
              <label htmlFor="candidate-gender">Giới tính</label>
              <input id="candidate-gender" onChange={(event) => setForm((current) => ({ ...current, gender: event.target.value }))} value={form.gender} />
            </div>
          </div>
          <div className="field">
            <label htmlFor="candidate-address">Địa chỉ</label>
            <input id="candidate-address" onChange={(event) => setForm((current) => ({ ...current, address: event.target.value }))} value={form.address} />
          </div>
          <div className="field">
            <label htmlFor="candidate-headline">Headline nghề nghiệp</label>
            <input
              id="candidate-headline"
              onChange={(event) => setForm((current) => ({ ...current, headline: event.target.value }))}
              placeholder="Ví dụ: Frontend Developer tập trung vào React và TypeScript"
              value={form.headline}
            />
          </div>
          <div className="field">
            <label htmlFor="candidate-summary">Tóm tắt</label>
            <textarea
              id="candidate-summary"
              onChange={(event) => setForm((current) => ({ ...current, summary: event.target.value }))}
              placeholder="Giới thiệu ngắn gọn kinh nghiệm, thế mạnh và định hướng nghề nghiệp của bạn."
              value={form.summary}
            />
          </div>
          <div className="button-row">
            <button className="button button--primary" disabled={saving} type="submit">
              {saving ? "Đang lưu..." : "Lưu thay đổi"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
