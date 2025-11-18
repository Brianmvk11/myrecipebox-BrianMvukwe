import { useState } from "react";
import { loginUser } from "../api";
import { useNavigate } from "react-router-dom";

/* ============================
   STYLES (Tailwind class groups)
   ============================ */
const styles = {
  form: "flex flex-col bg-white p-6 rounded-xl shadow-md border border-gray-200",
  title: "text-2xl font-semibold text-gray-800 mb-4 text-center",
  error: "text-red-600 text-sm mb-2",
  label: "text-gray-700 font-medium mt-2",
  input:
    "mt-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none",
  button:
    "mt-4 bg-green-600 text-white py-2 rounded-lg font-medium hover:bg-green-700 transition-all duration-300",
};

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    try {
      const res = await loginUser(email, password);

      // Store token
      localStorage.setItem("access_token", res.access_token);

      // Store user info
      localStorage.setItem("user_id", res.user_id);
      localStorage.setItem("name", res.name);
      localStorage.setItem("email", res.email);

      navigate("/home");
    } catch (err: any) {
      setError(err.message);
    }
  }

  return (
    <form onSubmit={handleLogin} className={styles.form}>
      <h2 className={styles.title}>Login</h2>

      {error && <p className={styles.error}>{error}</p>}

      <label className={styles.label}>Email</label>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className={styles.input}
      />

      <label className={styles.label}>Password</label>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className={styles.input}
      />

      <button type="submit" className={styles.button}>
        Login
      </button>
    </form>
  );
}