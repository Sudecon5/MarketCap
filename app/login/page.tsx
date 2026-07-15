"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    const supabase = createClient();

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    });

    setStatus(error ? "error" : "sent");
  }

  return (
    <div className="max-w-sm mx-auto mt-16">
      <h1 className="text-xl font-semibold mb-2">Sign in</h1>
      <p className="text-muted text-sm mb-6">
        We'll email you a magic link — no password needed.
      </p>

      {status === "sent" ? (
        <p className="text-sm text-gain">Check your inbox for a sign-in link.</p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full bg-panel border border-line rounded-lg px-4 py-3 text-sm
                       placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent"
          />
          <button
            type="submit"
            disabled={status === "sending"}
            className="w-full bg-accent text-white rounded-lg px-4 py-3 text-sm font-medium
                       hover:bg-accent/90 transition-colors disabled:opacity-50"
          >
            {status === "sending" ? "Sending..." : "Send magic link"}
          </button>
          {status === "error" && (
            <p className="text-sm text-loss">Something went wrong. Try again.</p>
          )}
        </form>
      )}
    </div>
  );
}
