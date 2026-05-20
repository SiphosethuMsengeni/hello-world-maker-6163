import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { FileText, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { PageHeader, AIDisclaimer } from "@/components/PageHeader";
import { AIOutput, callGenerate } from "@/components/AIOutput";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/_app/summarize")({
  component: SummarizePage,
  head: () => ({ meta: [{ title: "Notes Summarizer — Workly AI" }] }),
});

function SummarizePage() {
  const [notes, setNotes] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    if (notes.trim().length < 20)
      return toast.error("Paste at least a paragraph of notes");
    setLoading(true);
    try {
      const system =
        "You are a precise meeting notes analyst. Read raw notes and return a structured markdown summary with these sections (use ## headings exactly): TL;DR (1–2 sentences), Key Decisions (bullets), Action Items (bulleted list, each starting with the owner if mentioned, the task, and the deadline if mentioned), Risks & Open Questions (bullets). Keep it tight — no fluff.";
      const text = await callGenerate(system, `Notes:\n${notes}`);
      setOutput(text);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to summarize");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <PageHeader
        icon={FileText}
        title="Meeting Notes Summarizer"
        description="Turn raw notes into a clean summary with decisions, actions, and risks."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4 rounded-xl border border-border bg-card p-5">
          <div className="space-y-1.5">
            <Label htmlFor="notes">Paste your meeting notes</Label>
            <Textarea
              id="notes"
              rows={14}
              placeholder="Paste raw notes, transcript, or bullet points here…"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
          <Button onClick={generate} disabled={loading} className="w-full">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Summarize notes"}
          </Button>
        </div>

        <AIOutput
          text={output}
          loading={loading}
          onRegenerate={generate}
          emptyHint="Paste notes and click Summarize."
        />
      </div>

      <AIDisclaimer />
    </div>
  );
}
