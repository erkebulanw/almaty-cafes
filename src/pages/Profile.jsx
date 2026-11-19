import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="auth">
      <h1>Profile</h1>
      <article className="detail">
        <p><b>Email:</b> {user.email}</p>
        <p><b>UID:</b> {user.uid}</p>
        <button
          className="btn btn--danger"
          onClick={async () => {
            await logout();
            navigate("/login");
          }}
        >
          Logout
        </button>
      </article>
    </div>
  );
}