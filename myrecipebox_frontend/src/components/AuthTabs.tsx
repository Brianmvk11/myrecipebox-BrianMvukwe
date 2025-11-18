import { useState } from "react";
import Login from "../pages/Login";
import Register from "../pages/Register";
import loginFood from "../assets/login-food.jpg";
import registerFood from "../assets/register-food.jpg";

type Tab = "login" | "register";

export default function AuthTabs() {
  const [activeTab, setActiveTab] = useState<Tab>("login");

  const bgImage = activeTab === "login" ? loginFood : registerFood;

  return (
    <div style={styles.page}>
      {/* LEFT IMAGE SIDE */}
      <div
        style={{
          ...styles.imageSide,
          backgroundImage: `url(${bgImage})`,
        }}
      />

      {/* RIGHT FORM SIDE */}
      <div style={styles.formSide}>
        <h2 style={styles.title}>MyRecipeBox - Your AI Cooking Companion</h2>

        {/* TABS */}
        <div style={styles.tabRow}>
          <button
            onClick={() => setActiveTab("login")}
            style={activeTab === "login" ? styles.activeTab : styles.inactiveTab}
          >
            Login
          </button>

          <button
            onClick={() => setActiveTab("register")}
            style={activeTab === "register" ? styles.activeTab : styles.inactiveTab}
          >
            Register
          </button>
        </div>

        <div style={styles.formContainer}>
          {activeTab === "login" && <Login />}
          {activeTab === "register" && <Register />}
        </div>
      </div>
    </div>
  );
}

/* =====================================
   INLINE STYLES SECTION
   ===================================== */
const styles: { [key: string]: React.CSSProperties } = {
  page: {
    display: "flex",
    height: "100vh",
    width: "100vw",
    overflow: "hidden",
    fontFamily: "sans-serif",
  },
  imageSide: {
    width: "50%",
    backgroundSize: "cover",
    backgroundPosition: "center",
  },
  formSide: {
    width: "50%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: "40px",
    backgroundColor: "#fafafa",
  },
  title: {
    fontSize: "28px",
    fontWeight: 700,
    marginBottom: "20px",
    color: "#333",
    textAlign: "center",
  },
  tabRow: {
    display: "flex",
    gap: "12px",
    marginBottom: "20px",
  },
  activeTab: {
    padding: "10px 24px",
    borderRadius: "8px",
    backgroundColor: "#007AFF",
    color: "white",
    fontWeight: 600,
    border: "none",
    cursor: "pointer",
  },
  inactiveTab: {
    padding: "10px 24px",
    borderRadius: "8px",
    backgroundColor: "#ddd",
    color: "#333",
    fontWeight: 500,
    border: "none",
    cursor: "pointer",
  },
  formContainer: {
    width: "100%",
    maxWidth: "380px",
  },
};