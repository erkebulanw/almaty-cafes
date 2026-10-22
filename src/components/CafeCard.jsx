import { Link } from "react-router-dom";
import Rating from "./Rating.jsx";

export default function CafeCard({ cafe }) {
  return (
    <li className="card">
      <Link to={`/cafe/${cafe.id}`}>
        <div className="card__top">
          <h3>{cafe.name}</h3>
          <Rating value={cafe.rating} />
        </div>
        <p className="muted">{cafe.type} in {cafe.district}</p>
        <p className="card__desc">{cafe.description}</p>
        <p className="tags">
          <span>{"₸".repeat(cafe.price)}</span>
          {cafe.wifi && <span>Wi-Fi</span>}
        </p>
      </Link>
    </li>
  );
}