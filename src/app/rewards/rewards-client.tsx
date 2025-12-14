"use client";

import Link from "next/link";
import { getAvatarById } from "@/lib/avatars";
import { STICKERS, getStickerById } from "@/lib/stickers";

type Child = {
  id: string;
  name: string;
  avatar: string;
};

type RewardsClientProps = {
  child: Child;
  starCount: number;
  unlockedStickerIds: string[];
};

export function RewardsClient({
  child,
  starCount,
  unlockedStickerIds,
}: RewardsClientProps) {
  const avatar = getAvatarById(child.avatar);
  const STICKER_THRESHOLD = 5;
  const starsToNextSticker =
    STICKER_THRESHOLD - (starCount % STICKER_THRESHOLD);

  return (
    <div className="min-h-screen child-mode p-6">
      {/* Header */}
      <header className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="avatar">{avatar.emoji}</div>
          <div>
            <h1 className="text-2xl font-bold">{child.name}&apos;s Rewards</h1>
            <p className="text-foreground-muted">
              Your amazing sticker collection!
            </p>
          </div>
        </div>
        <Link
          href={`/play?child=${child.id}`}
          className="btn-primary py-2 px-4"
        >
          ← Back to Tasks
        </Link>
      </header>

      {/* Star Counter */}
      <div className="card bg-gradient-to-br from-amber-100 to-amber-200 text-center mb-8 max-w-md mx-auto">
        <div className="text-6xl mb-4 animate-float">⭐</div>
        <div className="text-4xl font-bold mb-2">{starCount} Stars</div>
        <p className="text-foreground-muted">
          {starsToNextSticker === STICKER_THRESHOLD
            ? "Complete tasks to earn stars!"
            : `${starsToNextSticker} more ${
                starsToNextSticker === 1 ? "star" : "stars"
              } until next sticker!`}
        </p>

        {/* Progress to next sticker */}
        <div className="mt-4">
          <div className="progress-bar">
            <div
              className="progress-bar-fill"
              style={{
                width: `${
                  ((STICKER_THRESHOLD - starsToNextSticker) /
                    STICKER_THRESHOLD) *
                  100
                }%`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Sticker Collection */}
      <div className="max-w-2xl mx-auto">
        <h2 className="text-xl font-bold mb-4 text-center">
          🎨 Sticker Collection ({unlockedStickerIds.length}/{STICKERS.length})
        </h2>

        <div className="sticker-grid">
          {STICKERS.map((sticker) => {
            const isUnlocked = unlockedStickerIds.includes(sticker.id);

            return (
              <div
                key={sticker.id}
                className={`sticker ${isUnlocked ? "unlocked" : "locked"}`}
                title={isUnlocked ? sticker.name : "???"}
              >
                {isUnlocked ? sticker.emoji : "❓"}
              </div>
            );
          })}
        </div>

        {/* All Stickers Collected */}
        {unlockedStickerIds.length === STICKERS.length && (
          <div className="text-center mt-8 animate-bounce-in">
            <div className="text-6xl mb-4">🏆</div>
            <h2 className="text-2xl font-bold text-amber-600">
              Amazing! You collected all stickers!
            </h2>
            <p className="text-foreground-muted">You&apos;re a superstar! 🌟</p>
          </div>
        )}

        {/* No Stickers Yet */}
        {unlockedStickerIds.length === 0 && (
          <div className="text-center mt-8">
            <p className="text-foreground-muted">
              Complete {STICKER_THRESHOLD} tasks to unlock your first sticker!
              🎉
            </p>
          </div>
        )}
      </div>

      {/* Exit Button */}
      <div className="fixed bottom-6 left-6">
        <Link
          href="/dashboard"
          className="px-6 py-3 bg-gray-800 text-white rounded-full shadow-lg hover:bg-gray-700 transition"
        >
          🔙 Exit to Parent Mode
        </Link>
      </div>
    </div>
  );
}
