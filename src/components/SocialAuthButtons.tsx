import { useState } from "react";

export default function SocialAuthButtons() {
  const [note, setNote] = useState<string | null>(null);

  function handleClick(provider: string) {
    setNote(`${provider} sign-in isn't set up yet.`);
    setTimeout(() => setNote(null), 3000);
  }

  return (
    <div className="social-auth">
      <div className="social-auth-divider">
        <span>or continue with</span>
      </div>
      <div className="social-auth-buttons">
        <button type="button" className="social-auth-btn" onClick={() => handleClick("Google")}>
          Google
        </button>
        <button type="button" className="social-auth-btn social-auth-btn-dark" onClick={() => handleClick("Apple")}>
          Apple
        </button>
      </div>
      {note && <p className="social-auth-note">{note}</p>}
    </div>
  );
}
