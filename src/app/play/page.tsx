import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PlayClient } from "./play-client";

export default async function PlayPage({
  searchParams,
}: {
  searchParams: Promise<{ child?: string }>;
}) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) redirect("/login");

  const params = await searchParams;
  const childId = params.child;

  if (!childId) {
    redirect("/dashboard");
  }

  // Verify child belongs to this parent
  const child = await prisma.child.findFirst({
    where: { id: childId, parentId: session.user.id },
    include: {
      rewards: true,
      completions: {
        where: {
          date: new Date(new Date().setHours(0, 0, 0, 0)),
        },
      },
    },
  });

  if (!child) {
    redirect("/dashboard");
  }

  // Get enabled tasks
  const tasks = await prisma.task.findMany({
    where: { parentId: session.user.id, enabled: true },
    orderBy: { createdAt: "asc" },
  });

  const completedTaskIds = child.completions.map((c) => c.taskId);
  const starCount = child.rewards.filter((r) => r.type === "STAR").length;

  return (
    <PlayClient
      child={child}
      tasks={tasks}
      completedTaskIds={completedTaskIds}
      starCount={starCount}
    />
  );
}
