import { http } from "@/api/http";

export async function getPendingEmployers(params = {}) {
  const { data } = await http.get("/admin/employers/pending", { params });
  return data;
}

export async function reviewEmployer(employerUserId, approved) {
  const { data } = await http.patch(`/admin/employers/${employerUserId}/approval`, { approved });
  return data;
}

export async function getUsers(params = {}) {
  const { data } = await http.get("/admin/users", { params });
  return data;
}

export async function updateUserStatus(userId, status) {
  const { data } = await http.patch(`/admin/users/${userId}/status`, { status });
  return data;
}

export async function getJobsForReview(params = {}) {
  const { data } = await http.get("/jobs/admin/review", { params });
  return data;
}
