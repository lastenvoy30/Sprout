"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";

export default function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();

  const linkClass = (href: string) =>
    `text-sm font-medium transition-colors ${
      pathname === href ? "text-moss" : "text-ink/60 hover:text-ink"
    }`;

  return (
    <nav className="border-b border-sand bg-paper/80 backdrop-blur sticky top-0 z-10">
      <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/dashboard" className="font-display italic text-xl">
          Sprout
        </Link>
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className={linkClass("/dashboard")}>
            My habits
          </Link>
          {session?.user?.name && (
            <span className="text-sm text-ink/50 hidden sm:inline">
              {session.user.name}
            </span>
          )}
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="text-sm font-medium text-ink/60 hover:text-ink"
          >
            Sign out
          </button>
        </div>
      </div>
    </nav>
  );
}
