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
    <div className="page register-page" style={{ maxWidth: "400px", margin: "40px auto" }}>
      <div className="panel">
        <h3>Create Profile</h3>
        <p className="card-sub">Join the talent pool.</p>
        <form onSubmit={handleRegister} className="form-grid">
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
          {error && <p className="error" style={{ color: "red", fontSize: "0.8em" }}>{error}</p>}
          <button className="cta" type="submit">Register</button>
        </form>
        <p style={{ marginTop: "20px", fontSize: "0.9em" }}>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}