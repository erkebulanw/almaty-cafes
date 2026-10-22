import { DISTRICTS, TYPES } from "../api/cafeApi.js";

export default function Filters({ filters, onChange, onReset }) {
  const set = (e) => onChange({ ...filters, [e.target.name]: e.target.value });
  return (
    <div className="filters">
      <input name="search" type="search" placeholder="Search by name or description" value={filters.search} onChange={set} aria-label="Search cafés" />
      <select name="district" value={filters.district} onChange={set} aria-label="District">
        <option value="all">All districts</option>
        {DISTRICTS.map((d) => <option key={d} value={d}>{d}</option>)}
      </select>
      <select name="type" value={filters.type} onChange={set} aria-label="Type">
        <option value="all">All types</option>
        {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
      </select>
      <select name="sort" value={filters.sort} onChange={set} aria-label="Sort by">
        <option value="rating-desc">Rating: high to low</option>
        <option value="rating-asc">Rating: low to high</option>
        <option value="name-asc">Name: A to Z</option>
        <option value="newest">Newest first</option>
      </select>
      <button className="btn btn--ghost" onClick={onReset}>Reset</button>
    </div>
  );
}