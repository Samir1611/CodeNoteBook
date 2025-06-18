export const apiGet = async (url) => {
  try {
    const res = await fetch(`http://localhost:5000${url}`, {
      credentials: "include",
    });
    return res.ok ? await res.json() : { success: false };
  } catch {
    return { success: false };
  }
};

export const apiPost = async (url, data) => {
  try {
    const res = await fetch(`http://localhost:5000${url}`, {
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
