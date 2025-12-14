// Frequency type matching Prisma schema
type Frequency = "DAILY" | "WEEKLY";

// Template tasks that parents can add to their children's list
export const TASK_TEMPLATES: Array<{
  title: string;
  icon: string;
  frequency: Frequency;
}> = [
  { title: "Brush teeth", icon: "🦷", frequency: "DAILY" },
  { title: "Clean toys", icon: "🧸", frequency: "DAILY" },
  { title: "Read a book", icon: "📚", frequency: "DAILY" },
  { title: "Sleep on time", icon: "😴", frequency: "DAILY" },
  { title: "Eat fruits", icon: "🍎", frequency: "DAILY" },
];

// Additional task icons for custom tasks
export const TASK_ICONS = [
  "🦷", // Brush teeth
  "🧸", // Clean toys
  "📚", // Reading
  "😴", // Sleep
  "🍎", // Fruits
  "🥕", // Vegetables
  "🚿", // Shower/bath
  "👕", // Get dressed
  "🎨", // Art/creativity
  "🏃", // Exercise
  "🧹", // Chores
  "🙏", // Be kind
  "💧", // Drink water
  "🎵", // Music
  "🌱", // Care for plants
] as const;

export type TaskIcon = (typeof TASK_ICONS)[number];
