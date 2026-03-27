import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { apiFetch } from "../api/client";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await apiFetch<any>("/auth/register", {
        method: "POST",
        body: JSON.stringify({ username, email, password }),
      });
      navigate("/login");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="page auth-page register-page">
      <div className="panel auth-panel auth-panel--wide">
        <p className="eyebrow auth-eyebrow">Join the Show</p>
        <h3 className="auth-title">Create Profile</h3>
        <p className="card-sub">Join the talent pool.</p>
        <form onSubmit={handleRegister} className="form-grid auth-form register-form">
          <label>
            Username
            <input 
              type="text" 
              value={username} 
              onChange={e => setUsername(e.target.value)} 
              required 
            />
          </label>
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
          {error && <p className="error auth-inline-error">{error}</p>}
          <button className="cta" type="submit">Register</button>
        </form>
        <p className="auth-note">
          Already have an account? <Link to="/login" className="auth-link">Login</Link>
        </p>
      </div>
    </div>
  );
}
