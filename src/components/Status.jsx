export function Loader({ text = "Loading cafés…" }) {
  return <div className="state" role="status"><span className="spinner" aria-hidden="true" /> {text}</div>;
}

export function ErrorMessage({ message, onRetry }) {
  return (
    <div className="state state--error" role="alert">
      <p>Something went wrong: {message}</p>
      {onRetry && <button className="btn" onClick={onRetry}>Try again</button>}
    </div>
  );
}

export function EmptyState({ title, children }) {
  return (
    <div className="state">
      <h2>{title}</h2>
      {children}
    </div>
  );
}