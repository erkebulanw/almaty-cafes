import { useEffect, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Navbar() {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  // закрываем меню при переходе на другую страницу
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  // закрываем меню по клавише Escape
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <header className="navbar">
      <div className="container navbar__inner">
        <NavLink to="/" className="brand">Almaty Cafés</NavLink>

        <button
          type="button"
          className="navbar__toggle"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="main-nav"
          onClick={() => setOpen((o) => !o)}
        >
          <span className="burger" aria-hidden="true" />
        </button>

        <nav id="main-nav" className={open ? "is-open" : ""} aria-label="Main">
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