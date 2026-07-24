"use client";

import { useState } from "react";
import Heatmap from "./Heatmap";
import { calculateStreaks, toDayKey } from "@/lib/streaks";
import type { Habit } from "@/types/models";

const FREQUENCY_LABEL: Record<string, string> = {
  DAILY: "Every day",
  WEEKDAYS: "Weekdays",
  X_PER_WEEK: "times / week",
};

export default function HabitCard({
  habit,
  onToggle,
  onDelete,
}: {
  habit: Habit;
  onToggle: (habitId: string) => Promise<void>;
  onDelete: (habitId: string) => void;
}) {
  const [busy, setBusy] = useState(false);
  const checkInDates = habit.checkIns.map((c) => new Date(c.date));
  const { current, longest } = calculateStreaks(checkInDates);

  const todayKey = toDayKey(new Date()).getTime();
  const doneToday = checkInDates.some((d) => toDayKey(d).getTime() === todayKey);

  const frequencyLabel =
    habit.frequency === "X_PER_WEEK"
      ? `${habit.targetCount ?? 3} ${FREQUENCY_LABEL.X_PER_WEEK}`
      : FREQUENCY_LABEL[habit.frequency];

  async function handleToggle() {
    setBusy(true);
    await onToggle(habit.id);
    setBusy(false);
  }

  return (
    <div className="card p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <span className="text-2xl leading-none mt-0.5">{habit.emoji}</span>
          <div>
            <h3 className="font-semibold text-ink">{habit.title}</h3>
            <p className="text-xs text-ink/50">{frequencyLabel}</p>
          </div>
        </div>

        <button
          onClick={handleToggle}
          disabled={busy}
          className={`shrink-0 text-sm font-medium px-4 py-2 rounded-card transition-colors ${
            doneToday
              ? "bg-moss text-paper hover:bg-mosslight"
              : "bg-white border border-sand hover:border-moss"
          }`}
        >
          {doneToday ? "Done today ✓" : "Mark done"}
        </button>
      </div>

      <div className="flex items-center gap-6 mt-4">
        <div>
          <p className="text-xs text-ink/50">Current streak</p>
          <p className="font-display text-lg italic">{current} day{current === 1 ? "" : "s"}</p>
        </div>
        <div>
          <p className="text-xs text-ink/50">Best streak</p>
          <p className="font-display text-lg italic">{longest} day{longest === 1 ? "" : "s"}</p>
        </div>
      </div>

      <div className="mt-4">
        <Heatmap checkInDates={checkInDates} color={habit.color} />
      </div>

      <div className="flex justify-end mt-3">
        <button
          onClick={() => onDelete(habit.id)}
          className="text-xs text-ink/40 hover:text-ember"
        >
          Delete habit
        </button>
      </div>
    </div>
  );
}
