import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import useOnlineStatus from "../hooks/useOnlineStatus.js";
import { checkConnection } from "../services/connectionService.js";

export default function OfflinePage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const online = useOnlineStatus();
  const wasOnline = useRef(online);
  const [checking, setChecking] = useState(false);
  const [failed, setFailed] = useState(false);

  const restore = () => {
    queryClient.invalidateQueries();
    navigate("/", { replace: true });
  };

  // когда связь вернулась, сами возвращаем пользователя в приложение
  useEffect(() => {
    if (!wasOnline.current && online) restore();
    wasOnline.current = online;
  }, [online]); // eslint-disable-line react-hooks/exhaustive-deps

  const retry = async () => {
    setChecking(true);
    setFailed(false);
    const ok = await checkConnection();
    setChecking(false);
    if (ok) restore();
    else setFailed(true);
  };

  return (
    <section
      style={{
        maxWidth: 480,
        margin: "40px auto",
        padding: "32px 20px",
        textAlign: "center",
        borderRadius: 16,
        background: "#fff8f0",
        border: "1px solid #e8d5c4",
      }}
    >
      <div style={{ fontSize: 56 }} aria-hidden="true">☕</div>
      <h1>You're offline</h1>
      <p>
        We couldn't reach the internet, and this page isn't saved on your device yet.
        Pages and cafés you opened before are still available.
      </p>
      {failed && <p role="alert" style={{ color: "#c62828" }}>Still offline. Check your connection and try again.</p>}
      <button className="btn" onClick={retry} disabled={checking} style={{ minHeight: 44, minWidth: 180 }}>
        {checking ? "Checking…" : "Retry Connection"}
      </button>
    </section>
  );
}