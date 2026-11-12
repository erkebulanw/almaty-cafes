import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

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
    <div>
      <h1>Login</h1>
      {error && <p role="alert" style={{ color: "red" }}>{error}</p>}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handle(() => login(email, password));
        }}
      >
        <input
          type="email"
          placeholder="Email"
          value={email}
          required
          onChange={(e) => { clearError(); setEmail(e.target.value); }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          required
          onChange={(e) => { clearError(); setPassword(e.target.value); }}
        />
        <button disabled={submitting}>Log in</button>
      </form>
      <button disabled={submitting} onClick={() => handle(loginWithGoogle)}>
        Continue with Google
      </button>
      <p>No account? <Link to="/signup">Sign up</Link></p>
    </div>
  );
}