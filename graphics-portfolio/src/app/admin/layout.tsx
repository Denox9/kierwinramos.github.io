import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import Bb from "@/components/Bb";

export const dynamic = "force-dynamic";
export const metadata = { title: "Control Panel", robots: { index: false } };

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  if (!isSupabaseConfigured) {
    return (
      <section className="section">
        <div className="empty">
          <span className="warn-tri" aria-hidden="true">!</span>
          <p className="label">SUPABASE NOT CONFIGURED.<br />SET NEXT_PUBLIC_SUPABASE_URL + NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY (SEE README).</p>
        </div>
      </section>
    );
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const { data: isAdmin } = await supabase.rpc("is_admin");

  return (
    <div className="admin">
      <div className="admin__bar">
        <Link href="/admin" className="label">[CONTROL PANEL] // <Bb text="pamamahala" /></Link>
        <span className="label admin__user">OPERATOR: {user.email}</span>
        <form action="/auth/signout" method="post">
          <button type="submit" className="btn btn--sm">[SIGN OUT]</button>
        </form>
      </div>
      {isAdmin ? children : (
        <section className="section">
          <div className="empty">
            <span className="warn-tri" aria-hidden="true">!</span>
            <p className="label">ACCESS DENIED — <Bb text="babala" bold />.<br />THIS ACCOUNT IS NOT IN public.admins. RUN STEP 06 OF supabase/schema.sql.</p>
          </div>
        </section>
      )}
    </div>
  );
}
