import { startOfDay, subDays, isSameDay, differenceInCalendarDays } from "date-fns";


export function toDayKey(date: Date): Date {
  const d = startOfDay(date);
  return new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
}


export function calculateStreaks(checkInDates: Date[]): {
  current: number;
  longest: number;
} {
  if (checkInDates.length === 0) return { current: 0, longest: 0 };

  const days = Array.from(
    new Set(checkInDates.map((d) => toDayKey(d).getTime()))
  )
    .sort((a, b) => b - a)
    .map((t) => new Date(t));


  const today = toDayKey(new Date());
  let current = 0;
  let cursor = today;

  if (!days.some((d) => isSameDay(d, today))) {
    cursor = subDays(today, 1);
  }

  for (const day of days) {
    if (isSameDay(day, cursor)) {
      current += 1;
      cursor = subDays(cursor, 1);
    } else if (day.getTime() < cursor.getTime()) {
      break;
    }
  }


  let longest = 1;
  let run = 1;
  for (let i = 1; i < days.length; i++) {
    const gap = differenceInCalendarDays(days[i - 1], days[i]);
    if (gap === 1) {
      run += 1;
    } else {
      longest = Math.max(longest, run);
      run = 1;
    }
  }
  longest = Math.max(longest, run, current);

  return { current, longest };
}

export function lastNDays(n: number): Date[] {
  const today = toDayKey(new Date());
  return Array.from({ length: n }, (_, i) => subDays(today, n - 1 - i));
}
