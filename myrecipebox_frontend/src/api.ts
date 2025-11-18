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
  const token = localStorage.getItem("access_token");
  const res = await fetch(`${API_URL}/recipes/?page=${page_number}&page_size=${page_size}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (!res.ok) {
    let err;
    try { err = await res.json(); } catch { err = null; }
    throw new Error(err?.detail || "Unable to get list of recipes");
  }

  return res.json();
}

// Get favorite recipes
export async function listFavorites(page_number: number, page_size: number) {
  const token = localStorage.getItem("access_token");
  const res = await fetch(`${API_URL}/favorites/?page=${page_number}&page_size=${page_size}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (!res.ok) {
    let err;
    try { err = await res.json(); } catch { err = null; }
    throw new Error(err?.detail || "Unable to get list of favorites");
  }

  return res.json();
}

// Get recipe by id
export async function getRecipeById(id: number | string) {
  const token = localStorage.getItem("access_token");
  const res = await fetch(`${API_URL}/recipes/id/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  if (!res.ok) throw new Error("Failed to load recipe");
  return res.json();
}


// Search recipes by title
export async function searchRecipes(q: string, page_number: number, page_size: number) {
  const token = localStorage.getItem("access_token");

  const url = `${API_URL}/recipes/search?q=${encodeURIComponent(q)}&page=${page_number}&page_size=${page_size}`;
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (!res.ok) {
    let err;
    try { err = await res.json(); } catch { err = null; }
    throw new Error(err?.detail || "Search failed");
  }

  return res.json();
}

//Get the user favourites
export async function getFavorites() {
  const token = localStorage.getItem("access_token");

  const res = await fetch(`${API_URL}/favorites`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.detail || "Failed to load favorites");
  }

  return res.json();
}


// Adding or removing a recipe as a favourite
export async function addFavorite(recipeId: number) {
  const token = localStorage.getItem("access_token");

  const res = await fetch(`${API_URL}/favorites/${recipeId}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.detail || "Failed to add favorite");
  }
}

export async function removeFavorite(recipeId: number) {
  const token = localStorage.getItem("access_token");

  const res = await fetch(`${API_URL}/favorites/${recipeId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.detail || "Failed to remove favorite");
  }
}

// Creating a Recipe
export async function createRecipe(data: {
  title: string;
  ingredients: string[];
  steps: string;
  file?: File | null;
}) {
  const token = localStorage.getItem("access_token");

  const form = new FormData();
  form.append("title", data.title);
  data.ingredients.forEach((ing) => form.append("ingredients", ing));
  form.append("steps", data.steps);

  if (data.file) {
    form.append("file", data.file);
  }

  const res = await fetch(`${API_URL}/recipes/`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`
    },
    body: form,
  });

  if (!res.ok) {
    let err;
    try { err = await res.json(); } catch { err = null; }
    throw new Error(err?.detail || "Failed to create recipe");
  }

  return res.json();
}