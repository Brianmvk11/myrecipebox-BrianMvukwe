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
      <h1>Add New Recipe</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 20 }}
      >
        {/* Title */}
        <div>
          <label>Title</label>
          <input 
            type="text" 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required 
          />
        </div>

        {/* Ingredients */}
        <div>
          <label>Ingredients</label>
          {ingredients.map((ing, i) => (
            <input
              key={i}
              type="text"
              value={ing}
              placeholder={`Ingredient ${i + 1}`}
              onChange={(e) => updateIngredient(e.target.value, i)}
              required
              style={{ marginBottom: 6 }}
            />
          ))}
          <button type="button" onClick={addIngredient}>
            + Add Ingredient
          </button>
        </div>

        {/* Steps */}
        <div>
          <label>Steps</label>
          <textarea
            rows={5}
            value={steps}
            onChange={(e) => setSteps(e.target.value)}
            required
          />
        </div>

        {/* Image */}
        <div>
          <label>Image (optional)</label>
          <input 
            type="file" 
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] || null)} 
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Recipe"}
        </button>
      </form>
    </div>
  );
}