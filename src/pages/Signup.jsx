import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

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
    <div className="auth">
      <h1>Sign up</h1>
      {(validationError || error) && (
        <p role="alert" className="error">{validationError || error}</p>
      )}
      <form className="form" onSubmit={onSubmit} noValidate>
        <label>Email
          <input name="email" type="email" autoComplete="email" inputMode="email" value={form.email} onChange={onChange} required />
        </label>
        <label>Password
          <input name="password" type="password" autoComplete="new-password" value={form.password} onChange={onChange} required />
        </label>
        <label>Confirm password
          <input name="confirm" type="password" autoComplete="new-password" value={form.confirm} onChange={onChange} required />
        </label>
        <button className="btn" disabled={submitting}>{submitting ? "Please wait…" : "Create account"}</button>
      </form>
      <p>Already have an account? <Link to="/login" style={{ textDecoration: "underline" }}>Log in</Link></p>
    </div>
  );
}