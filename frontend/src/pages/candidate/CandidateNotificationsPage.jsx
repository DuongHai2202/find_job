import { useEffect, useState } from "react";

import { getNotifications, markNotificationRead } from "@/api/notificationApi";
import { EmptyState, ErrorState, PageIntro, SkeletonBlock, StatusBadge } from "@/components/ui";
import { formatDateTime } from "@/utils/format";

export function CandidateNotificationsPage() {
  const [state, setState] = useState({
    loading: true,
    error: "",
    data: null,
  });

  async function load() {
    const data = await getNotifications({ page: 0, size: 20 });
    setState({ loading: false, error: "", data });
  }

  useEffect(() => {
    load().catch((error) =>
      setState({
        loading: false,
        error: error.response?.data?.message || "Không thể tải thông báo.",
        data: null,
      })
    );
  }, []);

  async function handleRead(notificationId) {
    try {
      await markNotificationRead(notificationId);
      await load();
    } catch (error) {
      setState((current) => ({
        ...current,
        error: error.response?.data?.message || "Không thể đánh dấu đã đọc.",
      }));
    }
  }

  return (
    <div className="stack">
      <PageIntro description="Thông báo ưu tiên phân biệt rõ trạng thái chưa đọc và đã đọc để bạn không bỏ lỡ cập nhật quan trọng." meta="Ứng viên" title="Thông báo" />
      {state.loading ? <SkeletonBlock lines={6} /> : null}
      {state.error ? <ErrorState description={state.error} /> : null}
      {!state.loading && !state.error ? (
        state.data?.content?.length ? (
          <div className="list">
            {state.data.content.map((notification) => (
              <article className="notification-card" key={notification.id}>
                <div className="meta-row">
                  <StatusBadge value={notification.type} />
                  <span className="muted">{formatDateTime(notification.createdAt)}</span>
                </div>
                <strong>{notification.title}</strong>
                <p className="muted">{notification.content}</p>
                {!notification.read ? (
                  <button className="button button--secondary" onClick={() => handleRead(notification.id)} type="button">
                    Đánh dấu đã đọc
                  </button>
                ) : (
                  <span className="status-chip">Đã đọc</span>
                )}
              </article>
            ))}
          </div>
        ) : (
          <EmptyState description="Thông báo từ đơn ứng tuyển, việc làm mới và hệ thống sẽ xuất hiện tại đây." title="Chưa có thông báo" />
        )
      ) : null}
    </div>
  );
}
