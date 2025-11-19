import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getRecipeById, addFavorite, removeFavorite } from "../api";

export default function RecipeDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [recipe, setRecipe] = useState<any>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState<boolean>(false);

  useEffect(() => {
    async function fetchRecipe() {
      try {
        const data = await getRecipeById(id!);
        setRecipe(data);
        setIsFavorite(data.is_favorite ?? false);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchRecipe();
  }, [id]);

  async function toggleFavorite() {
    try {
      if (isFavorite) {
        await removeFavorite(recipe.id);
        setIsFavorite(false);
      } else {
        await addFavorite(recipe.id);
        setIsFavorite(true);
      }
    } catch (err: any) {
      alert(err.message || "Failed to update favorite");
    }
  }

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div
      style={{
        maxWidth: 700,
        margin: "0 auto",
        padding: 20,
        display: "flex",
        flexDirection: "column",
        gap: 20,
      }}
    >
      {/* Title + Favorite */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1 style={{ margin: 0 }}>{recipe.title}</h1>

        <button
          onClick={toggleFavorite}
          style={{
            fontSize: 28,
            cursor: "pointer",
            background: "none",
            border: "none",
            padding: 0,
          }}
        >
          {isFavorite ? "❤️" : "🤍"}
        </button>
      </div>

      {/* Image */}
      <img
        src={`http://127.0.0.1:8008${recipe.image_url}`}
        alt={recipe.title}
        style={{
          width: "100%",
          maxHeight: 350,
          objectFit: "cover",
          borderRadius: 12,
        }}
      />

      {/* Created By */}
      <p style={{ fontStyle: "italic", color: "#555" }}>
        <b>Created by:</b> {recipe.created_by_name ?? "System"}
      </p>

      {/* Ingredients */}
      <div>
        <h2>Ingredients</h2>
        <ul>
          {recipe.ingredients.map((item: string, i: number) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      </div>

      {/* Steps */}
      <div>
        <h2>Steps</h2>
        <p style={{ whiteSpace: "pre-wrap", lineHeight: 1.6 }}>{recipe.steps}</p>
      </div>

      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        style={{
          padding: "8px 16px",
          width: "fit-content",
          borderRadius: 6,
          cursor: "pointer",
          background: "#eee",
          border: "1px solid #ccc",
        }}
      >
        ← Back
      </button>
    </div>
  );
}
