import { http } from "@/api/http";

function normalizeRegisterPayload(payload) {
  return {
    email: payload.email?.trim(),
    password: payload.password,
    fullName: payload.fullName?.trim(),
    phone: payload.phone?.trim() || null,
    role: payload.role,
    companyName: payload.role === "EMPLOYER" ? payload.companyName?.trim() || null : null,
  };
}

export async function login(payload) {
  const { data } = await http.post("/auth/login", payload);
  return data;
}

export async function register(payload) {
  const { data } = await http.post("/auth/register", normalizeRegisterPayload(payload));
  return data;
}

export async function getAuthProviders() {
  const { data } = await http.get("/auth/providers");
  return data;
}
