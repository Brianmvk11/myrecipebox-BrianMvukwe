// components/HeaderTabs.tsx
import { useNavigate } from "react-router-dom";

export default function HeaderTabs() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        padding: "10px 20px",
        borderBottom: "1px solid #ddd",
        marginBottom: "20px",
        gap: 30,
      }}
    >
      {/* LEFT — Logo + Title */}
      <div
        onClick={() => navigate("/")}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          cursor: "pointer",
          fontSize: 22,
          fontWeight: "bold",
        }}
      >
        📦 <span>MyRecipeBox</span>
      </div>

      {/* CENTER — Tabs */}
      <div style={{ display: "flex", gap: 20, marginLeft: "80px" }}>
        <span
          onClick={() => navigate("/home")}
          style={{ cursor: "pointer", fontSize: 18 }}
        >
          Home
        </span>

        <span
          onClick={() => navigate("/favorites")}
          style={{ cursor: "pointer", fontSize: 18 }}
        >
          MyFavorites
        </span>

        <span
          onClick={() => navigate("/ai_suggestions")}
          style={{ cursor: "pointer", fontSize: 18 }}
        >
          AI Suggestions
        </span>
      </div>

      {/* RIGHT — Add Recipe */}
      <div style={{ marginLeft: "auto" }}>
        <button
          onClick={() => navigate("/add_recipe")}
          style={{
            padding: "8px 14px",
            fontSize: 16,
            borderRadius: 6,
            cursor: "pointer",
          }}
        >
          ➕ Add Recipe
        </button>
      </div>
    </div>
  );
}
