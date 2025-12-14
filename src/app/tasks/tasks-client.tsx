"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  createTask,
  createTaskFromTemplate,
  updateTask,
  deleteTask,
} from "@/lib/actions";
import { TASK_TEMPLATES, TASK_ICONS } from "@/lib/task-templates";

type Task = {
  id: string;
  title: string;
  icon: string;
  frequency: "DAILY" | "WEEKLY";
  enabled: boolean;
};

export function TasksClient({ tasks: initialTasks }: { tasks: Task[] }) {
  const router = useRouter();
  const [tasks, setTasks] = useState(initialTasks);
  const [showForm, setShowForm] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [icon, setIcon] = useState<string>(TASK_ICONS[0]);
  const [frequency, setFrequency] = useState<"DAILY" | "WEEKLY">("DAILY");
  const [enabled, setEnabled] = useState(true);
  const [loading, setLoading] = useState(false);

  function openAddForm() {
    setEditingId(null);
    setTitle("");
    setIcon(TASK_ICONS[0]);
    setFrequency("DAILY");
    setEnabled(true);
    setShowForm(true);
  }

  function openEditForm(task: Task) {
    setEditingId(task.id);
    setTitle(task.title);
    setIcon(task.icon);
    setFrequency(task.frequency);
    setEnabled(task.enabled);
    setShowForm(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingId) {
        const updated = await updateTask(
          editingId,
          title,
          icon,
          frequency,
          enabled
        );
        setTasks(
          tasks.map((t) =>
            t.id === editingId
              ? {
                  ...t,
                  title: updated.title,
                  icon: updated.icon,
                  frequency: updated.frequency,
                  enabled: updated.enabled,
                }
              : t
          )
        );
      } else {
        const newTask = await createTask(title, icon, frequency);
        setTasks([...tasks, { ...newTask, enabled: true }]);
      }
      setShowForm(false);
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  async function handleAddFromTemplate(index: number) {
    setLoading(true);
    try {
      const newTask = await createTaskFromTemplate(index);
      setTasks([...tasks, { ...newTask, enabled: true }]);
      setShowTemplates(false);
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(taskId: string) {
    if (!confirm("Are you sure you want to delete this task?")) return;

    setLoading(true);
    try {
      await deleteTask(taskId);
      setTasks(tasks.filter((t) => t.id !== taskId));
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen p-6 bg-background">
      {/* Header */}
      <header className="flex items-center justify-between mb-8">
        <div>
          <Link
            href="/dashboard"
            className="text-foreground-muted hover:text-foreground mb-2 inline-block"
          >
            ← Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold">📋 Manage Tasks</h1>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowTemplates(true)}
            className="px-4 py-2 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200 transition"
          >
            📦 Templates
          </button>
          <button onClick={openAddForm} className="btn-primary">
            + Custom Task
          </button>
        </div>
      </header>

      {/* Tasks List */}
      {tasks.length === 0 ? (
        <div className="card text-center py-12">
          <div className="text-6xl mb-4">📝</div>
          <h2 className="text-xl font-bold mb-2">No tasks yet</h2>
          <p className="text-foreground-muted mb-6">
            Start with templates or create your own!
          </p>
          <div className="flex gap-2 justify-center">
            <button
              onClick={() => setShowTemplates(true)}
              className="px-4 py-2 bg-purple-100 text-purple-600 rounded-lg"
            >
              📦 Browse Templates
            </button>
            <button onClick={openAddForm} className="btn-primary">
              Create Custom
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tasks.map((task) => (
            <div
              key={task.id}
              className={`card ${!task.enabled ? "opacity-50" : ""}`}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="text-4xl">{task.icon}</div>
                <div>
                  <h3 className="font-bold text-lg">{task.title}</h3>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        task.frequency === "DAILY"
                          ? "bg-blue-100 text-blue-600"
                          : "bg-green-100 text-green-600"
                      }`}
                    >
                      {task.frequency === "DAILY" ? "Daily" : "Weekly"}
                    </span>
                    {!task.enabled && (
                      <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                        Disabled
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => openEditForm(task)}
                  className="flex-1 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => handleDelete(task.id)}
                  className="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Templates Modal */}
      {showTemplates && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="card max-w-lg w-full">
            <h2 className="text-xl font-bold mb-4">📦 Task Templates</h2>
            <p className="text-foreground-muted mb-4">Quick-add common tasks</p>
            <div className="space-y-2">
              {TASK_TEMPLATES.map((template, index) => (
                <button
                  key={index}
                  onClick={() => handleAddFromTemplate(index)}
                  disabled={loading}
                  className="w-full flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                >
                  <span className="text-3xl">{template.icon}</span>
                  <div className="text-left">
                    <div className="font-medium">{template.title}</div>
                    <div className="text-sm text-foreground-muted">
                      {template.frequency === "DAILY"
                        ? "Daily task"
                        : "Weekly task"}
                    </div>
                  </div>
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowTemplates(false)}
              className="w-full mt-4 px-4 py-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="card max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">
              {editingId ? "Edit Task" : "Create Custom Task"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Task Name
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                  placeholder="e.g., Drink water"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Choose Icon
                </label>
                <div className="grid grid-cols-8 gap-2">
                  {TASK_ICONS.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => setIcon(emoji)}
                      className={`aspect-square flex items-center justify-center text-xl rounded-lg border-2 transition ${
                        icon === emoji
                          ? "border-primary bg-amber-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Frequency
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setFrequency("DAILY")}
                    className={`flex-1 px-4 py-3 rounded-lg border-2 transition ${
                      frequency === "DAILY"
                        ? "border-primary bg-amber-50"
                        : "border-gray-200"
                    }`}
                  >
                    Daily
                  </button>
                  <button
                    type="button"
                    onClick={() => setFrequency("WEEKLY")}
                    className={`flex-1 px-4 py-3 rounded-lg border-2 transition ${
                      frequency === "WEEKLY"
                        ? "border-primary bg-amber-50"
                        : "border-gray-200"
                    }`}
                  >
                    Weekly
                  </button>
                </div>
              </div>

              {editingId && (
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="enabled"
                    checked={enabled}
                    onChange={(e) => setEnabled(e.target.checked)}
                    className="w-5 h-5 rounded"
                  />
                  <label htmlFor="enabled">Task enabled</label>
                </div>
              )}

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 px-4 py-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary flex-1 disabled:opacity-50"
                >
                  {loading ? "Saving..." : editingId ? "Update" : "Create Task"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
