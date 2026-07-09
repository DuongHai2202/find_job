const isLocalHost = typeof window !== "undefined"
  && ["localhost", "127.0.0.1"].includes(window.location.hostname);

export const env = {
  apiUrl: import.meta.env.VITE_API_URL
    ?? (isLocalHost
      ? "http://localhost:8080/api/v1"
      : "https://find-job-llrq.onrender.com/api/v1"),
};
