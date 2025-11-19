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
    <div>
      <HeaderTabs />

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: 40,
          width: "100%",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: 500,
            background: "#fff",
            padding: 24,
            borderRadius: 12,
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          }}
        >
          <h1
            style={{
              fontSize: 32,
              fontWeight: 600,
              marginBottom: 20,
              textAlign: "center",
            }}
          >
            Add New Recipe
          </h1>

          {error && (
            <p style={{ color: "red", textAlign: "center", marginBottom: 12 }}>
              {error}
            </p>
          )}

          <form
            onSubmit={handleSubmit}
            style={{ display: "flex", flexDirection: "column", gap: 16 }}
          >
            {/* Title */}
            <div style={{ display: "flex", flexDirection: "column" }}>
              <label style={{ marginBottom: 4, fontWeight: 500 }}>Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                style={{
                  padding: 10,
                  border: "1px solid #ccc",
                  borderRadius: 6,
                  fontSize: 16,
                }}
              />
            </div>

            {/* Ingredients */}
            <div style={{ display: "flex", flexDirection: "column" }}>
              <label style={{ marginBottom: 4, fontWeight: 500 }}>
                Ingredients
              </label>

              {ingredients.map((ing, i) => (
                <input
                  key={i}
                  type="text"
                  value={ing}
                  placeholder={`Ingredient ${i + 1}`}
                  onChange={(e) => updateIngredient(e.target.value, i)}
                  required
                  style={{
                    padding: 10,
                    border: "1px solid #ccc",
                    borderRadius: 6,
                    marginBottom: 8,
                    fontSize: 16,
                  }}
                />
              ))}

              <button
                type="button"
                onClick={addIngredient}
                style={{
                  background: "#f2f4f7",
                  border: "none",
                  padding: "8px 12px",
                  borderRadius: 6,
                  cursor: "pointer",
                  fontWeight: 500,
                  width: "fit-content",
                }}
              >
                + Add Ingredient
              </button>
            </div>

            {/* Steps */}
            <div style={{ display: "flex", flexDirection: "column" }}>
              <label style={{ marginBottom: 4, fontWeight: 500 }}>Steps</label>
              <textarea
                rows={5}
                value={steps}
                onChange={(e) => setSteps(e.target.value)}
                required
                style={{
                  padding: 10,
                  border: "1px solid #ccc",
                  borderRadius: 6,
                  fontSize: 16,
                }}
              />
            </div>

            {/* Image */}
            <div style={{ display: "flex", flexDirection: "column" }}>
              <label style={{ marginBottom: 4, fontWeight: 500 }}>
                Image (optional)
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              style={{
                marginTop: 8,
                padding: "12px 0",
                background: "#007bff",
                color: "white",
                border: "none",
                borderRadius: 6,
                fontSize: 18,
                fontWeight: 600,
                cursor: "pointer",
                opacity: loading ? 0.6 : 1,
              }}
            >
              {loading ? "Creating..." : "Create Recipe"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
