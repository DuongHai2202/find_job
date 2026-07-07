import { http } from "@/api/http";

export async function getNotifications(params = {}) {
  const { data } = await http.get("/notifications", { params });
  return data;
}

export async function markNotificationRead(notificationId) {
  const { data } = await http.patch(`/notifications/${notificationId}/read`);
  return data;
}

export async function getUnreadNotificationCount() {
  const { data } = await http.get("/notifications/unread-count");
  return data;
}
