import { useState, type FormEvent } from "react";
import { site } from "@/lib/content";

export function DepthGate({ id }: { id: string }) {
  const g = site.gate;
  const [pw, setPw] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "error" | "open">("idle");
  const [msg, setMsg] = useState("");
  const [html, setHtml] = useState("");

  async function submit(e: FormEvent) {
    e.preventDefault();
    const url = import.meta.env["VITE_GATE_API_URL"] as string | undefined;
    if (!url) {
      setState("error");
      setMsg(g.unconfigured);
      return;
    }
    setState("loading");
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, password: pw }),
      });
      if (!res.ok) throw new Error();
      const data = await res.json().catch(() => ({}));
      setHtml(typeof data.html === "string" ? data.html : "");
      setState("open");
    } catch {
      setState("error");
      setMsg(g.error);
    }
  }

  if (state === "open") {
    return <div className="prose-content mt-4 rounded-lg border p-5" dangerouslySetInnerHTML={{ __html: html }} />;
  }

  return (
    <form onSubmit={submit} className="mt-4 rounded-lg border border-dashed bg-muted/50 p-5">
      <div className="flex items-center gap-2 text-sm font-medium">
        <svg aria-hidden width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="4" y="11" width="16" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /></svg>
        {g.heading}
      </div>
      <p className="mt-1 text-sm text-muted-foreground">{g.description}</p>
      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <input
          type="password"
          required
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          placeholder={g.placeholder}
          aria-label={g.placeholder}
          className="h-10 flex-1 rounded-md border bg-background px-3 text-sm outline-none focus:border-primary"
        />
        <button disabled={state === "loading"} className="h-10 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-60">
          {state === "loading" ? g.loading : g.submit}
        </button>
      </div>
      {state === "error" && <p className="mt-2 text-sm text-destructive">{msg}</p>}
    </form>
  );
}
