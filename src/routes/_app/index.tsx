import { createFileRoute, Link } from "@tanstack/react-router";
import { Mail, FileText, ListChecks, MessageSquare, ArrowRight, Sparkles } from "lucide-react";
import { PageHeader, AIDisclaimer } from "@/components/PageHeader";

export const Route = createFileRoute("/_app/")({
  component: Dashboard,
  head: () => ({
    meta: [
      { title: "Workly AI — Dashboard" },
      { name: "description", content: "AI-powered productivity suite for modern workplaces." },
    ],
  }),
});

const features = [
  {
    title: "Smart Email Generator",
    description: "Draft professional emails in any tone — formal, friendly, or persuasive.",
    icon: Mail,
    href: "/email",
  },
  {
    title: "Meeting Notes Summarizer",
    description: "Turn long notes into summaries with action items, decisions, and deadlines.",
    icon: FileText,
    href: "/summarize",
  },
  {
    title: "AI Task Planner",
    description: "Generate prioritized daily or weekly schedules from your to-do list.",
    icon: ListChecks,
    href: "/planner",
  },
  {
    title: "AI Chatbot",
    description: "Chat with a workplace assistant for ideas, drafts, and quick answers.",
    icon: MessageSquare,
    href: "/chat",
  },
] as const;

function Dashboard() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <PageHeader
        icon={Sparkles}
        title="Welcome to Workly AI"
        description="Your AI-powered productivity companion. Pick a tool to get started."
      />

      <div className="grid gap-4 sm:grid-cols-2">
        {features.map((f) => (
          <Link
            key={f.href}
            to={f.href}
            className="group relative overflow-hidden rounded-2xl border border-border bg-card p-5 transition-all hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5"
          >
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <f.icon className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">{f.title}</h3>
                  <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{f.description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <AIDisclaimer />
    </div>
  );
}
