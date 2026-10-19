const DAY_MS = 24 * 60 * 60 * 1000;

export function toDateString(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function fromDateString(str: string): Date {
  return new Date(`${str}T00:00:00.000Z`);
}

function dayNumber(date: Date): number {
  return Math.floor(date.getTime() / DAY_MS);
}

export function todayDayNumber(): number {
  return dayNumber(fromDateString(toDateString(new Date())));
}

export function dayNumberOf(date: Date): number {
  return dayNumber(date);
}

export function dayNumberToDate(num: number): Date {
  return new Date(num * DAY_MS);
}

export function lastNDayNumbers(n: number): number[] {
  const today = todayDayNumber();
  return Array.from({ length: n }, (_, i) => today - (n - 1 - i));
}

export function calculateStreaks(checkInDates: Date[]): {
  current: number;
  longest: number;
} {
  if (checkInDates.length === 0) return { current: 0, longest: 0 };

  const days = new Set(checkInDates.map(dayNumber));
  const today = todayDayNumber();

  let current = 0;
  let cursor = days.has(today) ? today : today - 1;
  while (days.has(cursor)) {
    current++;
    cursor--;
  }

  const sorted = Array.from(days).sort((a, b) => a - b);
  let longest = 1;
  let run = 1;
  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i] - sorted[i - 1] === 1) {
      run++;
      longest = Math.max(longest, run);
    } else {
      run = 1;
    }
  }

  return { current, longest: Math.max(longest, current) };
}