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
    <div className="page auth-page">
      <div className="panel auth-panel">
        <p className="eyebrow auth-eyebrow">Welcome Back</p>
        <h2 className="auth-title">Studio Sign In</h2>
        
        {error && (
          <div className="auth-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
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
          <button className="cta auth-submit" type="submit" disabled={loading}>
            {loading ? "Authenticating..." : "Enter Studio"}
          </button>
        </form>
        
        <p className="auth-note">
          New to the studio? <Link to="/register" className="auth-link">Apply for Access</Link>
        </p>
      </div>
    </div>
  );
}
