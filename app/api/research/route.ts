import { NextRequest, NextResponse } from "next/server";
import Groq from 'groq-sdk';

type ChatMessage = { role: "user" | "assistant"; content: string };

export async function POST(req: NextRequest) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Missing GROQ_API_KEY in .env.local. See README for setup." },
      { status: 500 }
    );
  }

  const { messages, watchlist } = (await req.json()) as {
    messages: ChatMessage[];
    watchlist?: string[];
  };

  const systemPrompt = [
    "You are the Research assistant embedded in MarketCap, a dark-themed stock tracking app.",
    "Answer financial questions concisely, in plain prose (2-4 sentences unless asked for more).",
    "If the user asks about general market concepts, historical trends, or strategy, answer comprehensively.",
    "If asked about today's live stock prices or real-time index values, explain briefly that you do not have a live data connection, but offer to explain how those indicators work or discuss the history/structure of those assets.",
    watchlist?.length ? `The user's current watchlist: ${watchlist.join(", ")}.` : "",
  ]
    .filter(Boolean)
    .join(" ");

  try {
    // Initialize the official Groq client
    const groq = new Groq({ apiKey });

    // Format messages for Groq's chat interface (System prompt + History + Latest user query)
    const formattedMessages = [
      { role: "system" as const, content: systemPrompt },
      ...messages.map((m) => ({
        role: m.role === "user" ? ("user" as const) : ("assistant" as const),
        content: m.content,
      })),
    ];

    // Call the Groq SDK
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile", // Offers excellent financial reasoning on Groq's free tier
      messages: formattedMessages,
      max_tokens: 500,
      temperature: 0.2, // Keeps interpretations objective and stable
    });

    const text = completion.choices[0]?.message?.content || "";

    return NextResponse.json({ reply: text });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}