import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, secret_key } = await req.json();
    
    // Simple secret key check for initial setup
    if (secret_key !== "NAVEYE_ADMIN_SETUP_2050") {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

    if (action === "create_admin") {
      // Create the admin user
      const { data: userData, error: createError } = await supabaseAdmin.auth.admin.createUser({
        email: "ami_admin@naveye.app",
        password: "#Ami_Admin_2050_TST",
        email_confirm: true,
      });

      if (createError) {
        // User might already exist
        if (createError.message.includes("already been registered")) {
          // Get the existing user
          const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers();
          const existingUser = existingUsers?.users?.find(u => u.email === "ami_admin@naveye.app");
          
          if (existingUser) {
            // Assign admin role if not already assigned
            const { error: roleError } = await supabaseAdmin
              .from("user_roles")
              .upsert({ user_id: existingUser.id, role: "admin" }, { onConflict: "user_id,role" });

            if (roleError) {
              return new Response(
                JSON.stringify({ error: roleError.message }),
                { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
              );
            }

            return new Response(
              JSON.stringify({ success: true, message: "Admin role assigned to existing user" }),
              { headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
          }
        }
        
        return new Response(
          JSON.stringify({ error: createError.message }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Assign admin role to the new user
      const { error: roleError } = await supabaseAdmin
        .from("user_roles")
        .insert({ user_id: userData.user.id, role: "admin" });

      if (roleError) {
        return new Response(
          JSON.stringify({ error: roleError.message }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      return new Response(
        JSON.stringify({ success: true, message: "Admin user created successfully", userId: userData.user.id }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ error: "Invalid action" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
