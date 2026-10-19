import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { fromDateString } from "@/lib/streaks";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  const { id } = await params;

  const habit = await prisma.habit.findUnique({ where: { id } });
  if (!habit || habit.userId !== session.user.id) {
    return NextResponse.json({ error: "Habit not found." }, { status: 404 });
  }

  const body = await req.json().catch(() => ({}));
  const dateStr: unknown = body?.date;
  if (typeof dateStr !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    return NextResponse.json(
      { error: "A date in YYYY-MM-DD format is required." },
      { status: 400 }
    );
  }
  const date = fromDateString(dateStr);

  const existing = await prisma.checkIn.findUnique({
    where: { habitId_date: { habitId: id, date } },
  });

  if (existing) {
    await prisma.checkIn.delete({ where: { id: existing.id } });
    return NextResponse.json({ checkedIn: false });
  }

  await prisma.checkIn.create({
    data: { habitId: id, userId: session.user.id, date },
  });
  return NextResponse.json({ checkedIn: true });
}