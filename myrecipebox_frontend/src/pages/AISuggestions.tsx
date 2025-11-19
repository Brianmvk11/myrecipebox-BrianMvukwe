import { useState } from "react";
import { useNavigate } from "react-router-dom";
import HeaderTabs from "../components/HeaderTabs";
import { createRecipe, addFavorite } from "../api";

const API_URL = "http://127.0.0.1:8008";

export default function AISuggestions() {
  const [ingredients, setIngredients] = useState("");
  const [loading, setLoading] = useState(false);
  const [aiRecipe, setAiRecipe] = useState<any | null>(null);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  const navigate = useNavigate();

  const handleSuggest = async () => {
    if (!ingredients.trim()) return alert("Enter at least one ingredient");

    setLoading(true);
    setAiRecipe(null);

    try {
      const res = await fetch(`${API_URL}/recipes/suggest-recipes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ingredients: ingredients.split(",").map((i) => i.trim()),
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "AI failed");
      }

      const data = await res.json();
      setAiRecipe(data.recipes[0]);
    } catch (err: any) {
      alert(err.message);
    }

    setLoading(false);
  };

  const handleSaveRecipe = async () => {
    if (!aiRecipe) return;

    setSaving(true);

    try {
      const created = await createRecipe({
        title: aiRecipe.title,
        ingredients: aiRecipe.ingredients,
        steps: aiRecipe.steps,
        file: uploadFile || null,
      });

      await addFavorite(created.id);

      alert("Recipe saved & added to favorites!");
      navigate(`/recipe/${created.id}`);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={styles.page}>
      <HeaderTabs />

      <div style={styles.headerSection}>
        <h1 style={styles.title}>AI Recipe Suggestions</h1>
        <p style={styles.subtitle}>Let AI craft a meal idea based on your ingredients</p>
      </div>

      {/* Input Section */}
      <div style={styles.inputRow}>
        <input
          type="text"
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
          placeholder="e.g. chicken, rice, tomato"
          style={styles.textInput}
        />
        <button onClick={handleSuggest} style={styles.suggestBtn}>
          Suggest
        </button>
      </div>

      {loading && <p style={styles.loading}>Generating recipe...</p>}

      {/* AI Recipe Card */}
      {aiRecipe && (
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>{aiRecipe.title}</h3>

          <strong>Ingredients:</strong>
          <ul>
            {aiRecipe.ingredients.map((ing: string, i: number) => (
              <li key={i}>{ing}</li>
            ))}
          </ul>

          <strong>Steps:</strong>
          <p>{aiRecipe.steps}</p>

          <div style={{ marginTop: 10 }}>
            <p>Upload image (optional):</p>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
            />
          </div>

          <button
            onClick={handleSaveRecipe}
            disabled={saving}
            style={styles.saveBtn}
          >
            {saving ? "Saving..." : "Save Recipe & Add to Favorites"}
          </button>
        </div>
      )}
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
    marginBottom: 25,
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

  inputRow: {
    display: "flex",
    justifyContent: "center",
    gap: 10,
    marginTop: 20,
    marginBottom: 25,
  },

  textInput: {
    width: 350,
    padding: "10px 14px",
    borderRadius: 8,
    border: "1px solid #ccc",
    fontSize: 15,
  },

  suggestBtn: {
    padding: "10px 18px",
    backgroundColor: "#007AFF",
    color: "white",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
    fontWeight: 600,
  },

  loading: { textAlign: "center", color: "#555", marginTop: 10 },

  card: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    maxWidth: 600,
    margin: "0 auto",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
    marginTop: 20,
  },

  cardTitle: {
    fontSize: 22,
    fontWeight: 700,
    marginBottom: 12,
    color: "#333",
  },

  saveBtn: {
    marginTop: 15,
    padding: "10px 18px",
    backgroundColor: "#10B981",
    color: "white",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
    fontWeight: 600,
  },
};
