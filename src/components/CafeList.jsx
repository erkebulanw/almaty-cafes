import CafeCard from "./CafeCard.jsx";

export default function CafeList({ cafes }) {
  return (
    <ul className="grid">
      {cafes.map((cafe) => (
        <CafeCard key={cafe.id} cafe={cafe} />
      ))}
    </ul>
  );
}