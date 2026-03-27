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
    <header className="app-header">
      <Link className="brand" to="/">
        <div className="logo-mark">MGT</div>
        <div className="brand-copy">
          <p className="eyebrow brand-eyebrow">MACHINES GOT TALENT</p>
          <h1 className="brand-title">Comedy Studio</h1>
        </div>
      </Link>

      <nav className="app-nav">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `nav-pill${isActive ? " active" : ""}`}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="user-section">
        {user ? (
          <div className="user-badge">
            <div className="user-copy">
               <span className="user-label">Signed in as</span>
               <span className="user-name">{user.username}</span>
            </div>
            <div 
              className="user-avatar"
              onClick={handleLogout}
              title="Click to Logout"
            >
              {user.username[0].toUpperCase()}
            </div>
          </div>
        ) : (
          <Link to="/login" className="cta header-signin">Sign In</Link>
        )}
      </div>
    </header>
  );
}
