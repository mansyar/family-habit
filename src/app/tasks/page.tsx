import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { TasksClient } from "./tasks-client";

export default async function TasksPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) redirect("/login");

  const tasks = await prisma.task.findMany({
    where: { parentId: session.user.id },
    orderBy: { createdAt: "asc" },
  });

  return <TasksClient tasks={tasks} />;
}
