import { Link, NavLink, useNavigate } from "react-router-dom";

const navItems = [
  { label: "Home", to: "/" },
  { label: "Lobby", to: "/lobby" },
  { label: "Leaderboard", to: "/leaderboard" },
  { label: "Rewards", to: "/rewards" },
];

type AppHeaderProps = {
  user: any;
  onLogout: () => void;
}

export default function AppHeader({ user, onLogout }: AppHeaderProps) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    onLogout();
    navigate("/login");
  };

  return (
    <header className="app-header" style={{ 
      position: "sticky", 
      top: 0, 
      zIndex: 1000, 
      background: "rgba(255, 255, 255, 0.85)", 
      backdropFilter: "blur(12px)", 
      borderBottom: "1px solid rgba(11, 31, 42, 0.08)",
      padding: "1rem clamp(1.5rem, 4vw, 4rem)",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center"
    }}>
      {/* BRANDING SECTION */}
      <Link className="brand" to="/" style={{ textDecoration: "none", color: "var(--ink)" }}>
        <div className="logo-mark" style={{ width: "50px", height: "50px", fontSize: "1rem", boxShadow: "0 4px 15px rgba(0, 184, 169, 0.3)" }}>MGT</div>
        <div style={{ marginLeft: "1rem" }}>
          <p className="eyebrow" style={{ margin: 0, fontSize: "0.65rem", letterSpacing: "3px" }}>MACHINES GOT TALENT</p>
          <h1 style={{ margin: 0, fontSize: "1.4rem", fontWeight: 800 }}>Comedy Studio</h1>
        </div>
      </Link>

      {/* NAVIGATION SECTION */}
      <nav className="app-nav" style={{ display: "flex", gap: "0.5rem", background: "rgba(11, 31, 42, 0.04)", padding: "0.4rem", borderRadius: "999px" }}>
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            style={({ isActive }) => ({
              textDecoration: "none",
              padding: "0.6rem 1.4rem",
              borderRadius: "999px",
              fontSize: "0.9rem",
              fontWeight: 600,
              color: isActive ? "#fff" : "var(--muted)",
              background: isActive ? "var(--navy)" : "transparent",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              boxShadow: isActive ? "0 4px 12px rgba(31, 42, 68, 0.2)" : "none"
            })}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* USER SECTION */}
      <div className="user-section" style={{ display: "flex", alignItems: "center", gap: "1.2rem" }}>
        {user ? (
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <div style={{ textAlign: "right", display: "flex", flexDirection: "column" }}>
               <span style={{ fontSize: "0.7rem", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "1px" }}>Signed in as</span>
               <span style={{ fontSize: "0.9rem", fontWeight: "bold", color: "var(--ink)" }}>{user.username}</span>
            </div>
            <div 
              style={{ width: "42px", height: "42px", borderRadius: "12px", background: "var(--navy)", display: "grid", placeItems: "center", color: "#fff", fontWeight: "bold", cursor: "pointer", boxShadow: "0 4px 10px rgba(0,0,0,0.1)" }}
              onClick={handleLogout}
              title="Click to Logout"
            >
              {user.username[0].toUpperCase()}
            </div>
          </div>
        ) : (
          <Link to="/login" className="cta" style={{ textDecoration: "none", fontSize: "0.85rem", padding: "0.6rem 1.5rem" }}>Sign In</Link>
        )}
      </div>
    </header>
  );
}