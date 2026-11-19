import useOnlineStatus from "../hooks/useOnlineStatus.js";

export default function ConnectionBadge() {
  const online = useOnlineStatus();
  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        position: "fixed",
        left: 12,
        bottom: 12,
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        gap: 6,
        padding: "6px 12px",
        borderRadius: 999,
        fontSize: 14,
        color: "#fff",
        background: online ? "#2e7d32" : "#c62828",
        boxShadow: "0 2px 8px rgba(0,0,0,.25)",
      }}
    >
      <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#fff" }} />
      {online ? "Online" : "Offline"}
    </div>
  );
}