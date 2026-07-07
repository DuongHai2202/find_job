import { useEffect, useState } from "react";

import { getMyEmployerProfile, updateMyEmployerProfile } from "@/api/employerApi";
import { CompanyLogo } from "@/components/companyLogo";
import { ErrorState, PageIntro, SkeletonBlock } from "@/components/ui";

const initialForm = {
  companyName: "",
  companyDescription: "",
  taxCode: "",
  logoUrl: "",
  companySize: "",
  website: "",
  address: "",
  fullName: "",
  phone: "",
  email: "",
};

export function EmployerCompanyProfilePage() {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    getMyEmployerProfile()
      .then((profile) => {
        setForm({
          companyName: profile.companyName || "",
          companyDescription: profile.companyDescription || "",
          taxCode: profile.taxCode || "",
          logoUrl: profile.logoUrl || "",
          companySize: profile.companySize || "",
          website: profile.website || "",
          address: profile.address || "",
          fullName: profile.fullName || "",
          phone: profile.phone || "",
          email: profile.email || "",
        });
      })
      .catch((requestError) => {
        setError(requestError.response?.data?.message || "Không thể tải hồ sơ công ty.");
      })
      .finally(() => setLoading(false));
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");

    try {
      await updateMyEmployerProfile(form);
      setMessage("Đã cập nhật hồ sơ công ty.");
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Cập nhật hồ sơ công ty thất bại.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="stack">
      <PageIntro
        description="Hồ sơ này là phần xuất hiện trên trang công ty công khai, nên càng rõ ràng và chỉn chu thì ứng viên càng dễ tin tưởng hơn."
        meta="Nhà tuyển dụng"
        title="Hồ sơ công ty"
      />
      {loading ? (
        <SkeletonBlock lines={8} />
      ) : error && !message ? (
        <ErrorState description={error} />
      ) : (
        <form className="panel data-panel candidate-form-shell" onSubmit={handleSubmit}>
          {message ? <div className="message-banner">{message}</div> : null}
          {error ? <div className="message-banner message-banner--error">{error}</div> : null}

          <div className="grid-2">
            <div className="field">
              <label htmlFor="company-name">Tên công ty</label>
              <input id="company-name" onChange={(event) => setForm((current) => ({ ...current, companyName: event.target.value }))} value={form.companyName} />
            </div>
            <div className="field">
              <label htmlFor="company-size">Quy mô</label>
              <input id="company-size" onChange={(event) => setForm((current) => ({ ...current, companySize: event.target.value }))} value={form.companySize} />
            </div>
          </div>

          <div className="grid-2">
            <div className="field">
              <label htmlFor="company-website">Website</label>
              <input id="company-website" onChange={(event) => setForm((current) => ({ ...current, website: event.target.value }))} value={form.website} />
            </div>
            <div className="field">
              <label htmlFor="company-address">Địa chỉ</label>
              <input id="company-address" onChange={(event) => setForm((current) => ({ ...current, address: event.target.value }))} value={form.address} />
            </div>
          </div>

          <div className="grid-2">
            <div className="field">
              <label htmlFor="company-tax-code">Mã số thuế</label>
              <input id="company-tax-code" onChange={(event) => setForm((current) => ({ ...current, taxCode: event.target.value }))} value={form.taxCode} />
            </div>
            <div className="field">
              <label htmlFor="company-logo-url">Link logo</label>
              <input id="company-logo-url" onChange={(event) => setForm((current) => ({ ...current, logoUrl: event.target.value }))} value={form.logoUrl} />
            </div>
          </div>

          <div className="field">
            <label>Xem trước logo</label>
            <div className="candidate-form-shell__logo-preview">
              <CompanyLogo className="candidate-form-shell__logo-mark" companyName={form.companyName} logoUrl={form.logoUrl} />
              <span>Logo hợp lệ sẽ hiển thị ngay ở trang công ty công khai và các khu vực nổi bật dành cho doanh nghiệp.</span>
            </div>
          </div>

          <div className="field">
            <label htmlFor="company-description">Mô tả công ty</label>
            <textarea id="company-description" onChange={(event) => setForm((current) => ({ ...current, companyDescription: event.target.value }))} value={form.companyDescription} />
          </div>

          <div className="grid-2">
            <div className="field">
              <label htmlFor="company-contact-name">Người đại diện</label>
              <input id="company-contact-name" onChange={(event) => setForm((current) => ({ ...current, fullName: event.target.value }))} value={form.fullName} />
            </div>
            <div className="field">
              <label htmlFor="company-contact-phone">Số điện thoại</label>
              <input id="company-contact-phone" onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))} value={form.phone} />
            </div>
          </div>

          <div className="field">
            <label htmlFor="company-contact-email">Email</label>
            <input disabled id="company-contact-email" type="email" value={form.email} />
          </div>

          <div className="button-row">
            <button className="button button--primary" disabled={saving} type="submit">
              {saving ? "Đang lưu..." : "Lưu hồ sơ công ty"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
