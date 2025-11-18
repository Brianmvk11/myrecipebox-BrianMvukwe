import { useEffect, useState } from "react";
import { listRecipes, searchRecipes, addFavorite, removeFavorite } from "../api";
import { useNavigate } from "react-router-dom";
import HeaderTabs from "../components/HeaderTabs";


export default function Home() {
  const [recipes, setRecipes] = useState<any[]>([]);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const [query, setQuery] = useState<string>("");
  const [isSearching, setIsSearching] = useState<boolean>(false);

  const PAGE_SIZE = 6;
  const navigate = useNavigate();

  async function fetchList(pageNumber: number) {
    setLoading(true);
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
    try {
      const data = await searchRecipes(q, pageNumber, PAGE_SIZE);
      setRecipes(data.recipes ?? []);
      setTotalPages(Math.ceil((data.total ?? 0) / PAGE_SIZE));
      setPage(data.page);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchList(1);
  }, []);

  function onSearchClick() {
    if (!query.trim()) {
      setIsSearching(false);
      fetchList(1);
      return;
    }
    setIsSearching(true);
    fetchSearch(query.trim(), 1);
  }

  function nextPage() {
    if (page < totalPages) {
      isSearching ? fetchSearch(query, page + 1) : fetchList(page + 1);
    }
  }

  function prevPage() {
    if (page > 1) {
      isSearching ? fetchSearch(query, page - 1) : fetchList(page - 1);
    }
  }

  async function toggleFavorite(e: React.MouseEvent, recipeId: number) {
    e.stopPropagation();

    setRecipes((prev) =>
      prev.map((r) =>
        r.id === recipeId ? { ...r, is_favorite: !r.is_favorite } : r
      )
    );

    try {
      const recipe = recipes.find((r) => r.id === recipeId);
      if (recipe.is_favorite) {
        await removeFavorite(recipeId);
      } else {
        await addFavorite(recipeId);
      }
    } catch (err: any) {
      alert(err?.message || "Failed to update favorite");
    }
  }

  return (
    <div>
      <HeaderTabs />
      <h1>Discover your next meal</h1>
      <p>Explore thousands of recipes from around the world.</p>

      {/* Search */}
      <div style={{ marginTop: 12, marginBottom: 12, display: "flex", gap: 8 }}>
        <input
          type="text"
          placeholder="Search by title..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button onClick={onSearchClick}>Search</button>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Card Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
          gap: 20,
          marginTop: 20,
        }}
      >
        {recipes.map((recipe) => (
          <div
            key={recipe.id}
            onClick={() => navigate(`/recipe/${recipe.id}`)}
            style={{
              cursor: "pointer",
              border: "1px solid #ddd",
              padding: 10,
              borderRadius: 10,
              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
              position: "relative",
            }}
          >
            {/* Heart icon */}
            <div
              onClick={(e) => toggleFavorite(e, recipe.id)}
              style={{
                position: "absolute",
                top: 10,
                left: 10,
                fontSize: 22,
                cursor: "pointer",
                userSelect: "none",
              }}
            >
              {recipe.is_favorite ? "❤️" : "🤍"}
            </div>

            <img
              src={`http://127.0.0.1:8008${recipe.image_url}`}
              alt={recipe.title}
              style={{ width: "100%", borderRadius: 10 }}
            />

            <h3 style={{ marginTop: 10 }}>{recipe.title}</h3>
            {/* <p>{recipe.is_favorite ? "true":"false"}</p> */}
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div style={{ marginTop: 20, display: "flex", gap: 10 }}>
        <button onClick={prevPage} disabled={page === 1}>
          Prev
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button onClick={nextPage} disabled={page === totalPages}>
          Next
        </button>
      </div>
    </div>
  );
}
