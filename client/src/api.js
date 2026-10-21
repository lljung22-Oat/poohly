export async function api(path, options = {}) {
  const headers = { ...(options.headers || {}) };
  const token = sessionStorage.getItem("token");
  if (token) headers.Authorization = `Bearer ${token}`;
  const year = sessionStorage.getItem("year") || "2570";
  const joiner = path.includes("?") ? "&" : "?";
  let body = options.body;
  if (body instanceof FormData) {
    /* browser sets the multipart boundary */
  } else if (body !== undefined) {
    headers["Content-Type"] = "application/json";
    body = JSON.stringify(body);
  }
  const response = await fetch(`${path}${joiner}year=${year}`, { ...options, headers, body });
  const data = await response.json().catch(() => ({}));
  if (response.status === 401) {
    sessionStorage.clear();
    if (!path.startsWith("/api/auth")) window.location.assign("/");
  }
  if (!response.ok) throw new Error(data.error || "ผิดพลาด");
  return data;
}
