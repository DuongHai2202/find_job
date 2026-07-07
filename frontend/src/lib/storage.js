const ACCESS_TOKEN_KEY = "findjob.accessToken";
const USER_KEY = "findjob.user";

export function getStoredAccessToken() {
  return window.localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function setStoredSession(accessToken, user) {
  window.localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  window.localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearStoredSession() {
  window.localStorage.removeItem(ACCESS_TOKEN_KEY);
  window.localStorage.removeItem(USER_KEY);
}

export function getStoredUser() {
  const raw = window.localStorage.getItem(USER_KEY);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw);
  } catch {
    clearStoredSession();
    return null;
  }
}
