// 15 Fun stickers for the reward collection
export const STICKERS = [
  { id: "rainbow", emoji: "🌈", name: "Rainbow" },
  { id: "star", emoji: "⭐", name: "Gold Star" },
  { id: "rocket", emoji: "🚀", name: "Rocket" },
  { id: "trophy", emoji: "🏆", name: "Trophy" },
  { id: "crown", emoji: "👑", name: "Crown" },
  { id: "heart", emoji: "❤️", name: "Heart" },
  { id: "diamond", emoji: "💎", name: "Diamond" },
  { id: "fire", emoji: "🔥", name: "Fire" },
  { id: "sparkles", emoji: "✨", name: "Sparkles" },
  { id: "balloon", emoji: "🎈", name: "Balloon" },
  { id: "cake", emoji: "🎂", name: "Cake" },
  { id: "sun", emoji: "☀️", name: "Sun" },
  { id: "butterfly", emoji: "🦋", name: "Butterfly" },
  { id: "flower", emoji: "🌸", name: "Flower" },
  { id: "medal", emoji: "🏅", name: "Medal" },
] as const;

export type StickerId = (typeof STICKERS)[number]["id"];

export function getStickerById(id: string) {
  return STICKERS.find((sticker) => sticker.id === id) ?? STICKERS[0];
}

// Get a random sticker that the child hasn't unlocked yet
export function getRandomUnlockedSticker(
  unlockedIds: string[]
): StickerId | null {
  const available = STICKERS.filter((s) => !unlockedIds.includes(s.id));
  if (available.length === 0) return null;
  const randomIndex = Math.floor(Math.random() * available.length);
  return available[randomIndex].id;
}
