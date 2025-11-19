import { useState } from "react";
import { useNavigate } from "react-router-dom";
import HeaderTabs from "../components/HeaderTabs";
import { createRecipe } from "../api";

export default function AddRecipe() {
  const [title, setTitle] = useState("");
  const [ingredients, setIngredients] = useState<string[]>([""]);
  const [steps, setSteps] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  function updateIngredient(value: string, index: number) {
    const updated = [...ingredients];
    updated[index] = value;
    setIngredients(updated);
  }

  function addIngredient() {
    setIngredients([...ingredients, ""]);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const newRecipe = await createRecipe({
        title,
        ingredients,
        steps,
        file,
      });

      navigate(`/recipe/${newRecipe.id}`);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.page}>
      <HeaderTabs />

      <div style={styles.headerSection}>
        <h1 style={styles.title}>Add New Recipe</h1>
        <p style={styles.subtitle}>Create and save your favorite meals 🍽️</p>
      </div>

      <div style={styles.card}>
        {error && <p style={styles.error}>{error}</p>}

        <form onSubmit={handleSubmit} style={styles.form}>
          {/* Title */}
          <div style={styles.field}>
            <label style={styles.label}>Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              style={styles.input}
            />
          </div>

          {/* Ingredients */}
          <div style={styles.field}>
            <label style={styles.label}>Ingredients</label>

            {ingredients.map((ing, i) => (
              <input
                key={i}
                type="text"
                value={ing}
                placeholder={`Ingredient ${i + 1}`}
                onChange={(e) => updateIngredient(e.target.value, i)}
                required
                style={styles.input}
              />
            ))}

            <button
              type="button"
              onClick={addIngredient}
              style={styles.addBtn}
            >
              + Add Ingredient
            </button>
          </div>

          {/* Steps */}
          <div style={styles.field}>
            <label style={styles.label}>Steps</label>
            <textarea
              rows={5}
              value={steps}
              onChange={(e) => setSteps(e.target.value)}
              required
              style={styles.textarea}
            />
          </div>

          {/* Image */}
          <div style={styles.field}>
            <label style={styles.label}>Image (optional)</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
          </div>

          <button type="submit" disabled={loading} style={styles.submitBtn}>
            {loading ? "Creating..." : "Create Recipe"}
          </button>
        </form>
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

  card: {
    backgroundColor: "white",
    maxWidth: 600,
    margin: "0 auto",
    padding: 30,
    borderRadius: 12,
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
  },

  error: {
    color: "red",
    textAlign: "center",
    marginBottom: 15,
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: 20,
  },

  field: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },

  label: {
    fontWeight: 600,
    fontSize: 15,
    color: "#333",
  },

  input: {
    padding: "10px 12px",
    borderRadius: 8,
    border: "1px solid #ccc",
    fontSize: 15,
  },

  textarea: {
    padding: "10px 12px",
    borderRadius: 8,
    border: "1px solid #ccc",
    fontSize: 15,
    resize: "vertical",
  },

  addBtn: {
    padding: "8px 10px",
    marginTop: 5,
    backgroundColor: "#F0F2F5",
    border: "1px solid #ddd",
    borderRadius: 8,
    cursor: "pointer",
    width: "fit-content",
    fontWeight: 600,
  },

  submitBtn: {
    padding: "12px 0",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: 8,
    fontSize: 17,
    cursor: "pointer",
    fontWeight: 600,
    marginTop: 10,
  },
};
