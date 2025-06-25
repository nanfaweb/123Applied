"use client";
import { supabase } from "../lib/supabaseClient";

export async function signInWithGoogle() {
  console.log("Google sign-in started");
  const redirectUrl = typeof window !== "undefined" ? `${window.location.origin}/signup` : undefined;
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: redirectUrl ? { redirectTo: redirectUrl } : undefined,
  });
  if (error) {
    console.log("Google sign-in error:", error.message);
    throw error;
  }
  console.log("Google sign-in redirect initiated");
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

/**
 * Calls the sync-user Edge Function to sync the authenticated user profile.
 * @param user Supabase Auth user object
 * @param fullName Optional full name (for manual signup)
 * @param role Optional role (defaults to 'Student')
 */
export async function syncUserProfile(
  user: { id: string; email: string | null; user_metadata?: Record<string, unknown> },
  fullName?: string,
  role: "Student" | "Professional" = "Student"
) {
  if (!user || !user.id || !user.email) return;
  // Get the current session to retrieve the JWT
  const { data: sessionData } = await supabase.auth.getSession();
  const accessToken = sessionData.session?.access_token;
  if (!accessToken) throw new Error("No access token found");

  // Call the Edge Function
  const res = await fetch("/functions/v1/sync-user", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: fullName || user.user_metadata?.full_name || user.user_metadata?.name || "",
      role,
      email: user.email,
      user_id: user.id,
    }),
  });
  if (!res.ok) {
    const errorText = await res.text();
    let errorMsg = "Failed to sync user profile";
    try {
      const errorJson = JSON.parse(errorText);
      errorMsg = errorJson.error || errorMsg;
    } catch {
      // Not JSON, log raw response
      console.error("syncUserProfile error (raw):", errorText);
      errorMsg = errorText;
    }
    throw new Error(errorMsg);
  }
  // Defensive: only parse as JSON if content-type is JSON
  const contentType = res.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return await res.json();
  } else {
    const text = await res.text();
    console.error("syncUserProfile non-JSON response:", text);
    throw new Error("Unexpected response from sync-user function");
  }
}
