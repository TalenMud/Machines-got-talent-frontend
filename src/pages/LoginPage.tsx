import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { apiFetch } from "../api/client";

export default function LoginPage({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await apiFetch<any>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      localStorage.setItem("token", response.token);
      localStorage.setItem("user", JSON.stringify(response.user));
      onLogin(); // Trigger app state refresh
      navigate("/");
    } catch (err: any) {
      setError(err.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page" style={{ maxWidth: "400px", margin: "4rem auto" }}>
      <div className="panel" style={{ padding: "2.5rem" }}>
        <p className="eyebrow" style={{ textAlign: "center" }}>Welcome Back</p>
        <h2 style={{ textAlign: "center", marginBottom: "2rem" }}>Studio Sign In</h2>
        
        {error && (
          <div style={{ background: "var(--coral)", color: "#fff", padding: "1rem", borderRadius: "12px", marginBottom: "1.5rem", fontSize: "0.85rem" }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
          <label>
            Email Address
            <input 
              type="email" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              required 
              placeholder="producer@studio.com"
            />
          </label>
          <label>
            Password
            <input 
              type="password" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              required 
              placeholder="••••••••"
            />
          </label>
          <button className="cta" type="submit" disabled={loading} style={{ marginTop: "1rem" }}>
            {loading ? "Authenticating..." : "Enter Studio"}
          </button>
        </form>
        
        <p style={{ marginTop: "2rem", textAlign: "center", fontSize: "0.9rem", color: "var(--muted)" }}>
          New to the studio? <Link to="/register" style={{ color: "var(--navy)", fontWeight: "bold" }}>Apply for Access</Link>
        </p>
      </div>
    </div>
  );
}