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
    <div style={styles.page}>
      <HeaderTabs />

      <div style={styles.headerSection}>
        <h1 style={styles.title}>Discover Your Next Meal</h1>
        <p style={styles.subtitle}>Explore thousands of chef-crafted recipes.</p>

        {/* Search Bar */}
        <div style={styles.searchRow}>
          <input
            type="text"
            placeholder="Search recipes..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={styles.searchInput}
          />
          <button onClick={onSearchClick} style={styles.searchBtn}>
            Search
          </button>
        </div>
      </div>

      {loading && <p style={styles.loading}>Loading recipes...</p>}
      {error && <p style={styles.error}>{error}</p>}

      {/* Recipe Grid */}
      <div style={styles.grid}>
        {recipes.map((recipe) => (
          <div
            key={recipe.id}
            onClick={() => navigate(`/recipe/${recipe.id}`)}
            style={styles.card}
          >
            {/* Favorite heart */}
            <div
              onClick={(e) => toggleFavorite(e, recipe.id)}
              style={styles.heart}
            >
              {recipe.is_favorite ? "❤️" : "🤍"}
            </div>

            <img
              src={`http://127.0.0.1:8008${recipe.image_url}`}
              alt={recipe.title}
              style={styles.cardImg}
            />

            <h3 style={styles.cardTitle}>{recipe.title}</h3>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div style={styles.pagination}>
        <button onClick={prevPage} disabled={page === 1} style={styles.pageBtn}>
          Prev
        </button>

        <span style={styles.pageInfo}>
          Page {page} of {totalPages}
        </span>

        <button
          onClick={nextPage}
          disabled={page === totalPages}
          style={styles.pageBtn}
        >
          Next
        </button>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
  padding: "20px 40px",
  paddingTop: "100px", // space for fixed header
  fontFamily: "Inter, sans-serif",
  minHeight: "100vh",
  backgroundColor: "#F7F9FC", // cleaner blue-ish background
},


  headerSection: {
    textAlign: "center",
    marginTop: 10,
    marginBottom: 30,
  },

  title: {
    fontSize: 34,
    fontWeight: 700,
    color: "#222",
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
  },

  searchRow: {
    display: "flex",
    justifyContent: "center",
    gap: 10,
    marginTop: 10,
  },

  searchInput: {
    width: "320px",
    padding: "10px 14px",
    borderRadius: 8,
    border: "1px solid #ccc",
    fontSize: 15,
  },

  searchBtn: {
    padding: "10px 18px",
    backgroundColor: "#007AFF",
    color: "white",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
    fontWeight: 600,
  },

  loading: {
    textAlign: "center",
    color: "#555",
  },

  error: {
    textAlign: "center",
    color: "red",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
    gap: 25,
    marginTop: 20,
  },

  card: {
    cursor: "pointer",
    backgroundColor: "white",
    borderRadius: 12,
    padding: 10,
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
    position: "relative",
    transition: "transform 0.15s ease, box-shadow 0.2s ease",
  },

  heart: {
    position: "absolute",
    top: 10,
    left: 10,
    fontSize: 22,
    cursor: "pointer",
    zIndex: 3,
  },

  cardImg: {
    width: "100%",
    borderRadius: 10,
    height: 180,
    objectFit: "cover",
  },

  cardTitle: {
    marginTop: 12,
    fontSize: 18,
    fontWeight: 600,
    color: "#333",
  },

  pagination: {
    marginTop: 30,
    display: "flex",
    justifyContent: "center",
    gap: 12,
    alignItems: "center",
  },

  pageBtn: {
    padding: "8px 14px",
    borderRadius: 8,
    border: "1px solid #ccc",
    backgroundColor: "white",
    cursor: "pointer",
  },

  pageInfo: {
    fontSize: 15,
    color: "#444",
  },
};
