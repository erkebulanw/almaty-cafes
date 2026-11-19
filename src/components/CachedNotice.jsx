export default function CachedNotice() {
  return (
    <p
      role="status"
      style={{
        margin: "8px 0",
        padding: "8px 12px",
        borderRadius: 8,
        background: "#fff3cd",
        color: "#664d03",
        fontSize: 14,
      }}
    >
      You are viewing saved (cached) data. It may be out of date until the connection returns.
    </p>
  );
}