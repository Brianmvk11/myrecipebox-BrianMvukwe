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
      {/* LEFT IMAGE */}
      <div
        style={{
          ...styles.imageSide,
          backgroundImage: `url(${bgImage})`,
        }}
      />

      {/* RIGHT SIDE */}
      <div style={styles.formSide}>
        <h2 style={styles.title}>MyRecipeBox - Your AI Cooking Companion</h2>

        {/* TRUE TABS */}
        <div style={styles.tabsWrapper}>
          <div
            onClick={() => setActiveTab("login")}
            style={
              activeTab === "login"
                ? { ...styles.tab, ...styles.tabActive }
                : styles.tab
            }
          >
            Login
          </div>

          <div
            onClick={() => setActiveTab("register")}
            style={
              activeTab === "register"
                ? { ...styles.tab, ...styles.tabActive }
                : styles.tab
            }
          >
            Register
          </div>
        </div>

        {/* FORM CONTENT */}
        <div style={styles.formContainer}>
          {activeTab === "login" && <Login />}
          {activeTab === "register" && <Register />}
        </div>
      </div>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  page: {
    display: "flex",
    height: "100vh",
    width: "100vw",
    overflow: "hidden",
    fontFamily: "Arial, sans-serif",
  },

  imageSide: {
    width: "50%",
    height: "100%",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    flexShrink: 0, 
  },

  formSide: {
    width: "50%",
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "40px",
    backgroundColor: "#fafafa",
    overflowY: "auto",
    boxSizing: "border-box",
  },

  title: {
    fontSize: "26px",
    fontWeight: 700,
    marginBottom: "25px",
    color: "#222",
    textAlign: "center",
  },

  /* TABS LAYOUT */
  tabsWrapper: {
    display: "flex",
    width: "100%",
    maxWidth: "380px",
    borderBottom: "2px solid #ddd",
    marginBottom: "25px",
  },

  tab: {
    flex: 1,
    textAlign: "center",
    paddingBottom: "10px",
    cursor: "pointer",
    fontSize: "18px",
    fontWeight: 500,
    color: "#777",
    transition: "0.2s ease",
  },

  tabActive: {
    color: "#000",
    fontWeight: 700,
    borderBottom: "3px solid #007AFF",
  },

  formContainer: {
    width: "100%",
    maxWidth: "380px",
  },
};
