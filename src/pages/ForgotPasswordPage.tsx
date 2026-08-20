import { Link } from "react-router-dom";
import Logo from "../components/Logo";

export default function ForgotPasswordPage() {
  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-card-logo">
          <Logo />
          <span>FITLY</span>
        </div>
        <p className="auth-card-subtitle">Reset your password</p>

        <p className="practice-hint">
          Password reset isn't set up yet — this is a placeholder page. In the meantime,
          head back and log in with your existing password.
        </p>

        <Link to="/login" className="auth-submit auth-submit-link">
          Back to login
        </Link>
      </div>
    </div>
  );
}
