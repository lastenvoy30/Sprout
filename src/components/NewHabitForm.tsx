"use client";

import { useState } from "react";
import type { Frequency } from "@/types/models";

const EMOJI_OPTIONS = ["✅", "💧", "🏃", "📚", "🧘", "🥗", "😴", "✍️"];
const COLOR_OPTIONS = ["#2f5233", "#c17a3f", "#4a7a4f", "#6b5b95", "#3a6ea5"];

export default function NewHabitForm({
  onCreated,
  onCancel,
}: {
  onCreated: () => void;
  onCancel: () => void;
}) {
  const [title, setTitle] = useState("");
  const [emoji, setEmoji] = useState(EMOJI_OPTIONS[0]);
  const [color, setColor] = useState(COLOR_OPTIONS[0]);
  const [frequency, setFrequency] = useState<Frequency>("DAILY");
  const [targetCount, setTargetCount] = useState(3);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!title.trim()) {
      setError("Give the habit a name.");
      return;
    }
    setLoading(true);
    const res = await fetch("/api/habits", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, emoji, color, frequency, targetCount }),
    });
    setLoading(false);
    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Couldn't create the habit.");
      return;
    }
    onCreated();
  }

  return (
    <form onSubmit={handleSubmit} className="card p-5 space-y-4">
      <div>
        <label className="text-sm font-medium block mb-1">What&apos;s the habit?</label>
        <input
          className="input"
          placeholder="e.g. Read 10 pages"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          autoFocus
        />
      </div>

      <div>
        <label className="text-sm font-medium block mb-1">Icon</label>
        <div className="flex gap-2">
          {EMOJI_OPTIONS.map((e) => (
            <button
              type="button"
              key={e}
              onClick={() => setEmoji(e)}
              className={`w-9 h-9 rounded-card flex items-center justify-center text-lg border ${
                emoji === e ? "border-moss bg-sand" : "border-sand"
              }`}
            >
              {e}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-sm font-medium block mb-1">Color</label>
        <div className="flex gap-2">
          {COLOR_OPTIONS.map((c) => (
            <button
              type="button"
              key={c}
              onClick={() => setColor(c)}
              className={`w-7 h-7 rounded-full border-2 ${
                color === c ? "border-ink" : "border-transparent"
              }`}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
      </div>

      <div>
        <label className="text-sm font-medium block mb-1">How often?</label>
        <div className="flex gap-2 flex-wrap items-center">
          {(["DAILY", "WEEKDAYS", "X_PER_WEEK"] as Frequency[]).map((f) => (
            <button
              type="button"
              key={f}
              onClick={() => setFrequency(f)}
              className={`text-sm px-3 py-1.5 rounded-card border ${
                frequency === f ? "border-moss bg-sand" : "border-sand"
              }`}
            >
              {f === "DAILY" ? "Every day" : f === "WEEKDAYS" ? "Weekdays" : "X times / week"}
            </button>
          ))}
          {frequency === "X_PER_WEEK" && (
            <input
              type="number"
              min={1}
              max={7}
              value={targetCount}
              onChange={(e) => setTargetCount(Number(e.target.value))}
              className="input w-16"
            />
          )}
        </div>
      </div>

      {error && <p className="text-ember text-sm">{error}</p>}

      <div className="flex gap-3 pt-1">
        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? "Creating…" : "Create habit"}
        </button>
        <button type="button" onClick={onCancel} className="btn-secondary">
          Cancel
        </button>
      </div>
    </form>
  );
}
