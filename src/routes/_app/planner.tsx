import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ListChecks, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { PageHeader, AIDisclaimer } from "@/components/PageHeader";
import { AIOutput, callGenerate } from "@/components/AIOutput";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/_app/planner")({
  component: PlannerPage,
  head: () => ({ meta: [{ title: "Task Planner — Workly AI" }] }),
});

type Horizon = "Today" | "This week";

function PlannerPage() {
  const [tasks, setTasks] = useState("");
  const [hours, setHours] = useState("8");
  const [horizon, setHorizon] = useState<Horizon>("Today");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    if (!tasks.trim()) return toast.error("List a few tasks first");
    setLoading(true);
    try {
      const system =
        "You are a productivity coach. Given a list of tasks and available hours, build a realistic prioritized schedule. Use the Eisenhower principle (urgent/important) to triage. Return markdown with: ## Priority overview (bulleted ranking with one-line reason), ## Schedule (a time-blocked plan as a markdown table with columns Time | Task | Focus level), ## Tips (2–3 short bullets). Be concrete with times. Do not invent tasks the user didn't mention.";
      const prompt = `Horizon: ${horizon}\nAvailable hours: ${hours}\nTasks:\n${tasks}`;
      const text = await callGenerate(system, prompt);
      setOutput(text);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to plan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <PageHeader
        icon={ListChecks}
        title="AI Task Planner"
        description="Drop in your to-dos and get a prioritized, time-blocked plan."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4 rounded-xl border border-border bg-card p-5">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Horizon</Label>
              <Select value={horizon} onValueChange={(v) => setHorizon(v as Horizon)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Today">Today</SelectItem>
                  <SelectItem value="This week">This week</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="hours">Available hours</Label>
              <input
                id="hours"
                type="number"
                min="1"
                max="60"
                value={hours}
                onChange={(e) => setHours(e.target.value)}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="tasks">Your tasks</Label>
            <Textarea
              id="tasks"
              rows={10}
              placeholder={"e.g.\n- Finish Q3 report (due Friday)\n- Review 3 PRs\n- Prep for 1:1 with manager\n- Reply to customer escalation"}
              value={tasks}
              onChange={(e) => setTasks(e.target.value)}
            />
          </div>
          <Button onClick={generate} disabled={loading} className="w-full">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Build my plan"}
          </Button>
        </div>

        <AIOutput
          text={output}
          loading={loading}
          onRegenerate={generate}
          emptyHint="Add tasks and click Build my plan."
        />
      </div>

      <AIDisclaimer />
    </div>
  );
}
