import { Link, useNavigate, useParams } from "react-router-dom";
import { useCafe, useDeleteCafe } from "../hooks/useCafes.js";
import Rating from "../components/Rating.jsx";
import { Loader, ErrorMessage } from "../components/Status.jsx";

export default function CafeDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: cafe, isPending, isError, error } = useCafe(id);
  const deleteMutation = useDeleteCafe();

  const handleDelete = async () => {
    if (!window.confirm("Delete this café?")) return;
    try {
      await deleteMutation.mutateAsync(id);
      navigate("/");
    } catch {
      // ошибка отображается ниже через deleteMutation.error
    }
  };

  return (
    <>
      <Link to="/" className="back">← Back to list</Link>
      {isPending && <Loader text="Loading café…" />}
      {isError && <ErrorMessage message={error.message} />}
      {deleteMutation.isError && <ErrorMessage message={deleteMutation.error.message} />}
      {cafe && (
        <article className="detail">
          <h1>{cafe.name}</h1>
          <p className="muted">{cafe.type} in {cafe.district}</p>
          <p className="tags">
            <Rating value={cafe.rating} />
            <span>{"₸".repeat(cafe.price)}</span>
            <span>{cafe.wifi ? "Wi-Fi available" : "No Wi-Fi"}</span>
          </p>
          <p>{cafe.description}</p>
          <button className="btn btn--danger" onClick={handleDelete} disabled={deleteMutation.isPending}>
            {deleteMutation.isPending ? "Deleting…" : "Delete café"}
          </button>
        </article>
      )}
    </>
  );
}