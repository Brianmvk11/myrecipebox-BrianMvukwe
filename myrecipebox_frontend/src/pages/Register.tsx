import { useState } from "react";
import { registerUser } from "../api";
import { useRouter } from "next/navigation";


export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      await registerUser({ name, email, password });
      setSuccess("Registration successful! You can now log in.");
      router.push("/Login")

    } catch (err: any) {
      setError(err.message);
    }
  }

  return (
    <form onSubmit={handleRegister}>
      <h2>Register</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}

      <label>Name</label>
      <input value={name} onChange={e => setName(e.target.value)} />

      <label>Email</label>
      <input type="email" value={email} onChange={e => setEmail(e.target.value)} />

      <label>Password</label>
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} />

      <button type="submit">Register</button>
    </form>
  );
}
