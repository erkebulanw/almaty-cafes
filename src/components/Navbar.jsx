import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Navbar() {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <header className="navbar">
      <div className="container navbar__inner">
        <NavLink to="/" className="brand">Almaty Cafés</NavLink>
        <nav>
          <NavLink to="/" end>Browse</NavLink>
          <NavLink to="/add">Add a café</NavLink>
          {!loading && (user ? (
            <>
              <NavLink to="/profile">Profile</NavLink>
              <button className="btn" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <NavLink to="/login">Login</NavLink>
              <NavLink to="/signup">Signup</NavLink>
            </>
          ))}
        </nav>
      </div>
    </header>
  );
}