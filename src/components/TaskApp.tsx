import { useEffect, useMemo, useState } from "react";
import { Check, Plus, Moon, Sun, Trash2, ListTodo } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTheme } from "@/hooks/use-theme";
import { cn } from "@/lib/utils";

type Category = "Personal" | "Work" | "Errands" | "Ideas";
const CATEGORIES: Category[] = ["Personal", "Work", "Errands", "Ideas"];

const CATEGORY_STYLES: Record<Category, string> = {
  Personal: "bg-chart-1/15 text-chart-1",
  Work: "bg-chart-3/15 text-chart-3",
  Errands: "bg-chart-2/15 text-chart-2",
  Ideas: "bg-chart-4/15 text-chart-4",
};

interface Task {
  id: string;
  title: string;
  category: Category;
  done: boolean;
  createdAt: number;
}

const STORAGE_KEY = "tasks.v1";

export function TaskApp() {
  const { theme, toggle } = useTheme();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<Category>("Personal");
  const [filter, setFilter] = useState<"all" | Category>("all");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setTasks(JSON.parse(raw));
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks, hydrated]);

  const filtered = useMemo(
    () => (filter === "all" ? tasks : tasks.filter((t) => t.category === filter)),
    [tasks, filter],
  );

  const remaining = tasks.filter((t) => !t.done).length;

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    const t = title.trim();
    if (!t) return;
    setTasks((prev) => [
      { id: crypto.randomUUID(), title: t, category, done: false, createdAt: Date.now() },
      ...prev,
    ]);
    setTitle("");
  };

  const toggleTask = (id: string) =>
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));

  const removeTask = (id: string) => setTasks((prev) => prev.filter((t) => t.id !== id));

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: tasks.length };
    for (const cat of CATEGORIES) c[cat] = tasks.filter((t) => t.category === cat).length;
    return c;
  }, [tasks]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-2xl px-5 py-10 sm:py-16">
        <header className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <ListTodo className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">Still</h1>
              <p className="text-sm text-muted-foreground">
                {remaining === 0 ? "All clear" : `${remaining} task${remaining === 1 ? "" : "s"} left`}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggle}
            aria-label="Toggle theme"
            className="rounded-full"
          >
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
        </header>

        <form
          onSubmit={addTask}
          className="mb-6 rounded-2xl border border-border bg-card p-3 shadow-sm"
        >
          <div className="flex flex-col gap-2 sm:flex-row">
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Add a new task…"
              className="h-11 border-none bg-transparent text-base shadow-none focus-visible:ring-0"
            />
            <div className="flex gap-2">
              <Select value={category} onValueChange={(v) => setCategory(v as Category)}>
                <SelectTrigger className="h-11 w-[140px] rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button type="submit" className="h-11 rounded-xl px-4">
                <Plus className="h-4 w-4" />
                Add
              </Button>
            </div>
          </div>
        </form>

        <div className="mb-5 flex flex-wrap gap-2">
          <FilterChip active={filter === "all"} onClick={() => setFilter("all")} label="All" count={counts.all} />
          {CATEGORIES.map((c) => (
            <FilterChip
              key={c}
              active={filter === c}
              onClick={() => setFilter(c)}
              label={c}
              count={counts[c]}
            />
          ))}
        </div>

        <ul className="space-y-2">
          {filtered.length === 0 && (
            <li className="rounded-2xl border border-dashed border-border bg-card/50 p-10 text-center text-sm text-muted-foreground">
              Nothing here yet. Add your first task above.
            </li>
          )}
          {filtered.map((task) => (
            <li
              key={task.id}
              className="group flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 transition-colors hover:border-primary/30"
            >
              <button
                onClick={() => toggleTask(task.id)}
                aria-label={task.done ? "Mark incomplete" : "Mark complete"}
                className={cn(
                  "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-all",
                  task.done
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-muted-foreground/40 hover:border-primary",
                )}
              >
                {task.done && <Check className="h-3 w-3" strokeWidth={3} />}
              </button>
              <span
                className={cn(
                  "flex-1 truncate text-sm transition-colors",
                  task.done && "text-muted-foreground line-through",
                )}
              >
                {task.title}
              </span>
              <span
                className={cn(
                  "rounded-full px-2 py-0.5 text-xs font-medium",
                  CATEGORY_STYLES[task.category],
                )}
              >
                {task.category}
              </span>
              <button
                onClick={() => removeTask(task.id)}
                aria-label="Delete task"
                className="rounded-md p-1 text-muted-foreground opacity-0 transition-opacity hover:bg-destructive/10 hover:text-destructive group-hover:opacity-100"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  label,
  count,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  count: number;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-card text-muted-foreground hover:text-foreground",
      )}
    >
      {label}
      <span className={cn("ml-1.5 opacity-70", active && "opacity-90")}>{count}</span>
    </button>
  );
}
