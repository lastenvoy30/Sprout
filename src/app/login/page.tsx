"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn("credentials", { email , password, redirect: false });
    setLoading(false);

    if (result?.error) {
      setError(result.error);
      return;
    }
    router.push("/dashboard");
    router.refresh(); 
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-green-100 px-6">
      <div className="w-full max-w-sm">
        <h1 className="font-display italic text-3xl mb-2">Welcome back</h1>
        <p className="text-ink/60 text-sm mb-8">Sign in to keep your streak alive.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium block mb-1">Email</label>
            <input
              type="email"
              required
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm font-medium block mb-1">Password</label>
            <input
              type="password"
              required
              className="input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && <p className="text-ember text-sm">{error}</p>}
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <p className="text-sm text-ink/60 mt-6 text-center">
          New here?{" "}
          <Link href="/register" className="text-moss font-medium">
            Create an account
          </Link>
        </p>
      </div>
    </main>
  );
}
