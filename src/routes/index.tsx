import { createFileRoute } from "@tanstack/react-router";
import { TaskApp } from "@/components/TaskApp";

export const Route = createFileRoute("/")({
  component: TaskApp,
  head: () => ({
    meta: [
      { title: "Still — Calm task management" },
      {
        name: "description",
        content: "A minimal, calming task manager with categories and dark mode.",
      },
    ],
  }),
});
