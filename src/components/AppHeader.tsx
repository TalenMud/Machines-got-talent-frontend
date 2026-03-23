import { Link, NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const navItems = [
  { label: "Lobby", to: "/lobby" },
  { label: "Playboard", to: "/playboard" },
  { label: "Showdown", to: "/showdown" },
  { label: "Leaderboard", to: "/leaderboard" },
  { label: "Rewards", to: "/rewards" },
];

export default function AppHeader({ status }: { status?: any }) {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (e) {
        console.error("Failed to parse user data", e);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  return (
    <header className="app-header">
      <Link className="brand" to="/">
        <div className="logo-mark">MGT</div>
        <div>
          <p className="eyebrow">Machines got talent</p>
          <h1>Comedy Control Room</h1>
        </div>
      </Link>
      <nav className="app-nav">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            className={({ isActive }) => (isActive ? "nav-pill active" : "nav-pill")}
            to={item.to}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className="user-section">
        {user ? (
          <div className="row">
            <span style={{ marginRight: "10px" }}>{user.username}</span>
            <button className="ghost" onClick={handleLogout}>Logout</button>
          </div>
        ) : (
          <Link to="/login" className="nav-pill">Login</Link>
        )}
      </div>
    </header>
  );
}