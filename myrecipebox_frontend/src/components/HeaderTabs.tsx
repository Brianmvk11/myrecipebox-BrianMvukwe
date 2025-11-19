import { useLocation, useNavigate } from "react-router-dom";

export default function HeaderTabs() {
  const navigate = useNavigate();
  const location = useLocation();

  // Determine which tab is active
  const active = location.pathname;

  const tabStyle = (path: string): React.CSSProperties => ({
    cursor: "pointer",
    fontSize: 18,
    padding: "6px 12px",
    borderRadius: 6,
    color: active === path ? "#007AFF" : "#333",
    fontWeight: active === path ? 700 : 500,
    backgroundColor: active === path ? "#E7F1FF" : "transparent",
    transition: "0.2s",
  });

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: 60,
        backgroundColor: "white",
        display: "flex",
        alignItems: "center",
        padding: "10px 20px",
        borderBottom: "1px solid #ddd",
        gap: 30,
        zIndex: 999,
      }}
    >
      {/* LEFT — Logo */}
      <div
        onClick={() => navigate("/")}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          cursor: "pointer",
          fontSize: 22,
          fontWeight: "bold",
          color: "#007AFF",
        }}
      >
        🍽️ <span>MyRecipeBox</span>
      </div>

      {/* CENTER — Tabs */}
      <div style={{ display: "flex", gap: 20, marginLeft: 80 }}>
        <span style={tabStyle("/home")} onClick={() => navigate("/home")}>
          Home
        </span>

        <span
          style={tabStyle("/favorites")}
          onClick={() => navigate("/favorites")}
        >
          My Favorites
        </span>

        <span
          style={tabStyle("/ai_suggestions")}
          onClick={() => navigate("/ai_suggestions")}
        >
          AI Suggestions
        </span>
      </div>

      {/* RIGHT — Add Recipe */}
      <div style={{ marginLeft: "auto" }}>
        <button
          onClick={() => navigate("/add_recipe")}
          style={{
            padding: "8px 16px",
            fontSize: 16,
            borderRadius: 6,
            cursor: "pointer",
            backgroundColor: "#007AFF",
            color: "white",
            border: "none",
            fontWeight: 600,
          }}
        >
          ➕ Add Recipe
        </button>
      </div>
    </div>
  );
}
