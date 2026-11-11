"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import Bb from "@/components/Bb";
import BbCols from "@/components/BbCols";

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
    <section className="auth">
      <div className="auth-art" aria-hidden="true">
        <div className="t-block" />
        <div className="p-block" />
        <div className="s-block stripes" />
        <BbCols lines={["pasok", "tuloy po kayo"]} className="art-cols" />
        <div className="row" style={{ justifyContent: "space-between" }}>
          <span className="label">ACCESS // <Bb text="patunay" /></span>
          <span className="micro">SECURITY PROTOCOL ACTIVE</span>
        </div>
        <div>
          <div className="pager-mini" style={{ marginBottom: "1rem" }}><span className="red">02</span><i /><span>05</span></div>
          <p className="big">Pasok<span className="red">.</span></p>
        </div>
      </div>
      <div className="auth-panel">
        <div>
          <span className="mark" aria-hidden="true" />
          <h1 className="mega" style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)", marginTop: "0.75rem" }}>Control <span className="soft">panel</span></h1>
          <p className="micro" style={{ marginTop: "0.625rem" }}>AUTHORIZED OPERATORS ONLY — PARA SA AWTORISADO LAMANG</p>
        </div>
        <form className="auth-form" onSubmit={onSubmit} noValidate>
          <label className="field">
            <span className="micro">Operator email</span>
            <input className="input" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </label>
          <label className="field">
            <span className="micro">Passkey</span>
            <input className="input" type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} />
          </label>
          {err && <p className="err" role="alert">! {err}</p>}
          <button className="btn red block" type="submit" disabled={busy}>
            <span>{busy ? "Authenticating…" : "Sign in"}</span><span aria-hidden="true">→</span>
          </button>
        </form>
      </div>
    </section>
  );
}
