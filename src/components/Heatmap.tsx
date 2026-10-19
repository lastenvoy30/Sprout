"use client";

import { lastNDayNumbers, dayNumberOf, dayNumberToDate } from "@/lib/streaks";

export default function Heatmap({
  checkInDates,
  color,
  weeks = 12,
}: {
  checkInDates: Date[];
  color: string;
  weeks?: number;
}) {
  const days = lastNDayNumbers(weeks * 7);
  const done = new Set(checkInDates.map(dayNumberOf));

  const columns: number[][] = [];
  for (let i = 0; i < days.length; i += 7) columns.push(days.slice(i, i + 7));

  return (
    <div className="flex gap-[3px]" aria-label={`Last ${weeks} weeks`}>
      {columns.map((week, wi) => (
        <div key={wi} className="flex flex-col gap-[3px]">
          {week.map((day) => {
            const active = done.has(day);
            const label = dayNumberToDate(day).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              timeZone: "UTC",
            });
            return (
              <div
                key={day}
                title={`${label}${active ? " - done" : ""}`}
                className="w-[10px] h-[10px] rounded-[2px] bg-sand"
                style={active ? { backgroundColor: color } : undefined}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}