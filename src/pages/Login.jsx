import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Login() {
  const { login, loginWithGoogle, error, clearError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from?.pathname || "/profile";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handle = async (action) => {
    setSubmitting(true);
    try {
      await action();
      navigate(redirectTo, { replace: true });
    } catch {
      // ошибка уже сохранена в контексте
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth">
      <h1>Login</h1>
      {error && <p role="alert" className="error">{error}</p>}
      <form
        className="form"
        onSubmit={(e) => {
          e.preventDefault();
          handle(() => login(email, password));
        }}
      >
        <label>Email
          <input
            type="email"
            autoComplete="email"
            inputMode="email"
            value={email}
            required
            onChange={(e) => { clearError(); setEmail(e.target.value); }}
          />
        </label>
        <label>Password
          <input
            type="password"
            autoComplete="current-password"
            value={password}
            required
            onChange={(e) => { clearError(); setPassword(e.target.value); }}
          />
        </label>
        <button className="btn" disabled={submitting}>{submitting ? "Please wait…" : "Log in"}</button>
        <button type="button" className="btn btn--ghost" disabled={submitting} onClick={() => handle(loginWithGoogle)}>
          Continue with Google
        </button>
      </form>
      <p>No account? <Link to="/signup" style={{ textDecoration: "underline" }}>Sign up</Link></p>
    </div>
  );
}