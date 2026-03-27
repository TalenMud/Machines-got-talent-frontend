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
      <Link className="brand" to="/" style={{ textDecoration: "none", color: "var(--ink)", display: "flex", alignItems: "center" }}>
        <div className="logo-mark" style={{ width: "45px", height: "45px", fontSize: "0.9rem", boxShadow: "0 4px 15px rgba(0, 184, 169, 0.3)", borderRadius: "12px", background: "var(--teal)", color: "#fff", display: "grid", placeItems: "center", fontWeight: "bold" }}>MGT</div>
        <div style={{ marginLeft: "1rem" }}>
          <p className="eyebrow" style={{ margin: 0, fontSize: "0.6rem", letterSpacing: "2px" }}>MACHINES GOT TALENT</p>
          <h1 style={{ margin: 0, fontSize: "1.2rem", fontWeight: 800 }}>Comedy Studio</h1>
        </div>
      </Link>

      {/* NAVIGATION SECTION */}
      <nav className="app-nav" style={{ display: "flex", gap: "0.3rem", background: "rgba(11, 31, 42, 0.04)", padding: "0.3rem", borderRadius: "999px" }}>
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            style={({ isActive }) => ({
              textDecoration: "none",
              padding: "0.5rem 1.2rem",
              borderRadius: "999px",
              fontSize: "0.85rem",
              fontWeight: 600,
              color: isActive ? "#fff" : "var(--muted)",
              background: isActive ? "var(--navy)" : "transparent",
              transition: "all 0.3s ease",
              boxShadow: isActive ? "0 4px 12px rgba(31, 42, 68, 0.2)" : "none"
            })}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* USER & STATS SECTION */}
      <div className="user-section" style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>  
        {user ? (
          <>
            {/* PERSISTENT STATS BAR */}
            <div className="stats-bar" style={{ 
              display: "flex", 
              gap: "1px", 
              background: "rgba(11, 31, 42, 0.08)", 
              borderRadius: "12px", 
              overflow: "hidden",
              border: "1px solid rgba(11, 31, 42, 0.08)"
            }}>
              <div style={{ background: "#fff", padding: "0.4rem 0.8rem", textAlign: "center" }}>
                <p className="eyebrow" style={{ margin: 0, fontSize: "0.55rem", color: "var(--muted)" }}>WINS</p>
                <p style={{ margin: 0, fontWeight: "bold", color: "var(--teal)", fontSize: "0.9rem" }}>{user.win_count || 0}</p>
              </div>
              <div style={{ background: "#fff", padding: "0.4rem 0.8rem", textAlign: "center" }}>
                <p className="eyebrow" style={{ margin: 0, fontSize: "0.55rem", color: "var(--muted)" }}>TOKENS</p>
                <p style={{ margin: 0, fontWeight: "bold", color: "var(--gold)", fontSize: "0.9rem" }}>{user.balance || 0}</p>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "0.8rem" }}>
              <div style={{ textAlign: "right", display: "flex", flexDirection: "column" }}>
                 <span style={{ fontSize: "0.6rem", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "1px" }}>Producer</span>
                 <span style={{ fontSize: "0.85rem", fontWeight: "bold", color: "var(--ink)" }}>{user.username}</span>
              </div>
              <div
                style={{ width: "38px", height: "38px", borderRadius: "10px", background: "var(--navy)", display: "grid", placeItems: "center", color: "#fff", fontWeight: "bold", cursor: "pointer", transition: "transform 0.2s" }}
                onClick={handleLogout}
                title="Sign Out"
                onMouseOver={(e) => e.currentTarget.style.transform = "scale(1.05)"}
                onMouseOut={(e) => e.currentTarget.style.transform = "scale(1)"}
              >
                {user.username[0].toUpperCase()}
              </div>
            </div>
          </>
        ) : (
          <Link to="/login" className="cta" style={{ textDecoration: "none", fontSize: "0.8rem", padding: "0.5rem 1.2rem" }}>Studio Access</Link>
        )}
      </div>
    </header>
  );
}
