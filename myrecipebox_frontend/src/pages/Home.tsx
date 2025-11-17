import { useEffect, useState } from "react";
import { listRecipes, searchRecipes } from "../api";

export default function Home() {
  const [recipes, setRecipes] = useState<any[]>([]);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  // search state
  const [query, setQuery] = useState<string>("");
  const [isSearching, setIsSearching] = useState<boolean>(false);

  const PAGE_SIZE = 6;

  async function fetchList(pageNumber: number) {
    setLoading(true);
    setError("");
    try {
      const data = await listRecipes(pageNumber, PAGE_SIZE);
      setRecipes(data.recipes ?? []);
      setTotalPages(data.total_pages ?? 1);
      setPage(data.page ?? pageNumber);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function fetchSearch(q: string, pageNumber: number) {
    setLoading(true);
    setError("");
    try {
      const data = await searchRecipes(q, pageNumber, PAGE_SIZE);
      setRecipes(data.recipes ?? []);
      const total = data.total ?? 0;
      setTotalPages(Math.max(1, Math.ceil(total / PAGE_SIZE)));
      setPage(data.page ?? pageNumber);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchList(1);
  }, []);

  // pagination
  function nextPage() {
    if (page >= totalPages) return;
    const next = page + 1;
    isSearching ? fetchSearch(query, next) : fetchList(next);
  }

  function prevPage() {
    if (page <= 1) return;
    const prev = page - 1;
    isSearching ? fetchSearch(query, prev) : fetchList(prev);
  }

  // triggered ONLY on button press
  function onSearchClick() {
    if (!query.trim()) {
      setIsSearching(false);
      fetchList(1);
      return;
    }
    setIsSearching(true);
    fetchSearch(query.trim(), 1);
  }

  function onClearSearch() {
    setQuery("");
    setIsSearching(false);
    fetchList(1);
  }

  return (
    <div>
      <h1>Discover your next meal</h1>
      <p>Explore thousands of recipes from around the world.</p>

      {/* Search Bar */}
      <div style={{ marginTop: 12, marginBottom: 12, display: "flex", gap: 8 }}>
        <input
          type="text"
          placeholder="Search by title..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button onClick={onSearchClick}>Search</button>
        <button onClick={onClearSearch} disabled={!isSearching && !query}>Clear</button>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Recipes */}
      <div>
        {recipes.length === 0 && !loading ? (
          <p>No recipes found.</p>
        ) : (
          recipes.map((recipe: any) => (
            <div key={recipe.id} style={{ padding: 12, marginBottom: 20, borderBottom: "1px solid #ccc" }}>
              <h2>{recipe.title}</h2>

              {recipe.image_url && (
                <img
                  src={recipe.image_url}
                  alt={recipe.title}
                  style={{ width: 200, borderRadius: 10 }}
                />
              )}

              <p><b>Ingredients:</b> {recipe.ingredients.join(", ")}</p>

              {/* Steps */}
              <div style={{ marginTop: 10 }}>
                <b>Steps:</b>
                <pre style={{ whiteSpace: "pre-wrap" }}>{recipe.steps}</pre>
              </div>

              <p><b>Created by:</b> {recipe.created_by ?? "System"}</p>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      <div style={{ marginTop: 20, display: "flex", gap: 10, alignItems: "center" }}>
        <button onClick={prevPage} disabled={page === 1 || loading}>◀ Prev</button>
        <span>Page {page} of {totalPages}</span>
        <button onClick={nextPage} disabled={page === totalPages || loading}>Next ▶</button>
      </div>
    </div>
  );
}
