import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Signup() {
  const { signup, error, clearError } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "", confirm: "" });
  const [validationError, setValidationError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const onChange = (e) => {
    clearError();
    setValidationError("");
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(form.email)) return setValidationError("Введи корректный email");
    if (form.password.length < 6) return setValidationError("Пароль минимум 6 символов");
    if (form.password !== form.confirm) return setValidationError("Пароли не совпадают");

    setSubmitting(true);
    try {
      await signup(form.email, form.password);
      navigate("/profile", { replace: true });
    } catch {
      // ошибка в контексте
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h1>Sign up</h1>
      {(validationError || error) && (
        <p role="alert" style={{ color: "red" }}>{validationError || error}</p>
      )}
      <form onSubmit={onSubmit}>
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={onChange} required />
        <input name="password" type="password" placeholder="Password" value={form.password} onChange={onChange} required />
        <input name="confirm" type="password" placeholder="Confirm password" value={form.confirm} onChange={onChange} required />
        <button disabled={submitting}>Create account</button>
      </form>
      <p>Already have an account? <Link to="/login">Log in</Link></p>
    </div>
  );
}