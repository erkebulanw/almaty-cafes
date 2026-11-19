import { useRegisterSW } from "virtual:pwa-register/react";

export default function UpdatePrompt() {
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(_url, registration) {
      // раз в час проверяем, не вышла ли новая версия
      if (registration) setInterval(() => registration.update(), 60 * 60 * 1000);
    },
  });

  if (!offlineReady && !needRefresh) return null;

  const close = () => {
    setOfflineReady(false);
    setNeedRefresh(false);
  };

  return (
    <div
      role="status"
      style={{
        position: "fixed",
        left: 12,
        right: 12,
        bottom: 60,
        maxWidth: 440,
        margin: "0 auto",
        zIndex: 1001,
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        gap: 8,
        padding: 12,
        borderRadius: 12,
        color: "#fff",
        background: "#3b2416",
        boxShadow: "0 4px 16px rgba(0,0,0,.35)",
      }}
    >
      <span style={{ flex: "1 1 200px" }}>
        {needRefresh ? "A new version is available." : "The app is ready to work offline."}
      </span>
      {needRefresh && (
        <button className="btn" onClick={() => updateServiceWorker(true)}>Update</button>
      )}
      <button className="btn" onClick={close}>Close</button>
    </div>
  );
}