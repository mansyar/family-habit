"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { completeTask } from "@/lib/actions";
import { getAvatarById } from "@/lib/avatars";
import { getStickerById } from "@/lib/stickers";
import { setChildSessionCookie } from "./actions";

type Child = {
  id: string;
  name: string;
  avatar: string;
};

type Task = {
  id: string;
  title: string;
  icon: string;
  frequency: "DAILY" | "WEEKLY";
};

type PlayClientProps = {
  child: Child;
  tasks: Task[];
  completedTaskIds: string[];
  starCount: number;
};

export function PlayClient({
  child,
  tasks,
  completedTaskIds,
  starCount: initialStarCount,
}: PlayClientProps) {
  // Set child session cookie on mount
  useEffect(() => {
    setChildSessionCookie(child.id);
  }, [child.id]);
  const router = useRouter();
  const avatar = getAvatarById(child.avatar);
  const [completedIds, setCompletedIds] = useState<string[]>(completedTaskIds);
  const [starCount, setStarCount] = useState(initialStarCount);
  const [showReward, setShowReward] = useState(false);
  const [newSticker, setNewSticker] = useState<string | null>(null);
  const [loading, setLoading] = useState<string | null>(null);

  async function handleComplete(taskId: string) {
    if (completedIds.includes(taskId)) return;

    setLoading(taskId);
    try {
      const result = await completeTask(child.id, taskId);
      setCompletedIds([...completedIds, taskId]);
      setStarCount(result.starCount);

      // Show reward animation
      setShowReward(true);

      if (result.newSticker) {
        setNewSticker(result.newSticker.stickerId);
      }

      // Hide after animation
      setTimeout(() => {
        setShowReward(false);
        setNewSticker(null);
      }, 2500);
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="min-h-screen child-mode p-6 relative overflow-hidden">
      {/* Header */}
      <header className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="avatar">{avatar.emoji}</div>
          <div>
            <h1 className="text-2xl font-bold">{child.name}&apos;s Tasks</h1>
            <p className="text-foreground-muted">
              Complete your tasks to earn stars!
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="star-counter">⭐ {starCount}</div>
          <Link href="/rewards" className="btn-primary py-2 px-4">
            🏆 Rewards
          </Link>
        </div>
      </header>

      {/* Tasks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
        {tasks.map((task) => {
          const isCompleted = completedIds.includes(task.id);
          const isLoading = loading === task.id;

          return (
            <button
              key={task.id}
              onClick={() => handleComplete(task.id)}
              disabled={isCompleted || isLoading}
              className={`task-card ${isCompleted ? "completed" : ""} ${
                isLoading ? "animate-pulse" : ""
              }`}
            >
              <div
                className={`icon-xl ${isCompleted ? "animate-bounce-in" : ""}`}
              >
                {isCompleted ? "✅" : task.icon}
              </div>
              <h3 className="text-xl font-bold text-center">{task.title}</h3>
              {isCompleted && (
                <span className="text-green-600 font-medium">Done! ⭐</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Empty State */}
      {tasks.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold mb-2">No tasks yet!</h2>
          <p className="text-foreground-muted">
            Ask a parent to add some tasks.
          </p>
        </div>
      )}

      {/* All Done Message */}
      {tasks.length > 0 && completedIds.length === tasks.length && (
        <div className="text-center py-8 mt-8 animate-bounce-in">
          <div className="text-6xl mb-4">🎊</div>
          <h2 className="text-2xl font-bold text-green-600">
            Amazing! All done!
          </h2>
          <p className="text-foreground-muted">
            You completed all your tasks today!
          </p>
        </div>
      )}

      {/* Exit Button */}
      <div className="fixed bottom-6 left-6">
        <Link
          href="/dashboard"
          className="px-6 py-3 bg-gray-800 text-white rounded-full shadow-lg hover:bg-gray-700 transition"
        >
          🔙 Exit to Parent Mode
        </Link>
      </div>

      {/* Reward Animation Overlay */}
      {showReward && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50">
          <div className="text-center animate-bounce-in">
            <div className="text-9xl animate-star-burst">⭐</div>
            <h2 className="text-4xl font-bold text-white mt-4 drop-shadow-lg">
              You earned a star!
            </h2>
            {newSticker && (
              <div className="mt-8 animate-bounce-in">
                <div className="text-8xl">
                  {getStickerById(newSticker).emoji}
                </div>
                <h3 className="text-2xl font-bold text-amber-400 mt-2">
                  New Sticker Unlocked! 🎉
                </h3>
              </div>
            )}
          </div>
          {/* Confetti Effect */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute text-3xl"
                style={{
                  left: `${Math.random() * 100}%`,
                  bottom: "-50px",
                  animation: `confetti 2s ease-out ${
                    Math.random() * 0.5
                  }s forwards`,
                }}
              >
                {["🌟", "✨", "💫", "⭐"][Math.floor(Math.random() * 4)]}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
