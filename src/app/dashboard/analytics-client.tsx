"use client";

import { useState, useEffect } from "react";
import { getWeeklyStats } from "@/lib/actions";

type Child = {
  id: string;
  name: string;
  avatar: string;
};

type WeeklyStats = {
  byDate: Record<string, number>;
  byTask: Record<string, number>;
  total: number;
};

type AnalyticsClientProps = {
  children: Child[];
};

export function AnalyticsClient({ children }: AnalyticsClientProps) {
  const [selectedChildId, setSelectedChildId] = useState<string>(
    children[0]?.id || ""
  );
  const [stats, setStats] = useState<WeeklyStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!selectedChildId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    getWeeklyStats(selectedChildId)
      .then(setStats)
      .finally(() => setLoading(false));
  }, [selectedChildId]);

  if (children.length === 0) {
    return (
      <div className="card text-center py-8">
        <div className="text-4xl mb-2">📊</div>
        <p className="text-foreground-muted">Add children to see analytics</p>
      </div>
    );
  }

  // Get last 7 days for chart
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return date.toISOString().split("T")[0];
  });

  const maxCompletions = stats
    ? Math.max(...Object.values(stats.byDate), 1)
    : 1;

  return (
    <div className="space-y-6">
      {/* Child Selector */}
      {children.length > 1 && (
        <div className="flex items-center gap-2">
          <span className="text-foreground-muted">Show stats for:</span>
          <select
            value={selectedChildId}
            onChange={(e) => setSelectedChildId(e.target.value)}
            className="px-3 py-2 rounded-lg border border-gray-200 bg-white"
          >
            {children.map((child) => (
              <option key={child.id} value={child.id}>
                {child.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {loading ? (
        <div className="card text-center py-8">
          <div className="animate-pulse text-foreground-muted">Loading...</div>
        </div>
      ) : (
        <>
          {/* Weekly Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="card bg-gradient-to-br from-blue-100 to-blue-200">
              <div className="text-3xl mb-2">📈</div>
              <div className="text-2xl font-bold">{stats?.total || 0}</div>
              <div className="text-foreground-muted">Tasks This Week</div>
            </div>
            <div className="card bg-gradient-to-br from-green-100 to-green-200">
              <div className="text-3xl mb-2">📅</div>
              <div className="text-2xl font-bold">
                {stats ? Math.round((stats.total / 7) * 10) / 10 : 0}
              </div>
              <div className="text-foreground-muted">Avg. Tasks per Day</div>
            </div>
          </div>

          {/* Daily Bar Chart */}
          <div className="card">
            <h3 className="font-bold mb-4">📊 Daily Completions</h3>
            <div className="flex items-end gap-2 h-32">
              {last7Days.map((dateKey) => {
                const count = stats?.byDate[dateKey] || 0;
                const height = (count / maxCompletions) * 100;
                const dayName = new Date(dateKey).toLocaleDateString("en", {
                  weekday: "short",
                });

                return (
                  <div
                    key={dateKey}
                    className="flex-1 flex flex-col items-center gap-1"
                  >
                    <span className="text-xs font-medium">{count}</span>
                    <div
                      className="w-full rounded-t-md transition-all duration-300"
                      style={{
                        height: `${Math.max(height, 4)}%`,
                        background:
                          count > 0
                            ? "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)"
                            : "#e5e7eb",
                      }}
                    />
                    <span className="text-xs text-foreground-muted">
                      {dayName}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Task Breakdown */}
          {stats && Object.keys(stats.byTask).length > 0 && (
            <div className="card">
              <h3 className="font-bold mb-4">🏆 Task Breakdown</h3>
              <div className="space-y-3">
                {Object.entries(stats.byTask)
                  .sort(([, a], [, b]) => b - a)
                  .map(([taskTitle, count]) => (
                    <div key={taskTitle} className="flex items-center gap-3">
                      <div className="flex-1">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="font-medium">{taskTitle}</span>
                          <span className="text-foreground-muted">
                            {count}x
                          </span>
                        </div>
                        <div className="progress-bar">
                          <div
                            className="progress-bar-fill"
                            style={{
                              width: `${(count / stats.total) * 100}%`,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
