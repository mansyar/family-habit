import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { getAvatarById } from "@/lib/avatars";
import { AnalyticsClient } from "./analytics-client";

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) redirect("/login");

  // Get children with today's completions
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const children = await prisma.child.findMany({
    where: { parentId: session.user.id },
    include: {
      rewards: true,
      completions: {
        where: { date: today },
        include: { task: true },
      },
    },
    orderBy: { createdAt: "asc" },
  });

  // Get tasks
  const tasks = await prisma.task.findMany({
    where: { parentId: session.user.id, enabled: true },
  });

  return (
    <div className="min-h-screen p-6 bg-background">
      {/* Header */}
      <header className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">
            👋 Hello, {session.user.name || "Parent"}!
          </h1>
          <p className="text-foreground-muted">
            Manage your family&apos;s habits
          </p>
        </div>
        <Link
          href="/settings"
          className="text-foreground-muted hover:text-foreground transition"
        >
          ⚙️ Settings
        </Link>
      </header>

      {/* Quick Stats */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="card bg-gradient-to-br from-amber-100 to-amber-200">
          <div className="text-4xl mb-2">👨‍👩‍👧‍👦</div>
          <div className="text-2xl font-bold">{children.length}</div>
          <div className="text-foreground-muted">Children</div>
        </div>
        <div className="card bg-gradient-to-br from-purple-100 to-purple-200">
          <div className="text-4xl mb-2">📋</div>
          <div className="text-2xl font-bold">{tasks.length}</div>
          <div className="text-foreground-muted">Active Tasks</div>
        </div>
        <div className="card bg-gradient-to-br from-green-100 to-green-200">
          <div className="text-4xl mb-2">✅</div>
          <div className="text-2xl font-bold">
            {children.reduce((sum, c) => sum + c.completions.length, 0)}
          </div>
          <div className="text-foreground-muted">Completed Today</div>
        </div>
      </section>

      {/* Children Section */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Your Children</h2>
          <Link href="/children" className="text-primary hover:underline">
            Manage →
          </Link>
        </div>

        {children.length === 0 ? (
          <div className="card text-center py-8">
            <div className="text-6xl mb-4">👶</div>
            <p className="text-foreground-muted mb-4">No children yet</p>
            <Link href="/children" className="btn-primary inline-block">
              Add Your First Child
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {children.map((child) => {
              const avatar = getAvatarById(child.avatar);
              const starCount = child.rewards.filter(
                (r) => r.type === "STAR"
              ).length;
              const todayDone = child.completions.length;
              const progress =
                tasks.length > 0
                  ? Math.round((todayDone / tasks.length) * 100)
                  : 0;

              return (
                <div key={child.id} className="card hover:shadow-lg transition">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="avatar">{avatar.emoji}</div>
                    <div>
                      <h3 className="font-bold text-lg">{child.name}</h3>
                      <div className="star-counter text-sm">
                        ⭐ {starCount} stars
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Today&apos;s Progress</span>
                      <span>
                        {todayDone}/{tasks.length}
                      </span>
                    </div>
                    <div className="progress-bar">
                      <div
                        className="progress-bar-fill"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Link
                      href={`/play?child=${child.id}`}
                      className="btn-primary flex-1 text-center text-sm py-2"
                    >
                      🎮 Start Play Mode
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Tasks Section */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Tasks</h2>
          <Link href="/tasks" className="text-primary hover:underline">
            Manage →
          </Link>
        </div>

        {tasks.length === 0 ? (
          <div className="card text-center py-8">
            <div className="text-6xl mb-4">📝</div>
            <p className="text-foreground-muted mb-4">No tasks yet</p>
            <Link href="/tasks" className="btn-primary inline-block">
              Add Your First Task
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {tasks.map((task) => (
              <div key={task.id} className="card text-center py-4">
                <div className="text-3xl mb-2">{task.icon}</div>
                <div className="text-sm font-medium truncate">{task.title}</div>
                <div className="text-xs text-foreground-muted">
                  {task.frequency === "DAILY" ? "Daily" : "Weekly"}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Analytics Section */}
      <section className="mt-8">
        <h2 className="text-xl font-bold mb-4">📊 Weekly Analytics</h2>
        <AnalyticsClient
          children={children.map((c) => ({
            id: c.id,
            name: c.name,
            avatar: c.avatar,
          }))}
        />
      </section>
    </div>
  );
}
