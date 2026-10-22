import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getCafe, deleteCafe } from "../api/cafeApi.js";
import Rating from "../components/Rating.jsx";
import { Loader, ErrorMessage } from "../components/Status.jsx";

export default function CafeDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [request, setRequest] = useState({ status: "loading", cafe: null, error: null });
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    setRequest({ status: "loading", cafe: null, error: null }); // reset when the id changes
    getCafe(id, controller.signal)
      .then((cafe) => setRequest({ status: "success", cafe, error: null }))
      .catch((err) => {
        if (err.name !== "AbortError") setRequest({ status: "error", cafe: null, error: err.message });
      });
    return () => controller.abort();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm("Delete this café?")) return;
    setDeleting(true);
    await deleteCafe(id);
    navigate("/");
  };

  const { status, cafe, error } = request;
  return (
    <>
      <Link to="/" className="back">← Back to list</Link>
      {status === "loading" && <Loader text="Loading café…" />}
      {status === "error" && <ErrorMessage message={error} />}
      {status === "success" && (
        <article className="detail">
          <h1>{cafe.name}</h1>
          <p className="muted">{cafe.type} in {cafe.district}</p>
          <p className="tags"><Rating value={cafe.rating} /><span>{"₸".repeat(cafe.price)}</span><span>{cafe.wifi ? "Wi-Fi available" : "No Wi-Fi"}</span></p>
          <p>{cafe.description}</p>
          <button className="btn btn--danger" onClick={handleDelete} disabled={deleting}>{deleting ? "Deleting…" : "Delete café"}</button>
        </article>
      )}
    </>
  );
}