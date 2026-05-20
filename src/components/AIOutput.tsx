import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Copy, Loader2, RefreshCw, Sparkles } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { cn } from "@/lib/utils";

export function AIOutput({
  text,
  loading,
  onRegenerate,
  emptyHint,
}: {
  text: string;
  loading?: boolean;
  onRegenerate?: () => void;
  emptyHint?: string;
}) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
        <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          AI Output
        </div>
        <div className="flex items-center gap-1">
          {onRegenerate && (
            <Button
              size="sm"
              variant="ghost"
              onClick={onRegenerate}
              disabled={loading || !text}
              className="h-7 gap-1.5 text-xs"
            >
              <RefreshCw className="h-3 w-3" />
              Regenerate
            </Button>
          )}
          <Button
            size="sm"
            variant="ghost"
            onClick={copy}
            disabled={!text}
            className="h-7 gap-1.5 text-xs"
          >
            <Copy className="h-3 w-3" />
            {copied ? "Copied" : "Copy"}
          </Button>
        </div>
      </div>
      <div className="min-h-[220px] px-5 py-4">
        {loading && !text && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Generating…
          </div>
        )}
        {!loading && !text && (
          <p className="text-sm text-muted-foreground">{emptyHint ?? "Your AI response will appear here."}</p>
        )}
        {text && (
          <div className={cn("prose prose-sm max-w-none dark:prose-invert", "prose-headings:font-semibold prose-p:leading-relaxed")}>
            <ReactMarkdown>{text}</ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
}

export async function callGenerate(system: string, prompt: string): Promise<string> {
  const res = await fetch("/api/generate", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ system, prompt }),
  });
  if (!res.ok) {
    const msg = await res.text();
    if (res.status === 429) throw new Error("Rate limit reached. Please try again shortly.");
    if (res.status === 402) throw new Error("AI credits exhausted. Add credits in workspace settings.");
    throw new Error(msg || "AI request failed");
  }
  const data = (await res.json()) as { text: string };
  return data.text;
}
