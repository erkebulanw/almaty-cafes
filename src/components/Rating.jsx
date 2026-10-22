export default function Rating({ value }) {
  return <span className="rating" aria-label={`Rating ${value} out of 5`}>★ {value.toFixed(1)}</span>;
}