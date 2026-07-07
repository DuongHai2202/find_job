import { http } from "@/api/http";

function normalizeEmployerProfilePayload(payload) {
  return {
    fullName: payload.fullName?.trim() || null,
    phone: payload.phone?.trim() || null,
    companyName: payload.companyName?.trim() || "",
    companyDescription: payload.companyDescription?.trim() || null,
    taxCode: payload.taxCode?.trim() || null,
    logoUrl: payload.logoUrl?.trim() || null,
    website: payload.website?.trim() || null,
    companySize: payload.companySize?.trim() || null,
    address: payload.address?.trim() || null,
  };
}

function normalizeJobPayload(payload) {
  return {
    title: payload.title?.trim() || "",
    description: payload.description?.trim() || null,
    requirements: payload.requirements?.trim() || null,
    benefits: payload.benefits?.trim() || null,
    salaryMin: payload.salaryMin ?? null,
    salaryMax: payload.salaryMax ?? null,
    location: payload.location?.trim() || null,
    jobType: payload.jobType,
    level: payload.level,
    categoryId: payload.categoryId ?? null,
    deadline: payload.deadline || null,
  };
}

function normalizeApplicationStatusPayload(payload) {
  return {
    status: payload.status,
    note: payload.note?.trim() || null,
  };
}

export async function getMyEmployerProfile() {
  const { data } = await http.get("/employers/me");
  return data;
}

export async function updateMyEmployerProfile(payload) {
  const { data } = await http.put("/employers/me", normalizeEmployerProfilePayload(payload));
  return data;
}

export async function getCompanyProfile(employerId) {
  const { data } = await http.get(`/employers/${employerId}`);
  return data;
}

export async function getEmployerJobs(params = {}) {
  const { data } = await http.get("/jobs/employer", { params });
  return data;
}

export async function createJob(payload) {
  const { data } = await http.post("/jobs", normalizeJobPayload(payload));
  return data;
}

export async function updateJob(jobId, payload) {
  const { data } = await http.put(`/jobs/${jobId}`, normalizeJobPayload(payload));
  return data;
}

export async function updateJobStatus(jobId, status) {
  const { data } = await http.patch(`/jobs/${jobId}/status`, { status });
  return data;
}

export async function getEmployerApplications(params = {}) {
  const { data } = await http.get("/applications/employer", { params });
  return data;
}

export async function updateApplicationStatus(applicationId, payload) {
  const { data } = await http.patch(`/applications/${applicationId}/status`, normalizeApplicationStatusPayload(payload));
  return data;
}
