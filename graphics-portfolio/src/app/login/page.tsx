"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import Bb from "@/components/Bb";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    if (!isSupabaseConfigured) { setErr("SUPABASE NOT CONFIGURED — SET ENV VARS FIRST."); return; }
    setBusy(true);
    const { error } = await createClient().auth.signInWithPassword({ email: email.trim(), password });
    setBusy(false);
    if (error) { setErr(error.message.toUpperCase()); return; }
    router.push("/admin");
    router.refresh();
  }

  return (
    <section className="login">
      <form className="panel" onSubmit={onSubmit} noValidate>
        <div className="panel__bar label"><span>ACCESS // <Bb text="patunay" /></span><span>SECURITY PROTOCOL ACTIVE</span></div>
        <div className="panel__body">
          <h1 className="panel__title">CONTROL<br />PANEL</h1>
          <label className="field">
            <span className="label">OPERATOR EMAIL</span>
            <input className="input" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </label>
          <label className="field">
            <span className="label">PASSKEY</span>
            <input className="input" type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} />
          </label>
          {err && <p className="alert" role="alert">! {err}</p>}
          <button className="btn btn--accent btn--block" type="submit" disabled={busy}>
            {busy ? "AUTHENTICATING…" : "ENTER >>>"}
          </button>
        </div>
        <div className="hazard hazard--thin" aria-hidden="true" />
      </form>
    </section>
  );
}
