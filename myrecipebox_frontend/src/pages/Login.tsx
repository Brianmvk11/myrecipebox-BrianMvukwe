import { useState } from "react";
import { loginUser } from "../api";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

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
      setError(err?.message ?? "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleLogin} style={styles.form} aria-labelledby="login-heading">
      <h2 id="login-heading" style={styles.heading}>Login</h2>

      {error && <p role="alert" style={styles.error}>{error}</p>}

      <label htmlFor="email" style={styles.label}>Email</label>
      <input
        id="email"
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
        style={styles.input}
        autoComplete="email"
      />

      <label htmlFor="password" style={styles.label}>Password</label>
      <input
        id="password"
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
        style={styles.input}
        autoComplete="current-password"
      />

      <button type="submit" style={{ ...styles.button, opacity: loading ? 0.7 : 1 }} disabled={loading}>
        {loading ? "Logging in..." : "Login"}
      </button>
    </form>
  );
}

const styles: Record<string, React.CSSProperties> = {
  form: {
    width: "100%",
    maxWidth: 380,
    padding: 20,
    borderRadius: 10,
    backgroundColor: "#ffffff",
    boxShadow: "0 6px 20px rgba(0,0,0,0.06)",
    border: "1px solid #e6eef6",
    display: "flex",
    flexDirection: "column",
    gap: 10,
    boxSizing: "border-box",
  },
  heading: {
    margin: 0,
    fontSize: 22,
    fontWeight: 700,
    color: "#002741",
    marginBottom: 8,
    textAlign: "center",
  },
  error: {
    color: "#b91c1c",
    backgroundColor: "#fff5f5",
    padding: "8px 10px",
    borderRadius: 8,
    fontSize: 13,
    marginBottom: 4,
    textAlign: "center",
  },
  label: {
    fontSize: 13,
    fontWeight: 600,
    color: "#334155",
    marginTop: 8,
    marginBottom: 4,
  },
  input: {
    padding: "12px 14px",
    borderRadius: 8,
    border: "1px solid #cbd5e1",
    fontSize: 14,
    outline: "none",
    boxSizing: "border-box",
  },
  button: {
    marginTop: 10,
    padding: "12px 14px",
    backgroundColor: "#007AFF",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
    fontWeight: 600,
    fontSize: 15,
  },
};
