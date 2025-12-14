"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  createChild,
  updateChild,
  deleteChild,
  resetChildProgress,
} from "@/lib/actions";
import { AVATARS, getAvatarById } from "@/lib/avatars";

type Child = {
  id: string;
  name: string;
  avatar: string;
  rewards: { type: string }[];
};

export function ChildrenClient({
  children: initialChildren,
}: {
  children: Child[];
}) {
  const router = useRouter();
  const [children, setChildren] = useState(initialChildren);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState<string>(AVATARS[0].id);
  const [loading, setLoading] = useState(false);

  function openAddForm() {
    setEditingId(null);
    setName("");
    setSelectedAvatar(AVATARS[0].id);
    setShowForm(true);
  }

  function openEditForm(child: Child) {
    setEditingId(child.id);
    setName(child.name);
    setSelectedAvatar(child.avatar);
    setShowForm(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingId) {
        const updated = await updateChild(editingId, name, selectedAvatar);
        setChildren(
          children.map((c) =>
            c.id === editingId
              ? { ...c, name: updated.name, avatar: updated.avatar }
              : c
          )
        );
      } else {
        const newChild = await createChild(name, selectedAvatar);
        setChildren([...children, { ...newChild, rewards: [] }]);
      }
      setShowForm(false);
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(childId: string) {
    if (!confirm("Are you sure? This will delete all their progress.")) return;

    setLoading(true);
    try {
      await deleteChild(childId);
      setChildren(children.filter((c) => c.id !== childId));
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  async function handleReset(childId: string) {
    if (
      !confirm(
        "Reset progress? This will delete all stars and stickers for this child. Task history will be cleared."
      )
    )
      return;

    setLoading(true);
    try {
      await resetChildProgress(childId);
      // Update local state to reflect reset
      setChildren(
        children.map((c) => (c.id === childId ? { ...c, rewards: [] } : c))
      );
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
          <h1 className="text-3xl font-bold">👨‍👩‍👧‍👦 Manage Children</h1>
        </div>
        <button onClick={openAddForm} className="btn-primary">
          + Add Child
        </button>
      </header>

      {/* Children List */}
      {children.length === 0 ? (
        <div className="card text-center py-12">
          <div className="text-6xl mb-4">👶</div>
          <h2 className="text-xl font-bold mb-2">No children yet</h2>
          <p className="text-foreground-muted mb-6">
            Add your first child to get started!
          </p>
          <button onClick={openAddForm} className="btn-primary">
            Add Your First Child
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {children.map((child) => {
            const avatar = getAvatarById(child.avatar);
            const starCount = child.rewards.filter(
              (r) => r.type === "STAR"
            ).length;

            return (
              <div key={child.id} className="card">
                <div className="flex items-center gap-4 mb-4">
                  <div className="avatar">{avatar.emoji}</div>
                  <div>
                    <h3 className="font-bold text-lg">{child.name}</h3>
                    <div className="star-counter text-sm">
                      ⭐ {starCount} stars
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => openEditForm(child)}
                    className="flex-1 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => handleReset(child.id)}
                    disabled={loading}
                    className="px-4 py-2 bg-orange-100 text-orange-600 rounded-lg hover:bg-orange-200 transition disabled:opacity-50"
                    title="Reset progress"
                  >
                    🔄
                  </button>
                  <button
                    onClick={() => handleDelete(child.id)}
                    disabled={loading}
                    className="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition disabled:opacity-50"
                    title="Delete child"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add/Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="card max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">
              {editingId ? "Edit Child" : "Add New Child"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                  placeholder="Child's name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Choose Avatar
                </label>
                <div className="grid grid-cols-6 gap-2">
                  {AVATARS.map((avatar) => (
                    <button
                      key={avatar.id}
                      type="button"
                      onClick={() => setSelectedAvatar(avatar.id)}
                      className={`aspect-square flex items-center justify-center text-2xl rounded-lg border-2 transition ${
                        selectedAvatar === avatar.id
                          ? "border-primary bg-amber-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      {avatar.emoji}
                    </button>
                  ))}
                </div>
              </div>

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
                  {loading ? "Saving..." : editingId ? "Update" : "Add Child"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
