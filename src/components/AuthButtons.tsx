"use client";
import { signInWithGoogle, signOut } from "../lib/auth";
import { useState } from "react";

export default function AuthButtons() {
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    setLoading(true);
    try {
      await signInWithGoogle();
    } catch {
      alert("Sign in failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    setLoading(true);
    try {
      await signOut();
    } catch {
      alert("Sign out failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex gap-2">
      <button
        onClick={handleSignIn}
        className="bg-blue-600 text-white px-4 py-1.5 rounded-lg hover:bg-blue-700 transition"
        disabled={loading}
      >
        Sign in with Google
      </button>
      <button
        onClick={handleSignOut}
        className="bg-gray-600 text-white px-4 py-1.5 rounded-lg hover:bg-gray-700 transition"
        disabled={loading}
      >
        Sign out
      </button>
    </div>
  );
}
