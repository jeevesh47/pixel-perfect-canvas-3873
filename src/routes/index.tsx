import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";

import { INTENTS, WELCOME_MESSAGE } from "@/lib/chatbot-data";
import { analyze, type Analysis } from "@/lib/nlp";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Student Query Chatbot | AI-Based Student Information Assistant" },
      {
        name: "description",
        content:
          "A rule-based NLP chatbot that answers student questions about courses, fees, admissions, timings, exams, hostel, transport and placements.",
      },
      { property: "og:title", content: "Student Query Chatbot" },
      {
        property: "og:description",
        content:
          "AI-based student information assistant using keyword and pattern matching — runs entirely in the browser.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ChatbotPage,
});

type Message = {
  id: number;
  role: "user" | "bot";
  text: string;
  time: string;
  intent?: string;
  confidence?: number;
};

const SUGGESTIONS = ["Courses", "Fees", "Admission", "Timings", "Contact"];

const PIPELINE = [
  { n: "01", title: "User Question", meta: "input" },
  { n: "02", title: "Text Preprocessing", meta: "lowercase·strip·tokenize" },
  { n: "03", title: "Keyword Matching", meta: "lexicon" },
  { n: "04", title: "Intent Detection", meta: "scoring" },
  { n: "05", title: "Predefined Response", meta: "answer" },
];

function clockTime() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function welcomeMessage(): Message {
  return { id: Date.now(), role: "bot", text: WELCOME_MESSAGE, time: clockTime() };
}

