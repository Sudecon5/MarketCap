"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function AuthStatus() {
  const [email, setEmail] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setEmail(data.user?.email ?? null));
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setEmail(session?.user?.email ?? null);
    });
    return () => sub.subscription.unsubscribe();
  }, [supabase]);

  if (email === null) {
    return (
      <a href="/login" className="hover:text-cyber-text transition-colors">
        Sign in
      </a>
    );
  }

  return (
    <button
      onClick={async () => {
        await supabase.auth.signOut();
        window.location.href = "/";
      }}
      className="hover:text-cyber-text transition-colors"
    >
      Sign out ({email})
    </button>
  );
}
