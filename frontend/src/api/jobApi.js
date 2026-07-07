import { http } from "@/api/http";

export async function getPublicJobs(params = {}) {
  const { data } = await http.get("/jobs", { params });
  return data;
}

export async function getMyRecommendations(params = {}) {
  const { data } = await http.get("/jobs/recommendations/me", { params });
  return data;
}

export async function getJobById(jobId) {
  const { data } = await http.get(`/jobs/${jobId}`);
  return data;
}
