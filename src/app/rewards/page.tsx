import { auth } from "@/lib/auth";
import { headers, cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { RewardsClient } from "./rewards-client";

export default async function RewardsPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) redirect("/login");

  // Get child from session cookie
  const cookieStore = await cookies();
  const childId = cookieStore.get("childSessionId")?.value;

  if (!childId) {
    redirect("/dashboard");
  }

  // Verify child belongs to this parent
  const child = await prisma.child.findFirst({
    where: { id: childId, parentId: session.user.id },
    include: {
      rewards: true,
    },
  });

  if (!child) {
    redirect("/dashboard");
  }

  const starCount = child.rewards.filter((r) => r.type === "STAR").length;
  const unlockedStickerIds = child.rewards
    .filter((r) => r.type === "STICKER" && r.stickerId)
    .map((r) => r.stickerId as string);

  return (
    <RewardsClient
      child={child}
      starCount={starCount}
      unlockedStickerIds={unlockedStickerIds}
    />
  );
}
