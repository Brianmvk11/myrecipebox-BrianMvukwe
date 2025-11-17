const API_URL = "http://127.0.0.1:8008";

// Register... JSON
export async function registerUser(data: {
  name: string;
  email: string;
  password: string;
}) {
  const res = await fetch(`${API_URL}/users/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || "Registration failed");
  }

  return res.json();
}

// Login... OAuth2 form
export async function loginUser(email: string, password: string) {
  const form = new URLSearchParams();
  form.append("username", email);
  form.append("password", password);

  const res = await fetch(`${API_URL}/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: form.toString(),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || "Login failed");
  }

  return res.json();
}

// Get current user (requires token)
export async function fetchMe(token: string) {
  const res = await fetch(`${API_URL}/users/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    throw new Error("Invalid token");
  }

  return res.json();
}

// List recipes
export async function listRecipes(page_number: number, page_size: number) {
  const res = await fetch(`${API_URL}/recipes/?page=${page_number}&page_size=${page_size}`);

  if (!res.ok) {
    let err;
    try { err = await res.json(); } catch { err = null; }
    throw new Error(err?.detail || "Unable to get list of recipes");
  }

  return res.json();
}

// Search recipes by title
export async function searchRecipes(q: string, page_number: number, page_size: number) {
  const url = `${API_URL}/recipes/search?q=${encodeURIComponent(q)}&page=${page_number}&page_size=${page_size}`;
  const res = await fetch(url);

  if (!res.ok) {
    let err;
    try { err = await res.json(); } catch { err = null; }
    throw new Error(err?.detail || "Search failed");
  }

  return res.json();
}