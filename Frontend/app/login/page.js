"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { apiRequest, saveAuth } from "../../lib/api";

const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!googleClientId) return;

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => {
      window.google.accounts.id.initialize({
        client_id: googleClientId,
        callback: handleGoogleLogin
      });
      window.google.accounts.id.renderButton(document.getElementById("google-login"), {
        theme: "outline",
        size: "large",
        width: 260
      });
    };
    document.body.appendChild(script);

    return () => script.remove();
  }, []);

  function updateField(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  async function submitAuth(event) {
    event.preventDefault();
    setError("");

    if (!form.email.trim() || !form.password) {
      setError("Email and password are required.");
      return;
    }

    setSaving(true);
    try {
      const auth = await apiRequest(`/api/auth/${mode}`, {
        method: "POST",
        body: JSON.stringify(form)
      });
      saveAuth(auth);
      router.push("/");
    } catch (err) {
      setError(err.message);
      setSaving(false);
    }
  }

  async function handleGoogleLogin(response) {
    setError("");
    try {
      const auth = await apiRequest("/api/auth/google", {
        method: "POST",
        body: JSON.stringify({ credential: response.credential })
      });
      saveAuth(auth);
      router.push("/");
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <main className="shell">
      <header className="topbar">
        <div className="brand">
          <h1>{mode === "login" ? "Login" : "Create Account"}</h1>
          <p>Login is required to post or delete service requests.</p>
        </div>
        <Link className="button secondary" href="/">
          Back
        </Link>
      </header>

      <form className="form auth-form" onSubmit={submitAuth}>
        {error && <div className="error">{error}</div>}

        {mode === "register" && (
          <div className="field">
            <label htmlFor="name">Name</label>
            <input id="name" className="input" name="name" value={form.name} onChange={updateField} />
          </div>
        )}

        <div className="field">
          <label htmlFor="email">Email</label>
          <input id="email" className="input" name="email" type="email" value={form.email} onChange={updateField} required />
        </div>

        <div className="field">
          <label htmlFor="password">Password</label>
          <input id="password" className="input" name="password" type="password" value={form.password} onChange={updateField} required />
        </div>

        <div className="actions">
          <button className="button" disabled={saving} type="submit">
            {saving ? "Please wait..." : mode === "login" ? "Login" : "Register"}
          </button>
          <button className="button secondary" onClick={() => setMode(mode === "login" ? "register" : "login")} type="button">
            {mode === "login" ? "Need an account?" : "Already registered?"}
          </button>
        </div>

        {googleClientId && <div id="google-login" />}
      </form>
    </main>
  );
}
