"use client";

import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Message = { role: "user" | "assistant"; content: string };

const STARTER_PROMPTS = [
  "What's going on with the markets today?",
  "Why did Tesla fall today?",
  "Analyse my watchlist",
  "Explain P/E ratio simply",
];

export default function ResearchPanel() {
  const [displayName, setDisplayName] = useState("Investor");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [listening, setListening] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      const name = data.user?.user_metadata?.full_name || data.user?.email?.split("@")[0];
      if (name) setDisplayName(name);
    });
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  async function send(text: string) {
    if (!text.trim() || sending) return;
    const next: Message[] = [...messages, { role: "user", content: text }];
    setMessages(next);
    setInput("");
    setSending(true);

    try {
      const res = await fetch("/api/research", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });
      const json = await res.json();
      setMessages([
        ...next,
        { role: "assistant", content: json.reply ?? json.error ?? "Something went wrong." },
      ]);
    } catch {
      setMessages([...next, { role: "assistant", content: "Network error — try again." }]);
    } finally {
      setSending(false);
    }
  }

  function handleMic() {
    // Optional: browser speech-to-text where supported. No-ops silently
    // elsewhere rather than throwing, since this is a nice-to-have.
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.onresult = (e: any) => setInput(e.results[0][0].transcript);
    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);
    recognition.start();
  }

  return (
    <aside className="glow-panel flex flex-col h-[520px] lg:h-[calc(100vh-6rem)] lg:sticky lg:top-20 p-4">
      <div className="mb-4">
        <h2 className="text-sm font-semibold text-cyber-text">Research</h2>
        <p className="text-xs text-cyber-muted mt-1">
          Hi {displayName}, ask any financial question
        </p>
      </div>

      {messages.length === 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {STARTER_PROMPTS.map((prompt) => (
            <button
              key={prompt}
              onClick={() => send(prompt)}
              className="text-xs px-3 py-1.5 rounded-full border border-cyber-border
                         bg-cyber-panel/60 text-cyber-text/80 hover:text-cyber-text
                         hover:border-cyber-borderStrong hover:shadow-glow-sm transition-all"
            >
              {prompt}
            </button>
          ))}
        </div>
      )}

      <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-3 mb-3 pr-1">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`text-sm px-3 py-2 rounded-xl max-w-[90%] ${
              m.role === "user"
                ? "ml-auto bg-cyber-accent/20 border border-cyber-accent/30 text-cyber-text"
                : "bg-cyber-panelHover border border-cyber-border text-cyber-text/90"
            }`}
          >
            {m.content}
          </div>
        ))}
        {sending && (
          <div className="text-xs text-cyber-muted px-3">Thinking...</div>
        )}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
        className="flex items-center gap-2 rounded-full border border-cyber-border
                   bg-cyber-panel/70 px-2 py-1.5 shadow-glow-sm focus-within:shadow-glow-md
                   focus-within:border-cyber-borderStrong transition-all"
      >
        <button
          type="button"
          onClick={handleMic}
          className={`w-8 h-8 flex-shrink-0 rounded-full flex items-center justify-center
                      transition-colors ${
                        listening
                          ? "text-cyber-neonGreen"
                          : "text-cyber-muted hover:text-cyber-text"
                      }`}
          title="Voice input"
          aria-label="Voice input"
        >
          🎙
        </button>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about a stock, sector, or your portfolio..."
          className="flex-1 bg-transparent text-sm placeholder:text-cyber-muted focus:outline-none"
        />
        <button
          type="submit"
          disabled={sending || !input.trim()}
          className="w-8 h-8 flex-shrink-0 rounded-full bg-cyber-accent/80 hover:bg-cyber-accent
                     disabled:opacity-40 flex items-center justify-center text-white text-sm
                     shadow-glow-sm transition-all"
          aria-label="Send"
        >
          ↑
        </button>
      </form>
    </aside>
  );
}
