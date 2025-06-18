const BASE_URL = "https://codenotebook-backend.onrender.com";

export const apiGet = async (url) => {
  try {
    const res = await fetch(`${BASE_URL}${url}`, {
      credentials: "include",
    });
    return res.ok ? await res.json() : { success: false };
  } catch {
    return { success: false };
  }
};

export const apiPost = async (url, data) => {
  try {
    const res = await fetch(`${BASE_URL}${url}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      credentials: "include",
    });
    return res.ok ? await res.json() : { success: false };
  } catch {
    return { success: false };
  }
};
