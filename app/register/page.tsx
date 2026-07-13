"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ name, email, password }),
    });
    const data = await res.json();

    if(!res.ok) {
      setError(data.error || "Something went wrong");
      setLoading(false);
      return;
    }

    const signInRes = await signIn("credentials", { email, password, redirect: false });
    setLoading(false);
    
    if(signInRes?.error) {
      setError("Account created but failed to sign in. Please try logging in.");
      return; 
    }
    router.push("/dashboard");
    router.refresh();

  }
  return (
        <main className="min-h-screen flex items-center justify-center bg-green-100 px-6">
      <div className="w-full max-w-sm">
        <h1 className="font-display italic text-3xl mb-2">Plant your first habit</h1>
        <p className="text-ink/60 text-sm mb-8">It takes about thirty seconds.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium block mb-1">Name</label>
            <input
              type="text"
              required
              className="input"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
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
              minLength={8}
              className="input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <p className="text-xs text-ink/50 mt-1">At least 8 characters.</p>
          </div>
          {error && <p className="text-ember text-sm">{error}</p>}
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? "Creating account…" : "Create account"}
          </button>
        </form>

        <p className="text-sm text-ink/60 mt-6 text-center">
          Already have an account?{" "}
          <Link href="/login" className="text-moss font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );

}