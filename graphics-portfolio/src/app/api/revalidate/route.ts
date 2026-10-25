import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

// Called after admin saves so public pages update instantly.
export async function POST() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { data: ok } = await supabase.rpc("is_admin");
  if (!ok) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  revalidatePath("/", "layout");
  return NextResponse.json({ revalidated: true });
}
