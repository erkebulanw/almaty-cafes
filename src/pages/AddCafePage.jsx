import { useState } from "react";
import { Link } from "react-router-dom";
import { useAddCafe } from "../hooks/useCafes.js";
import CafeForm from "../components/CafeForm.jsx";
import { ErrorMessage } from "../components/Status.jsx";

export default function AddCafePage() {
  const addMutation = useAddCafe();
  const [created, setCreated] = useState(null);
  const [formKey, setFormKey] = useState(0);

  const handleSubmit = async (data) => {
    setCreated(null);
    try {
      const cafe = await addMutation.mutateAsync(data);
      setCreated(cafe);
      setFormKey((k) => k + 1); // новый key -> форма очищается
    } catch {
      // ошибка отображается ниже через addMutation.error
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
      {addMutation.isError && <ErrorMessage message={addMutation.error.message} />}
      <CafeForm key={formKey} onSubmit={handleSubmit} submitting={addMutation.isPending} />
    </>
  );
}