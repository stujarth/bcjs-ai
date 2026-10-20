import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";
import { askTools, runAskTool, scriptedAnswer } from "@/lib/ask-tools";
import { TODAY } from "@/lib/mock/data";
import type { RoleKey } from "@/lib/mock/types";

export const runtime = "nodejs";
export const maxDuration = 60;

const ROLES: RoleKey[] = ["director", "qs", "pm", "site", "finance", "subcontractor"];
const MAX_TOOL_ROUNDS = 6;

interface Body {
  role?: string;
  messages?: { role: "user" | "assistant"; text: string }[];
}

const SYSTEM = `You are "Ask BCJS", the assistant inside the Operations Control System of Bespoke Construction & Joinery Solutions, a heritage, joinery and residential contractor in Pontypool, South Wales.
Answer questions about the business only from the tools provided, which read the live project record. Never invent figures; if a tool doesn't hold it, say so.
Keep answers short and scannable for busy directors, QSs and site managers: lead with the answer, then a few bullet points. Use £ and UK English.
You are read-only: you can suggest actions (approve, chase, draft) but must say a person needs to confirm them.
If a tool says the user's role is not permitted, explain that politely.
Today is ${TODAY}.`;

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as Body;
  const role: RoleKey = ROLES.includes(body.role as RoleKey) ? (body.role as RoleKey) : "director";
  const history = (body.messages ?? []).filter((m) => m && typeof m.text === "string" && m.text.trim()).slice(-12);
  const last = history.at(-1);
  if (!last || last.role !== "user") return NextResponse.json({ answer: "Ask me a question about the business.", live: false });

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ ...scriptedAnswer(last.text, role), live: false });
  }

  const client = new Anthropic();
  const messages: Anthropic.Beta.BetaMessageParam[] = history.map((m) => ({ role: m.role, content: m.text.slice(0, 4000) }));
  const toolLog: string[] = [];

  try {
    for (let round = 0; round < MAX_TOOL_ROUNDS; round++) {
      // Server-side fallback reruns a refused request on another model inside the same call.
      const response = await client.beta.messages.create({
        model: "claude-opus-5-5",
        betas: ["server-side-fallback-2026-07-01"],
        fallbacks: "default",
        max_tokens: 4000,
        system: `${SYSTEM}\nThe person asking has the ${role} role.`,
        tools: askTools,
        output_config: { effort: "low" },
        messages,
      });

      if (response.stop_reason === "refusal") {
        return NextResponse.json({ answer: "I can't help with that one.", tools: toolLog, live: true });
      }

      const toolUses = response.content.filter((b): b is Anthropic.Beta.BetaToolUseBlock => b.type === "tool_use");
      if (response.stop_reason !== "tool_use" || toolUses.length === 0) {
        const answer = response.content
          .filter((b): b is Anthropic.Beta.BetaTextBlock => b.type === "text")
          .map((b) => b.text)
          .join("\n")
          .trim();
        return NextResponse.json({ answer: answer || "No answer returned.", tools: toolLog, live: true });
      }

      messages.push({ role: "assistant", content: response.content });
      messages.push({
        role: "user",
        content: toolUses.map((t) => {
          const input = (t.input ?? {}) as Record<string, unknown>;
          toolLog.push(`${t.name}(${Object.entries(input).map(([k, v]) => `${k}: ${String(v)}`).join(", ")})`);
          return { type: "tool_result" as const, tool_use_id: t.id, content: runAskTool(t.name, input, role) };
        }),
      });
    }
    return NextResponse.json({ answer: "That needed more look-ups than this demo allows. Try a narrower question.", tools: toolLog, live: true });
  } catch (err) {
    if (err instanceof Anthropic.RateLimitError) {
      return NextResponse.json({ answer: "The assistant is busy, try again in a moment.", tools: toolLog, live: true }, { status: 429 });
    }
    if (err instanceof Anthropic.APIError) {
      console.error("Claude API error", err.status, err.message);
      return NextResponse.json({ ...scriptedAnswer(last.text, role), live: false });
    }
    throw err;
  }
}
