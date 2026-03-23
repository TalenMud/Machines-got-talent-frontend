import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { apiFetch } from "../api/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const response = await apiFetch<any>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      localStorage.setItem("token", response.token);
      localStorage.setItem("user", JSON.stringify(response.user));
      navigate("/lobby");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="page login-page" style={{ maxWidth: "400px", margin: "40px auto" }}>
      <div className="panel">
        <h3>Login</h3>
        <p className="card-sub">Access your comedy control room.</p>
        <form onSubmit={handleLogin} className="form-grid">
          <label>
            Email
            <input 
              type="email" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              required 
            />
          </label>
          <label>
            Password
            <input 
              type="password" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              required 
            />
          </label>
          {error && <p className="error" style={{ color: "red", fontSize: "0.8em" }}>{error}</p>}
          <button className="cta" type="submit">Login</button>
        </form>
        <p style={{ marginTop: "20px", fontSize: "0.9em" }}>
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
}