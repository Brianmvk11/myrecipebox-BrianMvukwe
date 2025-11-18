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
      setAiRecipe(data.recipes[0]); // only 1 recipe
    } catch (err: any) {
      alert(err.message);
    }

    setLoading(false);
  };

  const handleSaveRecipe = async () => {
    if (!aiRecipe) return;

    setSaving(true);

    try {
      // Create the recipe
      const created = await createRecipe({
        title: aiRecipe.title,
        ingredients: aiRecipe.ingredients,
        steps: aiRecipe.steps,
        file: uploadFile || null,
      });

      // Only add to favorites after user clicks save
      await addFavorite(created.id);

      alert("Recipe saved & added to favorites!");

      // Navigate to the recipe detail page
      navigate(`/recipe/${created.id}`);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <HeaderTabs />
      <h2>AI Suggestions</h2>

      <div style={{ marginBottom: 12 }}>
        <p>Enter ingredients (comma separated):</p>
        <input
          type="text"
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
          placeholder="e.g. chicken, rice, tomato"
          style={{ width: "300px", padding: "8px" }}
        />
        <button onClick={handleSuggest} style={{ marginLeft: "10px" }}>
          Suggest
        </button>
      </div>

      {loading && <p>Generating recipe...</p>}

      {aiRecipe && (
        <div style={{ marginTop: 20, padding: 15, border: "1px solid #ccc" }}>
          <h3>{aiRecipe.title}</h3>

          <strong>Ingredients:</strong>
          <ul>
            {aiRecipe.ingredients.map((ing: string, i: number) => (
              <li key={i}>{ing}</li>
            ))}
          </ul>

          <strong>Steps:</strong>
          <p>{aiRecipe.steps}</p>

          <div>
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
            style={{ marginTop: 10 }}
          >
            {saving ? "Saving..." : "Save Recipe & Add to Favorites"}
          </button>
        </div>
      )}
    </div>
  );
}
