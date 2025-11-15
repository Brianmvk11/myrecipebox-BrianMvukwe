import { useState } from "react";
import Login from "../pages/Login";
import Register from "../pages/Register";

type Tab = "login" | "register";

export default function AuthTabs() {
  const [activeTab, setActiveTab] = useState<Tab>("login");

  return (
    <div>        
      <h2>MyRecipeBox - Your AI Cooking Companion</h2>
      <div style={{ display: "flex", gap: "10px" }}>
        <button onClick={() => setActiveTab("login")}>Login</button>
        <button onClick={() => setActiveTab("register")}>Register</button>
      </div>

      {activeTab === "login" && <Login />}
      {activeTab === "register" && <Register />}
    </div>
  );
}
