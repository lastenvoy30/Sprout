"use client";

import { useState } from "react";
import Heatmap from "@/components/Heatmap";
import { calculateStreaks, dayNumberOf, todayDayNumber } from "@/lib/streaks";
import type { Habit } from "@/types/models";

export default function HabitCard({
  habit,
  onToggle,
  onDelete,
}: {
  habit: Habit;
  onToggle: (habitId: string) => Promise<void>;
  onDelete: (habitId: string) => Promise<void> | void;
}) {
  const [busy, setBusy] = useState(false);

  const dates = habit.checkIns.map((c) => new Date(c.date));
  const { current, longest } = calculateStreaks(dates);
  const doneToday = dates.some((d) => dayNumberOf(d) === todayDayNumber());

  async function handleToggle() {
    setBusy(true);
    try {
      await onToggle(habit.id);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="card p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <span className="text-2xl leading-none">{habit.emoji}</span>
          <h3 className="font-semibold">{habit.title}</h3>
        </div>

        <button
          onClick={handleToggle}
          disabled={busy}
          className={doneToday ? "btn-primary shrink-0" : "btn-secondary shrink-0"}
        >
          {doneToday ? "Done today ✓" : "Mark done"}
        </button>
      </div>

      <div className="flex gap-6 mt-4">
        <div>
          <p className="text-xs text-ink/50">Current streak</p>
          <p className="font-display italic text-lg">
            {current} day{current === 1 ? "" : "s"}
          </p>
        </div>
        <div>
          <p className="text-xs text-ink/50">Best streak</p>
          <p className="font-display italic text-lg">
            {longest} day{longest === 1 ? "" : "s"}
          </p>
        </div>
      </div>

      <div className="mt-4">
        <Heatmap checkInDates={dates} color={habit.color} />
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