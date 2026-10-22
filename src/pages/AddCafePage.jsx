import { useState } from "react";
import { Link } from "react-router-dom";
import { addCafe } from "../api/cafeApi.js";
import CafeForm from "../components/CafeForm.jsx";
import { ErrorMessage } from "../components/Status.jsx";

export default function AddCafePage() {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [created, setCreated] = useState(null);
  const [formKey, setFormKey] = useState(0);

  const handleSubmit = async (data) => {
    setSubmitting(true);
    setError(null);
    setCreated(null);
    try {
      const cafe = await addCafe(data);
      setCreated(cafe);
      setFormKey((k) => k + 1); // new key -> the form remounts with empty state
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <h1>Add a café</h1>
      {created && (
        <p className="success" role="status">
          Saved “{created.name}”. <Link to={`/cafe/${created.id}`}>View it</Link>
        </p>
      )}
      {error && <ErrorMessage message={error} />}
      <CafeForm key={formKey} onSubmit={handleSubmit} submitting={submitting} />
    </>
  );
}