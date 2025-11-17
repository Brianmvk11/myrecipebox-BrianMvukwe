import { useState } from "react";
import { loginUser } from "../api";
import { useNavigate } from "react-router-dom";

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

      // alert("Login successful!");
      navigate("/home")

    } catch (err: any) {
      setError(err.message);
    }
  }

  return (
    <form onSubmit={handleLogin}>
      <h2>Login</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <label>Email</label>
      <input type="email" value={email} onChange={e => setEmail(e.target.value)} />

      <label>Password</label>
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} />

      <button type="submit">Login</button>
    </form>
  );
}
