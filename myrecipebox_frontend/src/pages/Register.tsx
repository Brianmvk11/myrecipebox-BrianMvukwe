import { useState } from "react";
import { registerUser } from "../api";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      await registerUser({ name, email, password });
      setSuccess("Registration successful! You can now log in.");
      navigate("/");
    } catch (err: any) {
      setError(err.message);
    }
  }

  return (
    <form onSubmit={handleRegister} style={styles.form}>
      <h2 style={styles.title}>Create Account</h2>

      {error && <p style={styles.error}>{error}</p>}
      {success && <p style={styles.success}>{success}</p>}

      <label style={styles.label}>Name</label>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={styles.input}
      />

      <label style={styles.label}>Email</label>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={styles.input}
      />

      <label style={styles.label}>Password</label>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={styles.input}
      />

      <button type="submit" style={styles.button}>Register</button>
    </form>
  );
}

/* =====================================
   INLINE STYLES SECTION
   ===================================== */
const styles: { [key: string]: React.CSSProperties } = {
  form: {
    display: "flex",
    flexDirection: "column",
    padding: "20px",
    backgroundColor: "white",
    borderRadius: "10px",
    boxShadow: "0 2px 12px rgba(0,0,0,0.1)",
    border: "1px solid #e5e5e5",
  },
  title: {
    fontSize: "24px",
    fontWeight: 700,
    marginBottom: "16px",
    color: "#333",
    textAlign: "center",
  },
  error: {
    color: "#c0392b",
    marginBottom: "10px",
    fontSize: "14px",
    textAlign: "center",
  },
  success: {
    color: "#27ae60",
    marginBottom: "10px",
    fontSize: "14px",
    textAlign: "center",
  },
  label: {
    marginTop: "10px",
    marginBottom: "4px",
    fontSize: "14px",
    fontWeight: 600,
    color: "#444",
  },
  input: {
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    marginBottom: "10px",
    outline: "none",
    fontSize: "14px",
  },
  button: {
    marginTop: "14px",
    padding: "12px",
    backgroundColor: "#007AFF",
    color: "white",
    fontWeight: 600,
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "16px",
  },
};