import { useState } from "react";
import { DISTRICTS, TYPES } from "../api/cafeApi.js";

const INITIAL = { name: "", district: DISTRICTS[0], type: TYPES[0], rating: "4", price: "2", wifi: true, description: "" };

function validate(v) {
  const errors = {};
  if (v.name.trim().length < 3) errors.name = "Enter a name with at least 3 characters.";
  const r = Number(v.rating);
  if (Number.isNaN(r) || r < 1 || r > 5) errors.rating = "Rating must be between 1 and 5.";
  if (v.description.trim().length < 10) errors.description = "Describe the café in at least 10 characters.";
  return errors;
}

export default function CafeForm({ onSubmit, submitting }) {
  const [values, setValues] = useState(INITIAL);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setValues((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length) return;
    onSubmit({
      ...values,
      name: values.name.trim(),
      description: values.description.trim(),
      rating: Math.round(Number(values.rating) * 10) / 10,
      price: Number(values.price),
    });
  };

  return (
    <form className="form" onSubmit={handleSubmit} noValidate>
      <label>Name
        <input name="name" value={values.name} onChange={handleChange} />
        {errors.name && <small className="error">{errors.name}</small>}
      </label>
      <div className="row">
        <label>District
          <select name="district" value={values.district} onChange={handleChange}>
            {DISTRICTS.map((d) => <option key={d}>{d}</option>)}
          </select>
        </label>
        <label>Type
          <select name="type" value={values.type} onChange={handleChange}>
            {TYPES.map((t) => <option key={t}>{t}</option>)}
          </select>
        </label>
      </div>
      <div className="row">
        <label>Rating (1–5)
          <input name="rating" type="number" step="0.1" min="1" max="5" value={values.rating} onChange={handleChange} />
          {errors.rating && <small className="error">{errors.rating}</small>}
        </label>
        <label>Price level
          <select name="price" value={values.price} onChange={handleChange}>
            <option value="1">₸ (cheap)</option>
            <option value="2">₸₸ (average)</option>
            <option value="3">₸₸₸ (expensive)</option>
          </select>
        </label>
      </div>
      <label className="check">
        <input name="wifi" type="checkbox" checked={values.wifi} onChange={handleChange} /> Has Wi-Fi
      </label>
      <label>Description
        <textarea name="description" rows="4" value={values.description} onChange={handleChange} />
        {errors.description && <small className="error">{errors.description}</small>}
      </label>
      <button className="btn" type="submit" disabled={submitting}>{submitting ? "Saving…" : "Save café"}</button>
    </form>
  );
}