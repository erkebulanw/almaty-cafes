import { NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <header className="navbar">
      <div className="container navbar__inner">
        <NavLink to="/" className="brand">Almaty Cafés</NavLink>
        <nav>
          <NavLink to="/" end>Browse</NavLink>
          <NavLink to="/add">Add a café</NavLink>
        </nav>
      </div>
    </header>
  );
}