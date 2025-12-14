import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ChildrenClient } from "./children-client";

export default async function ChildrenPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) redirect("/login");

  const children = await prisma.child.findMany({
    where: { parentId: session.user.id },
    include: { rewards: true },
    orderBy: { createdAt: "asc" },
  });

  return <ChildrenClient children={children} />;
}
