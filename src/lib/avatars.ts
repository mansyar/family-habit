// Pre-defined animal avatars for child profiles
export const AVATARS = [
  { id: "bear", emoji: "🐻", name: "Bear" },
  { id: "cat", emoji: "🐱", name: "Cat" },
  { id: "dog", emoji: "🐶", name: "Dog" },
  { id: "rabbit", emoji: "🐰", name: "Rabbit" },
  { id: "panda", emoji: "🐼", name: "Panda" },
  { id: "lion", emoji: "🦁", name: "Lion" },
  { id: "fox", emoji: "🦊", name: "Fox" },
  { id: "koala", emoji: "🐨", name: "Koala" },
  { id: "unicorn", emoji: "🦄", name: "Unicorn" },
  { id: "owl", emoji: "🦉", name: "Owl" },
  { id: "penguin", emoji: "🐧", name: "Penguin" },
  { id: "monkey", emoji: "🐵", name: "Monkey" },
] as const;

export type AvatarId = (typeof AVATARS)[number]["id"];

export function getAvatarById(id: string) {
  return AVATARS.find((avatar) => avatar.id === id) ?? AVATARS[0];
}
