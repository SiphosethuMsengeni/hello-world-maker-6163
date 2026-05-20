import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Mail, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { PageHeader, AIDisclaimer } from "@/components/PageHeader";
import { AIOutput, callGenerate } from "@/components/AIOutput";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/_app/email")({
  component: EmailPage,
  head: () => ({ meta: [{ title: "Email Generator — Workly AI" }] }),
});

type Tone = "Formal" | "Friendly" | "Persuasive" | "Apologetic" | "Concise";
const TONES: Tone[] = ["Formal", "Friendly", "Persuasive", "Apologetic", "Concise"];

function EmailPage() {
  const [recipient, setRecipient] = useState("");
  const [subject, setSubject] = useState("");
  const [tone, setTone] = useState<Tone>("Formal");
  const [context, setContext] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    if (!context.trim()) return toast.error("Please describe what the email is about");
    setLoading(true);
    try {
      const system =
        "You are an expert business writer. Produce a single well-formatted email. Return only the email — start with 'Subject:' on the first line, then a blank line, then the body. Use clear paragraphs and a polite sign-off. Do not include commentary.";
      const prompt = [
        `Tone: ${tone}`,
        recipient && `Recipient: ${recipient}`,
        subject && `Suggested subject: ${subject}`,
        `Context / what to say:\n${context}`,
      ]
        .filter(Boolean)
        .join("\n");
      const text = await callGenerate(system, prompt);
      setOutput(text);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to generate");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <PageHeader
        icon={Mail}
        title="Smart Email Generator"
        description="Generate professional emails tailored to your tone and audience."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4 rounded-xl border border-border bg-card p-5">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="recipient">Recipient</Label>
              <Input
                id="recipient"
                placeholder="e.g. Hiring manager"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Tone</Label>
              <Select value={tone} onValueChange={(v) => setTone(v as Tone)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TONES.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="subject">Subject hint (optional)</Label>
            <Input
              id="subject"
              placeholder="e.g. Follow-up on project timeline"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="context">What's the email about?</Label>
            <Textarea
              id="context"
              rows={7}
              placeholder="Outline the key points, requests, or details you want to include…"
              value={context}
              onChange={(e) => setContext(e.target.value)}
            />
          </div>
          <Button onClick={generate} disabled={loading} className="w-full">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Generate email"}
          </Button>
        </div>

        <div>
          <AIOutput
            text={output}
            loading={loading}
            onRegenerate={generate}
            emptyHint="Fill in the brief and click Generate."
          />
        </div>
      </div>

      <AIDisclaimer />
    </div>
  );
}
