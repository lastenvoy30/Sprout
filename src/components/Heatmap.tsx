"use client";

import { lastNDays, toDayKey } from "@/lib/streaks";
import { isSameDay, format } from "date-fns";

export default function Heatmap({
  checkInDates,
  color,
  weeks = 12,
}: {
  checkInDates: Date[];
  color: string;
  weeks?: number;
}) {
  const days = lastNDays(weeks * 7);
  const dayKeys = new Set(checkInDates.map((d) => toDayKey(d).getTime()));

  // Group into columns of 7 (weeks), oldest week first.
  const columns: Date[][] = [];
  for (let i = 0; i < days.length; i += 7) {
    columns.push(days.slice(i, i + 7));
  }

  return (
    <div className="flex gap-[3px]" title="Last 12 weeks">
      {columns.map((week, wi) => (
        <div key={wi} className="flex flex-col gap-[3px]">
          {week.map((day, di) => {
            const active = dayKeys.has(day.getTime());
            const isToday = isSameDay(day, new Date());
            return (
              <div
                key={di}
                title={`${format(day, "MMM d")}${active ? " — done" : ""}`}
                className={`w-[9px] h-[9px] rounded-[2px] ${isToday ? "ring-1 ring-ink/30" : ""}`}
                style={{
                  backgroundColor: active ? color : "#e2e5db",
                }}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}
