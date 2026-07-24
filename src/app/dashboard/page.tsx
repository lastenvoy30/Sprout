"use client";

import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import HabitCard from "@/components/HabitCard";
import NewHabitForm from "@/components/NewHabitForm";
import type { Habit, Group } from "@/types/models";

export default function DashboardPage() {
  const { status } = useSession();
  const router = useRouter();

  const [habits, setHabits] = useState<Habit[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewHabit, setShowNewHabit] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [groupError, setGroupError] = useState("");

  const loadData = useCallback(async () => {
    const [habitsRes, groupsRes] = await Promise.all([
      fetch("/api/habits"),
      fetch("/api/groups"),
    ]);
    if (habitsRes.ok) setHabits((await habitsRes.json()).habits);
    if (groupsRes.ok) setGroups((await groupsRes.json()).groups);
    setLoading(false);
  }, []);

useEffect(() => {
  if (status === "unauthenticated") {
    router.push("/login");
    return;
  }
  if (status === "authenticated") {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- fetch-on-mount is intentional here
    void loadData();
  }
}, [status, router, loadData]);

  async function handleToggle(habitId: string) {
    const res = await fetch(`/api/habits/${habitId}/checkin`, { method: "POST" });
    if (res.ok) loadData();
  }

  async function handleDelete(habitId: string) {
    if (!confirm("Delete this habit? This can't be undone.")) return;
    const res = await fetch(`/api/habits/${habitId}`, { method: "DELETE" });
    if (res.ok) loadData();
  }

  async function handleCreateGroup(e: React.FormEvent) {
    e.preventDefault();
    setGroupError("");
    if (!newGroupName.trim()) return;
    const res = await fetch("/api/groups", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newGroupName }),
    });
    if (res.ok) {
      setNewGroupName("");
      loadData();
    } else {
      setGroupError((await res.json()).error);
    }
  }

  async function handleJoinGroup(e: React.FormEvent) {
    e.preventDefault();
    setGroupError("");
    if (!joinCode.trim()) return;
    const res = await fetch("/api/groups/join", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ inviteCode: joinCode }),
    });
    if (res.ok) {
      setJoinCode("");
      loadData();
    } else {
      setGroupError((await res.json()).error);
    }
  }

  if (status !== "authenticated" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-ink/50">
        Loading…
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-4xl mx-auto px-6 py-10 grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="font-display italic text-2xl">Your habits</h1>
            {!showNewHabit && (
              <button className="btn-primary" onClick={() => setShowNewHabit(true)}>
                + New habit
              </button>
            )}
          </div>

          {showNewHabit && (
            <NewHabitForm
              onCreated={() => {
                setShowNewHabit(false);
                loadData();
              }}
              onCancel={() => setShowNewHabit(false)}
            />
          )}

          {habits.length === 0 && !showNewHabit && (
            <div className="card p-8 text-center text-ink/50">
              No habits yet. Plant your first one above.
            </div>
          )}

          {habits.map((habit) => (
            <HabitCard
              key={habit.id}
              habit={habit}
              onToggle={handleToggle}
              onDelete={handleDelete}
            />
          ))}
        </div>

        <aside className="space-y-6">
          <div>
            <h2 className="font-display italic text-xl mb-3">Your groups</h2>
            <div className="space-y-2">
              {groups.map((group) => (
                <Link
                  key={group.id}
                  href={`/groups/${group.id}`}
                  className="card p-4 flex items-center justify-between hover:border-moss transition-colors"
                >
                  <div>
                    <p className="font-medium text-sm">{group.name}</p>
                    <p className="text-xs text-ink/50">
                      {group.memberships.length} member
                      {group.memberships.length === 1 ? "" : "s"}
                    </p>
                  </div>
                  <span className="text-ink/30">→</span>
                </Link>
              ))}
              {groups.length === 0 && (
                <p className="text-sm text-ink/50">
                  You&apos;re not in a group yet. Create one or join with an invite code.
                </p>
              )}
            </div>
          </div>

          <form onSubmit={handleCreateGroup} className="card p-4 space-y-2">
            <label className="text-sm font-medium block">Start a group</label>
            <input
              className="input"
              placeholder="Group name"
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
            />
            <button type="submit" className="btn-secondary w-full">
              Create group
            </button>
          </form>

          <form onSubmit={handleJoinGroup} className="card p-4 space-y-2">
            <label className="text-sm font-medium block">Join with a code</label>
            <input
              className="input uppercase"
              placeholder="INVITE CODE"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value)}
            />
            <button type="submit" className="btn-secondary w-full">
              Join group
            </button>
          </form>

          {groupError && <p className="text-ember text-sm">{groupError}</p>}
        </aside>
      </main>
    </div>
  );
}
