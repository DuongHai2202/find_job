import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { getEmployerApplications, updateApplicationStatus } from "@/api/employerApi";
import { DataPanel, EmptyState, ErrorState, PageIntro, SkeletonBlock, StatusBadge } from "@/components/ui";
import { formatDateTime } from "@/utils/format";

const statusOptions = ["PENDING", "VIEWED", "INTERVIEW", "ACCEPTED", "REJECTED"];

export function EmployerApplicationDetailPage() {
  const { applicationId } = useParams();
  const [state, setState] = useState({
    loading: true,
    error: "",
    application: null,
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    let ignore = false;

    async function load() {
      try {
        const data = await getEmployerApplications({ page: 0, size: 100 });
        const application = data.content.find((item) => String(item.id) === String(applicationId));

        if (!ignore) {
          setState({
            loading: false,
            error: application ? "" : "Không tìm thấy hồ sơ ứng tuyển này.",
            application: application || null,
          });
        }
      } catch (error) {
        if (!ignore) {
          setState({
            loading: false,
            error: error.response?.data?.message || "Không thể tải hồ sơ ứng tuyển.",
            application: null,
          });
        }
      }
    }

    load();
    return () => {
      ignore = true;
    };
  }, [applicationId]);

  async function handleStatus(status) {
    try {
      setSaving(true);
      setMessage("");
      await updateApplicationStatus(applicationId, { status });
      setState((current) => ({
        ...current,
        application: current.application ? { ...current.application, status } : current.application,
      }));
      setMessage("Đã cập nhật trạng thái ứng viên.");
    } catch (error) {
      setState((current) => ({
        ...current,
        error: error.response?.data?.message || "Không thể cập nhật trạng thái ứng viên.",
      }));
    } finally {
      setSaving(false);
    }
  }

  if (state.loading) {
    return <SkeletonBlock lines={8} />;
  }

  if (state.error || !state.application) {
    return <ErrorState description={state.error || "Không tìm thấy hồ sơ ứng tuyển này."} />;
  }

  const { application } = state;

  return (
    <div className="stack">
      <PageIntro
        description="Màn này giữ logic detail hai cột giống public detail, nhưng tập trung vào hồ sơ ứng viên và hành động xử lý."
        meta="Nhà tuyển dụng"
        title={application.candidate?.fullName || application.candidateName || "Chi tiết hồ sơ ứng tuyển"}
      />
      {message ? <div className="message-banner">{message}</div> : null}
      <div className="employer-detail-grid">
        <DataPanel title="Thông tin ứng viên">
          <div className="stack stack--sm">
            <div className="meta-row">
              <StatusBadge value={application.status} />
              <span className="muted">Cập nhật {formatDateTime(application.updatedAt)}</span>
            </div>
            <div className="portal-auth__mini-list">
              <div>
                <strong>Vị trí ứng tuyển</strong>
                <span>{application.job?.title || "Đang cập nhật"}</span>
              </div>
              <div>
                <strong>Email</strong>
                <span>{application.candidate?.email || application.email || "Chưa có email"}</span>
              </div>
              <div>
                <strong>Số điện thoại</strong>
                <span>{application.candidate?.phone || application.phone || "Chưa có số điện thoại"}</span>
              </div>
            </div>
            {application.coverLetter ? (
              <div className="candidate-form-shell__intro">
                <strong>Thư giới thiệu</strong>
                <span>{application.coverLetter}</span>
              </div>
            ) : (
              <EmptyState description="Ứng viên chưa gửi thư giới thiệu cho hồ sơ này." title="Chưa có thư giới thiệu" />
            )}
          </div>
        </DataPanel>

        <div className="stack">
          <DataPanel title="Hành động xử lý">
            <div className="employer-status-grid">
              {statusOptions.map((status) => (
                <button
                  className={`portal-role-switch__item${application.status === status ? " portal-role-switch__item--active" : ""}`}
                  disabled={saving}
                  key={status}
                  onClick={() => handleStatus(status)}
                  type="button"
                >
                  <strong>{status}</strong>
                  <span>Cập nhật hồ sơ về trạng thái {status.toLowerCase()}.</span>
                </button>
              ))}
            </div>
          </DataPanel>

          <DataPanel title="Điều hướng nhanh">
            <div className="button-row">
              <Link className="button button--secondary" to="/employer/applicants">
                Quay lại danh sách
              </Link>
              {application.job?.id ? (
                <Link className="button button--ghost" to={`/employer/jobs/${application.job.id}/edit`}>
                  Xem tin tuyển dụng
                </Link>
              ) : null}
            </div>
          </DataPanel>
        </div>
      </div>
    </div>
  );
}
