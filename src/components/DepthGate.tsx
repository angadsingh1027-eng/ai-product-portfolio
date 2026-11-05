import { useEffect, useRef, useState, useSyncExternalStore, type FormEvent } from "react";
import { marked } from "marked";
import { site } from "@/lib/content";

type State = "idle" | "loading" | "error" | "open";

// Gate client for POST {VITE_GATE_API_URL}/verify-password with { slug, password } -> { content }.
// One correct password unlocks every gate on the site for this tab session. The password is
// kept in memory only; unlocked text is cached in sessionStorage (optional, wrapped in try/catch).
let sharedPassword: string | null = null;
const listeners = new Set<() => void>();
const setSharedPassword = (value: string | null) => {
  sharedPassword = value;
  listeners.forEach((l) => l());
};
const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => {
    listeners.delete(l);
  };
};
const getSnapshot = () => sharedPassword;
const getServerSnapshot = () => null;

const cacheKey = (id: string) => `gate:${id}`;
const readCache = (id: string): string | null => {
  try {
    return sessionStorage.getItem(cacheKey(id));
  } catch {
    return null;
  }
};
const writeCache = (id: string, content: string) => {
  try {
    sessionStorage.setItem(cacheKey(id), content);
  } catch {
    /* storage unavailable: the gate still works, it just asks again after a refresh */
  }
};

async function verify(id: string, password: string): Promise<string> {
  const base = import.meta.env["VITE_GATE_API_URL"] as string | undefined;
  if (!base) throw new Error("unconfigured");
  const res = await fetch(`${base.replace(/\/$/, "")}/verify-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ slug: id, password }),
  });
  if (res.status === 429) throw new Error("rate");
  if (!res.ok) throw new Error("denied");
  const data = (await res.json().catch(() => ({}))) as { content?: unknown };
  if (typeof data.content !== "string") throw new Error("denied");
  return data.content;
}

export function DepthGate({ id }: { id: string }) {
  const g = site.gate;
  const sharedPw = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [pw, setPw] = useState("");
  const [state, setState] = useState<State>("idle");
  const [msg, setMsg] = useState("");
  const [content, setContent] = useState("");
  const autoTried = useRef(false);

  async function unlock(candidate: string, quiet: boolean) {
    setState("loading");
    try {
      const text = await verify(id, candidate);
      writeCache(id, text);
      setContent(text);
      setState("open");
      setSharedPassword(candidate);
    } catch (e) {
      if (quiet) {
        setState("idle");
        return;
      }
      const code = e instanceof Error ? e.message : "denied";
      setMsg(code === "unconfigured" ? g.unconfigured : code === "rate" ? g.rateLimited : g.error);
      setState("error");
    }
  }

  // Restore from this session's cache, or reuse a password already accepted elsewhere on the site.
  useEffect(() => {
    if (autoTried.current) return;
    const cached = readCache(id);
    if (cached !== null) {
      autoTried.current = true;
      setContent(cached);
      setState("open");
      return;
    }
    if (sharedPw) {
      autoTried.current = true;
      void unlock(sharedPw, true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, sharedPw]);

  function submit(e: FormEvent) {
    e.preventDefault();
    void unlock(pw, false);
  }

  // No gate API configured yet: show nothing rather than a lock that cannot open.
  if (!import.meta.env["VITE_GATE_API_URL"]) return null;

  if (state === "open") {
    // The text comes from our own gate backend, not from visitors.
    return (
      <div
        className="prose-content mt-4 rounded-lg border p-5"
        dangerouslySetInnerHTML={{ __html: marked.parse(content, { async: false }) as string }}
      />
    );
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
          autoComplete="off"
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
