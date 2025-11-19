import { useEffect, useState } from "react";
import { listFavorites, addFavorite, removeFavorite } from "../api";
import { useNavigate } from "react-router-dom";
import HeaderTabs from "../components/HeaderTabs";

export default function Favorites() {
  const [recipes, setRecipes] = useState<any[]>([]);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const PAGE_SIZE = 6;
  const navigate = useNavigate();

  async function fetchFavorites(pageNumber: number) {
    setLoading(true);
    try {
      const data = await listFavorites(pageNumber, PAGE_SIZE);
      setRecipes(data.recipes ?? []);
      setTotalPages(data.total_pages ?? 1);
      setPage(data.page ?? pageNumber);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchFavorites(1);
  }, []);

  function nextPage() {
    if (page < totalPages) fetchFavorites(page + 1);
  }

  function prevPage() {
    if (page > 1) fetchFavorites(page - 1);
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
      recipe?.is_favorite
        ? await removeFavorite(recipeId)
        : await addFavorite(recipeId);
    } catch (err: any) {
      alert(err?.message || "Failed to update favorite");
    }

    fetchFavorites(page);
  }

  return (
    <div style={styles.page}>
      <HeaderTabs />

      <div style={styles.headerSection}>
        <h1 style={styles.title}>Your Favorite Recipes</h1>
        <p style={styles.subtitle}>All the meals you love in one place ❤️</p>
      </div>

      {loading && <p style={styles.loading}>Loading favorites...</p>}
      {error && <p style={styles.error}>{error}</p>}

      <div style={styles.grid}>
        {recipes.map((recipe) => (
          <div
            key={recipe.id}
            onClick={() => navigate(`/recipe/${recipe.id}`)}
            style={styles.card}
          >
            <div onClick={(e) => toggleFavorite(e, recipe.id)} style={styles.heart}>
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

      <div style={styles.pagination}>
        <button onClick={prevPage} disabled={page === 1} style={styles.pageBtn}>
          Prev
        </button>

        <span style={styles.pageInfo}>
          Page {page} of {totalPages}
        </span>

        <button onClick={nextPage} disabled={page === totalPages} style={styles.pageBtn}>
          Next
        </button>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    padding: "20px 40px",
    paddingTop: "100px",
    fontFamily: "Inter, sans-serif",
    minHeight: "100vh",
    backgroundColor: "#F7F9FC",
  },

  headerSection: {
    textAlign: "center",
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
  },

  loading: { textAlign: "center", color: "#555" },
  error: { textAlign: "center", color: "red" },

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

  cardImg: {
    width: "100%",
    height: 180,
    objectFit: "cover",
    borderRadius: 10,
  },

  cardTitle: {
    marginTop: 12,
    fontSize: 18,
    fontWeight: 600,
    color: "#333",
  },

  heart: {
    position: "absolute",
    top: 10,
    left: 10,
    fontSize: 22,
    cursor: "pointer",
    zIndex: 3,
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
    fontWeight: 600,
  },

  pageInfo: {
    fontSize: 15,
    color: "#444",
  },
};
