// Assumptions: public.user has columns (id uuid primary key default gen_random_uuid(), first_name text, last_name text, email text unique, phone text, auth_uid uuid references auth.users(id), created_at timestamptz default now(), ...)

import { createClient } from "npm:@supabase/supabase-js@2.31.0";
import users from "./users";

const SUPABASE_URL = "https://blyxxtisqbhihlksqkeb.supabase.co";
const SUPABASE_SERVICE_ROLE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJseXh4dGlzcWJoaWhsa3Nxa2ViIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg5NTg1NzUsImV4cCI6MjA3NDUzNDU3NX0.RF2-QohibEejoF9OwDtk8ntRCHLxeKlnF96zYv13j-Q";

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  Deno.exit(1);
}

const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

Deno.serve(async (req: Request) => {
  try {
    const results: any[] = [];

    for (const u of users) {
      // 1) create auth user
      const { data: user, error: createErr } =
        await supabaseAdmin.auth.admin.createUser({
          email: u.email,
          password: u.password,
          email_confirm: true,
          user_metadata: {
            firstName: u.firstName,
            lastName: u.lastName,
            firebaseId: u.firebaseId,
            phone: u.phone,
          },
        });
      if (createErr) {
        results.push({ email: u.email, error: createErr.message });
        continue;
      }
      const authUid = user.id;

      // 2) insert into public.user
      const { error: insertErr } = await supabaseAdmin
        .from("user") // adjust schema/table name if different (public.user)
        .insert({
          auth_uid: authUid,
          first_name: u.firstName,
          last_name: u.lastName,
          email: u.email,
          phone: u.phone,
        })
        .select();

      if (insertErr) {
        results.push({
          email: u.email,
          authUid,
          insertError: insertErr.message,
        });
        continue;
      }
      results.push({ email: u.email, authUid, status: "ok" });
    }

    return new Response(JSON.stringify({ results }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