function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>(() => [welcomeMessage()]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [ended, setEnded] = useState(false);
  const [lastAnalysis, setLastAnalysis] = useState<Analysis | null>(null);
  const [activeStep, setActiveStep] = useState(0);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, typing]);

  function send(rawText: string) {
    const text = rawText.trim();
    if (!text || typing || ended) return;

    const result = analyze(text);
    setInput("");
    setLastAnalysis(result);
    setActiveStep(1);
    setMessages((prev) => [
      ...prev,
      { id: Date.now(), role: "user", text, time: clockTime() },
    ]);
    setTyping(true);

    window.setTimeout(() => setActiveStep(2), 120);
    window.setTimeout(() => setActiveStep(3), 260);
    window.setTimeout(() => setActiveStep(4), 380);
    window.setTimeout(() => {
      setActiveStep(5);
      setTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: "bot",
          text: result.response,
          time: clockTime(),
          intent: result.intent?.tag ?? "fallback",
          confidence: result.confidence,
        },
      ]);
    }, 500);
  }

  function clearChat() {
    setMessages([welcomeMessage()]);
    setLastAnalysis(null);
    setActiveStep(0);
    setTyping(false);
  }

  function restart() {
    setEnded(false);
    clearChat();
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-mist font-sans text-ink antialiased">
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="animate-drift absolute -top-24 -left-16 h-[520px] w-[520px] bg-gradient-to-br from-electric/25 to-transparent blur-3xl" />
        <div className="animate-drift absolute top-1/3 -right-24 h-[560px] w-[560px] bg-gradient-to-tl from-ember/15 to-transparent blur-3xl [animation-direction:reverse] [animation-duration:11s]" />
        <div className="animate-drift absolute bottom-0 left-1/3 h-[420px] w-[420px] rotate-12 bg-gradient-to-tr from-electric/15 to-transparent blur-3xl [animation-duration:13s]" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <header className="flex flex-wrap items-center justify-between gap-4 pt-10 pb-6">
          <div className="flex items-center gap-3">
            <div className="grid size-11 place-items-center rounded-xl bg-ink font-mono text-sm font-medium text-mist ring-1 ring-border">
              SQ
            </div>
            <div>
              <h1 className="text-lg leading-none font-semibold tracking-tight text-ink">
                Student Query Chatbot
              </h1>
              <p className="mt-1 font-mono text-[11px] tracking-[0.18em] text-ink-soft uppercase">
                AI-Based Student Information Assistant
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-2 rounded-full bg-glass px-3 py-1.5 font-mono text-[11px] text-ink-soft ring-1 ring-border">
              <span className="animate-blip size-2 rounded-full bg-electric [animation-duration:2s]" />
              local · no backend
            </span>
            <span className="hidden rounded-full bg-glass px-3 py-1.5 font-mono text-[11px] text-ink-soft ring-1 ring-border sm:inline-flex">
              v1.0 · academic project
            </span>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-6 pb-16 lg:grid-cols-12">
          <section className="lg:col-span-7">
            <div className="animate-rise overflow-hidden rounded-3xl bg-glass ring-1 ring-border backdrop-blur-xl">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="grid size-9 place-items-center rounded-lg bg-electric/15 font-mono text-xs font-medium text-electric">
                    AI
                  </div>
                  <div>
                    <p className="text-sm leading-none font-semibold">Assistant</p>
                    <p className="mt-1 font-mono text-[10px] tracking-[0.15em] text-ink-soft uppercase">
                      {ended ? "session ended" : "online · rule-based"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={clearChat}
                    className="rounded-lg bg-secondary px-2.5 py-1.5 text-xs font-medium text-ink-soft ring-1 ring-border transition-transform hover:-translate-y-0.5"
                  >
                    clear chat
                  </button>
                  <button
                    onClick={restart}
                    className="rounded-lg bg-secondary px-2.5 py-1.5 text-xs font-medium text-ink-soft ring-1 ring-border transition-transform hover:-translate-y-0.5"
                  >
                    restart
                  </button>
                  <button
                    onClick={() => {
                      setTyping(false);
                      setEnded(true);
                    }}
                    className="rounded-lg bg-ink px-3 py-1.5 text-xs font-medium text-mist ring-1 ring-ink transition-transform hover:-translate-y-0.5"
                  >
                    exit chat
                  </button>
                </div>
              </div>

              <div className="max-h-[440px] min-h-[320px] space-y-4 overflow-y-auto px-5 py-5">
                {ended ? (
                  <div className="rounded-2xl bg-card px-4 py-6 text-center ring-1 ring-border">
                    <p className="text-sm text-ink">
                      Chat session ended. You can start a new session by clicking Restart Chat.
                    </p>
                    <button
                      onClick={restart}
                      className="mt-4 rounded-lg bg-electric px-4 py-2 text-sm font-medium text-ink ring-1 ring-electric transition-transform hover:-translate-y-0.5"
                    >
                      Restart Chat
                    </button>
                  </div>
                ) : (
                  <>
                    {messages.map((m) =>
                      m.role === "user" ? (
                        <div key={m.id} className="flex justify-end">
                          <div className="max-w-[78%] rounded-2xl rounded-tr-sm bg-ink px-4 py-3 text-mist">
                            <p className="text-sm text-pretty">{m.text}</p>
                            <p className="mt-1 font-mono text-[10px] text-mist/60">{m.time}</p>
                          </div>
                        </div>
                      ) : (
                        <div key={m.id} className="flex justify-start">
                          <div className="max-w-[82%] rounded-2xl rounded-tl-sm bg-card px-4 py-3 ring-1 ring-border">
                            {m.intent && (
                              <div className="mb-2 flex flex-wrap gap-1.5">
                                <span className="rounded-md bg-electric/15 px-2 py-0.5 font-mono text-[10px] text-electric">
                                  intent: {m.intent}
                                </span>
                                {m.confidence ? (
                                  <span className="rounded-md bg-ember/10 px-2 py-0.5 font-mono text-[10px] text-ember">
                                    confidence {m.confidence.toFixed(2)}
                                  </span>
                                ) : null}
                              </div>
                            )}
                            <p className="text-sm text-pretty text-ink">{m.text}</p>
                            <p className="mt-1 font-mono text-[10px] text-ink-soft">{m.time}</p>
                          </div>
                        </div>
                      ),
                    )}

                    {typing && (
                      <div className="flex justify-start">
                        <div
                          className="flex items-center gap-1.5 rounded-2xl rounded-tl-sm bg-card px-4 py-3.5 ring-1 ring-border"
                          aria-label="Bot is typing"
                        >
                          <span className="animate-blip size-1.5 rounded-full bg-ink-soft" />
                          <span className="animate-blip size-1.5 rounded-full bg-ink-soft [animation-delay:0.2s]" />
                          <span className="animate-blip size-1.5 rounded-full bg-ink-soft [animation-delay:0.4s]" />
                          <span className="ml-1 font-mono text-[10px] text-ink-soft">
                            Bot is typing...
                          </span>
                        </div>
                      </div>
                    )}
                  </>
                )}
                <div ref={endRef} />
              </div>

              <div className="flex flex-wrap gap-2 border-t border-border px-5 py-3">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    disabled={ended}
                    className="rounded-full bg-secondary px-3 py-1.5 text-xs font-medium text-ink ring-1 ring-border transition-transform hover:-translate-y-0.5 disabled:opacity-40"
                  >
                    {s}
                  </button>
                ))}
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  send(input);
                }}
                className="flex items-center gap-2 border-t border-border px-4 py-4"
              >
                <input
                  type="text"
                  value={input}
                  disabled={ended}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about the college..."
                  aria-label="Your question"
                  className="min-w-0 flex-1 rounded-lg bg-muted px-3.5 py-2.5 text-sm text-ink ring-1 ring-border outline-none placeholder:text-ink-soft/60 focus:ring-2 focus:ring-electric/40 disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={ended}
                  className="rounded-lg bg-electric px-4 py-2.5 text-sm font-medium text-ink ring-1 ring-electric transition-transform hover:-translate-y-0.5 disabled:opacity-40"
                >
                  Send
                </button>
              </form>
            </div>
          </section>

          <aside className="space-y-6 lg:col-span-5">
            <div className="animate-rise rounded-3xl bg-glass p-5 ring-1 ring-border backdrop-blur-xl [animation-delay:0.1s]">
              <div className="flex items-baseline justify-between">
                <h2 className="text-base leading-none font-semibold text-ink">How It Works</h2>
                <span className="font-mono text-[10px] tracking-[0.15em] text-ink-soft uppercase">
                  NLP pipeline
                </span>
              </div>
              <div className="mt-4 space-y-1.5">
                {PIPELINE.map((step, i) => {
                  const active = activeStep === i + 1;
                  return (
                    <div
                      key={step.n}
                      className={
                        active
                          ? "relative flex items-center gap-3 overflow-hidden rounded-xl bg-electric/12 px-3.5 py-2.5 ring-1 ring-electric/40"
                          : "flex items-center gap-3 rounded-xl bg-muted px-3.5 py-2.5 ring-1 ring-border"
                      }
                    >
                      {active && (
                        <span className="animate-sheen absolute inset-y-0 -left-1/3 w-1/3 bg-gradient-to-r from-transparent via-white/40 to-transparent" />
                      )}
                      <span
                        className={
                          active
                            ? "grid size-6 shrink-0 place-items-center rounded-md bg-electric font-mono text-[11px] font-medium text-ink"
                            : "grid size-6 shrink-0 place-items-center rounded-md bg-mist font-mono text-[11px] text-ink-soft"
                        }
                      >
                        {step.n}
                      </span>
                      <span className="relative text-sm font-medium text-ink">{step.title}</span>
                      <span
                        className={
                          active
                            ? "relative ml-auto font-mono text-[10px] text-electric"
                            : "ml-auto font-mono text-[10px] text-ink-soft"
                        }
                      >
                        {active ? "active" : step.meta}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="mt-4 rounded-xl bg-muted p-3.5 ring-1 ring-border">
                <p className="font-mono text-[10px] tracking-[0.15em] text-ink-soft uppercase">
                  Last analysis
                </p>
                {lastAnalysis ? (
                  <div className="mt-2 space-y-2 font-mono text-[11px] text-ink">
                    <p className="break-words">
                      <span className="text-ink-soft">cleaned: </span>
                      {lastAnalysis.cleaned || "—"}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {lastAnalysis.keywords.length ? (
                        lastAnalysis.keywords.map((k) => (
                          <span
                            key={k}
                            className="rounded bg-mist px-1.5 py-0.5 text-[10px] text-ink-soft"
                          >
                            {k}
                          </span>
                        ))
                      ) : (
                        <span className="text-[10px] text-ink-soft">no keywords</span>
                      )}
                    </div>
                    <p>
                      <span className="text-ink-soft">matched: </span>
                      {lastAnalysis.matchedKeywords.join(", ") || "none"}
                    </p>
                    <p>
                      <span className="text-ink-soft">intent: </span>
                      {lastAnalysis.intent?.tag ?? "fallback"}
                    </p>
                  </div>
                ) : (
                  <p className="mt-2 font-mono text-[11px] text-ink-soft">
                    Ask a question to see preprocessing, keywords and the detected intent.
                  </p>
                )}
              </div>
            </div>

            <div className="animate-rise rounded-3xl bg-ink p-5 text-mist ring-1 ring-border [animation-delay:0.18s]">
              <h2 className="text-base leading-none font-semibold text-mist">
                Project Information
              </h2>
              <p className="mt-2 text-sm text-pretty text-mist/70">
                Answering common student queries using basic NLP techniques. Every step runs in the
                browser — no external AI service or backend.
              </p>
              <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3">
                <div>
                  <dt className="font-mono text-[10px] tracking-[0.15em] text-mist/40 uppercase">
                    Project Title
                  </dt>
                  <dd className="mt-1 text-sm font-medium">AI-Based Student Query Chatbot</dd>
                </div>
                <div>
                  <dt className="font-mono text-[10px] tracking-[0.15em] text-mist/40 uppercase">
                    Domain
                  </dt>
                  <dd className="mt-1 text-sm font-medium">
                    Artificial Intelligence / Natural Language Processing
                  </dd>
                </div>
                <div>
                  <dt className="font-mono text-[10px] tracking-[0.15em] text-mist/40 uppercase">
                    Technologies
                  </dt>
                  <dd className="mt-1 text-sm font-medium">
                    React · TypeScript · Tailwind CSS · Pattern Matching
                  </dd>
                </div>
                <div>
                  <dt className="font-mono text-[10px] tracking-[0.15em] text-mist/40 uppercase">
                    Purpose
                  </dt>
                  <dd className="mt-1 text-sm font-medium">
                    Answering common student queries locally
                  </dd>
                </div>
              </dl>
              <div className="mt-4 flex flex-wrap gap-1.5">
                <span className="rounded-md bg-white/10 px-2 py-1 font-mono text-[10px] text-mist/70">
                  dictionary: {INTENTS.length} intents
                </span>
                <span className="rounded-md bg-white/10 px-2 py-1 font-mono text-[10px] text-mist/70">
                  sample college data
                </span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
