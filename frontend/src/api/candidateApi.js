import { http } from "@/api/http";

export async function getMyCandidateProfile() {
  const { data } = await http.get("/candidates/me");
  return data;
}

export async function updateMyCandidateProfile(payload) {
  const { data } = await http.put("/candidates/me", payload);
  return data;
}

export async function getMyResumes() {
  const { data } = await http.get("/candidates/me/resumes");
  return data;
}

export async function createResume(payload) {
  const { data } = await http.post("/candidates/me/resumes", payload);
  return data;
}

export async function uploadResume(formData) {
  const { data } = await http.post("/candidates/me/resumes/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return data;
}

export async function updateResume(resumeId, payload) {
  const { data } = await http.put(`/candidates/me/resumes/${resumeId}`, payload);
  return data;
}

export async function deleteResume(resumeId) {
  await http.delete(`/candidates/me/resumes/${resumeId}`);
}

export async function getMyApplications(params = {}) {
  const { data } = await http.get("/applications/me", { params });
  return data;
}

export async function applyToJob(payload) {
  const { data } = await http.post("/applications", payload);
  return data;
}

export async function getSavedJobs(params = {}) {
  const { data } = await http.get("/saved-jobs", { params });
  return data;
}

export async function saveJob(jobId) {
  const { data } = await http.post("/saved-jobs", { jobId });
  return data;
}

export async function removeSavedJob(jobId) {
  await http.delete(`/saved-jobs/${jobId}`);
}

export async function getFollowingCompanies(params = {}) {
  const { data } = await http.get("/company-follows/me", { params });
  return data;
}

export async function followCompany(employerUserId) {
  const { data } = await http.post(`/company-follows/employers/${employerUserId}`);
  return data;
}

export async function unfollowCompany(employerUserId) {
  await http.delete(`/company-follows/employers/${employerUserId}`);
}
