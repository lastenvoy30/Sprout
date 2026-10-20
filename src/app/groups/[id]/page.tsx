"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Navbar from "@/components/Navbar";
import type { Group } from "@/types/models";

export default function GroupPage() {
  const { id } = useParams<{ id: string }>();
  const { status } = useSession();
  const router = useRouter();

  const [group, setGroup] = useState<Group | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  const loadGroup = useCallback(async () => {
    const res = await fetch(`/api/groups/${id}`);
    if (res.ok) {
      setGroup((await res.json()).group);
    } else if (res.status === 403 || res.status === 404) {
      router.push("/dashboard");
      return;
    }
    setLoading(false);
  }, [id, router]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }
    if (status === "authenticated") {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- fetch-on-mount is intentional here
      void loadGroup();
    }
  }, [status, router, loadGroup]);

  async function copyInviteCode() {
    if (!group) return;
    try {
      await navigator.clipboard.writeText(group.inviteCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard can be blocked; the code is visible on the button anyway
    }
  }

  if (status !== "authenticated" || loading || !group) {
    return (
      <div className="min-h-screen flex items-center justify-center text-ink/50 bg-paper">
        Loading…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-paper">
      <Navbar />
      <main className="max-w-3xl mx-auto px-6 py-10 space-y-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="font-display italic text-3xl">{group.name}</h1>
            <p className="text-sm text-ink/50 mt-1">
              {group.memberships.length} member
              {group.memberships.length === 1 ? "" : "s"}
            </p>
          </div>
          <button onClick={copyInviteCode} className="btn-secondary">
            {copied ? "Copied!" : `Invite code: ${group.inviteCode}`}
          </button>
        </div>

        <section>
          <h2 className="font-display italic text-xl mb-3">Members</h2>
          <div className="space-y-2">
            {group.memberships.map((m) => (
              <div key={m.id} className="card p-4 text-sm font-medium">
                {m.user.name}
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}