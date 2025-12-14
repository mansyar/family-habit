"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { TASK_TEMPLATES } from "@/lib/task-templates";
import { getRandomUnlockedSticker } from "@/lib/stickers";

// ==========================================
// Child Actions
// ==========================================

export async function createChild(name: string, avatarId: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) throw new Error("Unauthorized");

  const child = await prisma.child.create({
    data: {
      name,
      avatar: avatarId,
      parentId: session.user.id,
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/children");
  return child;
}

export async function updateChild(
  childId: string,
  name: string,
  avatarId: string
) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) throw new Error("Unauthorized");

  const child = await prisma.child.update({
    where: { id: childId, parentId: session.user.id },
    data: { name, avatar: avatarId },
  });

  revalidatePath("/dashboard");
  revalidatePath("/children");
  return child;
}

export async function deleteChild(childId: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) throw new Error("Unauthorized");

  await prisma.child.delete({
    where: { id: childId, parentId: session.user.id },
  });

  revalidatePath("/dashboard");
  revalidatePath("/children");
}

export async function getChildren() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) throw new Error("Unauthorized");

  return prisma.child.findMany({
    where: { parentId: session.user.id },
    include: {
      rewards: true,
      completions: {
        where: {
          date: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
          },
        },
      },
    },
    orderBy: { createdAt: "asc" },
  });
}

export async function resetChildProgress(childId: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) throw new Error("Unauthorized");

  // Verify child belongs to this parent
  const child = await prisma.child.findFirst({
    where: { id: childId, parentId: session.user.id },
  });
  if (!child) throw new Error("Child not found");

  // Delete all completions and rewards
  await prisma.$transaction([
    prisma.completion.deleteMany({ where: { childId } }),
    prisma.reward.deleteMany({ where: { childId } }),
  ]);

  revalidatePath("/dashboard");
  revalidatePath("/children");
  revalidatePath("/play");
  revalidatePath("/rewards");
}

export async function resetChildRewards(childId: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) throw new Error("Unauthorized");

  // Verify child belongs to this parent
  const child = await prisma.child.findFirst({
    where: { id: childId, parentId: session.user.id },
  });
  if (!child) throw new Error("Child not found");

  // Delete only rewards, keep completions
  await prisma.reward.deleteMany({ where: { childId } });

  revalidatePath("/dashboard");
  revalidatePath("/children");
  revalidatePath("/play");
  revalidatePath("/rewards");
}

// ==========================================
// Task Actions
// ==========================================

export async function createTask(
  title: string,
  icon: string,
  frequency: "DAILY" | "WEEKLY"
) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) throw new Error("Unauthorized");

  const task = await prisma.task.create({
    data: {
      title,
      icon,
      frequency,
      parentId: session.user.id,
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/tasks");
  return task;
}

export async function createTaskFromTemplate(templateIndex: number) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) throw new Error("Unauthorized");

  const template = TASK_TEMPLATES[templateIndex];
  if (!template) throw new Error("Invalid template");

  const task = await prisma.task.create({
    data: {
      title: template.title,
      icon: template.icon,
      frequency: template.frequency,
      parentId: session.user.id,
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/tasks");
  return task;
}

export async function updateTask(
  taskId: string,
  title: string,
  icon: string,
  frequency: "DAILY" | "WEEKLY",
  enabled: boolean
) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) throw new Error("Unauthorized");

  const task = await prisma.task.update({
    where: { id: taskId, parentId: session.user.id },
    data: { title, icon, frequency, enabled },
  });

  revalidatePath("/dashboard");
  revalidatePath("/tasks");
  return task;
}

export async function deleteTask(taskId: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) throw new Error("Unauthorized");

  await prisma.task.delete({
    where: { id: taskId, parentId: session.user.id },
  });

  revalidatePath("/dashboard");
  revalidatePath("/tasks");
}

export async function getTasks() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) throw new Error("Unauthorized");

  return prisma.task.findMany({
    where: { parentId: session.user.id },
    orderBy: { createdAt: "asc" },
  });
}

// ==========================================
// Completion Actions
// ==========================================

export async function completeTask(childId: string, taskId: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) throw new Error("Unauthorized");

  // Get user's sticker threshold setting
  const settings = await prisma.appSettings.findUnique({
    where: { userId: session.user.id },
  });
  const stickerThreshold = settings?.stickerThreshold ?? 5;

  // Verify the child belongs to this parent
  const child = await prisma.child.findFirst({
    where: { id: childId, parentId: session.user.id },
    include: { rewards: true },
  });
  if (!child) throw new Error("Child not found");

  // Create the completion
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const completion = await prisma.completion.create({
    data: {
      childId,
      taskId,
      date: today,
    },
  });

  // Award a star
  await prisma.reward.create({
    data: {
      childId,
      type: "STAR",
    },
  });

  // Check if child earned a new sticker
  const starCount = await prisma.reward.count({
    where: { childId, type: "STAR" },
  });

  let newSticker = null;
  if (starCount % stickerThreshold === 0) {
    const unlockedStickerIds = child.rewards
      .filter((r) => r.type === "STICKER" && r.stickerId)
      .map((r) => r.stickerId as string);

    const newStickerId = getRandomUnlockedSticker(unlockedStickerIds);
    if (newStickerId) {
      newSticker = await prisma.reward.create({
        data: {
          childId,
          type: "STICKER",
          stickerId: newStickerId,
        },
      });
    }
  }

  revalidatePath("/dashboard");
  revalidatePath("/play");
  revalidatePath("/rewards");

  return { completion, starCount, newSticker };
}

export async function getTodayCompletions(childId: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) throw new Error("Unauthorized");

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return prisma.completion.findMany({
    where: {
      childId,
      date: today,
    },
  });
}

// ==========================================
// Analytics
// ==========================================

export async function getWeeklyStats(childId: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) throw new Error("Unauthorized");

  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  weekAgo.setHours(0, 0, 0, 0);

  const completions = await prisma.completion.findMany({
    where: {
      childId,
      date: { gte: weekAgo },
    },
    include: { task: true },
  });

  // Group by date
  const byDate: Record<string, number> = {};
  completions.forEach((c) => {
    const dateKey = c.date.toISOString().split("T")[0];
    byDate[dateKey] = (byDate[dateKey] || 0) + 1;
  });

  // Group by task
  const byTask: Record<string, number> = {};
  completions.forEach((c) => {
    byTask[c.task.title] = (byTask[c.task.title] || 0) + 1;
  });

  return { byDate, byTask, total: completions.length };
}

// ==========================================
// Settings Actions
// ==========================================

export async function getAppSettings() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) throw new Error("Unauthorized");

  // Get or create settings for this user
  let settings = await prisma.appSettings.findUnique({
    where: { userId: session.user.id },
  });

  if (!settings) {
    settings = await prisma.appSettings.create({
      data: {
        userId: session.user.id,
        stickerThreshold: 5,
      },
    });
  }

  return settings;
}

export async function updateStickerThreshold(threshold: number) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) throw new Error("Unauthorized");

  // Validate threshold (1-20)
  const validThreshold = Math.max(1, Math.min(20, Math.floor(threshold)));

  const settings = await prisma.appSettings.upsert({
    where: { userId: session.user.id },
    update: { stickerThreshold: validThreshold },
    create: {
      userId: session.user.id,
      stickerThreshold: validThreshold,
    },
  });

  revalidatePath("/settings");
  return settings;
}
