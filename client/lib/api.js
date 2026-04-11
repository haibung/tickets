const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

async function request(path, options = {}) {
  const url = `${BASE_URL}${path}`;
  const headers = { "Content-Type": "application/json", ...options.headers };

  const res = await fetch(url, { ...options, headers });
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const error = new Error(data.message || "Request failed");
    error.status = res.status;
    error.data = data;
    throw error;
  }

  return data;
}

export const api = {
  get: (path, options) => request(path, { method: "GET", ...options }),
  post: (path, body, options) =>
    request(path, { method: "POST", body: JSON.stringify(body), ...options }),
  put: (path, body, options) =>
    request(path, { method: "PUT", body: JSON.stringify(body), ...options }),
  delete: (path, options) => request(path, { method: "DELETE", ...options }),
};
