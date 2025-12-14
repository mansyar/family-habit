"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signOut } from "@/lib/auth-client";
import { updateStickerThreshold } from "@/lib/actions";

type SettingsClientProps = {
  userName?: string | null;
  stickerThreshold: number;
};

export function SettingsClient({
  userName,
  stickerThreshold: initialThreshold,
}: SettingsClientProps) {
  const router = useRouter();
  const [threshold, setThreshold] = useState(initialThreshold);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleLogout() {
    await signOut();
    router.push("/login");
  }

  async function handleSaveThreshold() {
    setSaving(true);
    try {
      await updateStickerThreshold(threshold);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen p-6 bg-background">
      {/* Header */}
      <header className="mb-8">
        <Link
          href="/dashboard"
          className="text-foreground-muted hover:text-foreground mb-2 inline-block"
        >
          ← Back to Dashboard
        </Link>
        <h1 className="text-3xl font-bold">⚙️ Settings</h1>
      </header>

      <div className="max-w-md space-y-6">
        {/* Profile Section */}
        <div className="card">
          <h2 className="font-bold mb-4">👤 Profile</h2>
          <p className="text-foreground-muted">
            Logged in as:{" "}
            <span className="font-medium text-foreground">
              {userName || "Parent"}
            </span>
          </p>
        </div>

        {/* Rewards Settings */}
        <div className="card">
          <h2 className="font-bold mb-4">🎁 Rewards Settings</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Stars needed for a sticker
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={threshold}
                  onChange={(e) =>
                    setThreshold(
                      Math.max(1, Math.min(20, parseInt(e.target.value) || 1))
                    )
                  }
                  className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-center focus:ring-2 focus:ring-primary outline-none"
                />
                <span className="text-foreground-muted">stars = 1 sticker</span>
              </div>
              <p className="text-xs text-foreground-muted mt-2">
                Set between 1-20 stars. Default is 5.
              </p>
            </div>
            <button
              onClick={handleSaveThreshold}
              disabled={saving || threshold === initialThreshold}
              className="btn-primary w-full disabled:opacity-50"
            >
              {saving ? "Saving..." : saved ? "✓ Saved!" : "Save Changes"}
            </button>
          </div>
        </div>

        {/* App Info */}
        <div className="card">
          <h2 className="font-bold mb-4">📱 App Info</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-foreground-muted">Version</span>
              <span>1.0.0</span>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="card">
          <h2 className="font-bold mb-4">🔗 Quick Links</h2>
          <div className="space-y-2">
            <Link
              href="/children"
              className="block w-full px-4 py-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
            >
              👨‍👩‍👧‍👦 Manage Children
            </Link>
            <Link
              href="/tasks"
              className="block w-full px-4 py-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
            >
              📋 Manage Tasks
            </Link>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full px-4 py-3 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition font-medium"
        >
          🚪 Log Out
        </button>
      </div>
    </div>
  );
}
