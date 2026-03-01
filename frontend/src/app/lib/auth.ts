import { supabase } from "@/app/lib/supabaseClient";

export async function getSessionUser() {
  const { data } = await supabase.auth.getUser();
  return data.user ?? null;
}

export async function getMyUsername() {
  const user = await getSessionUser();
  if (!user) return null;

  const { data } = await supabase
    .from("profiles")
    .select("username")
    .eq("id", user.id)
    .single();

  return data?.username ?? null;
}