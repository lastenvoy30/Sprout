import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Not signed in." }, { status: 401 });

  const habits = await prisma.habit.findMany({
    where: { userId: session.user.id, archived: false },
    include: { checkIns: { orderBy: { date: "desc" }, take: 90 } },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json({ habits });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Not signed in." }, { status: 401 });

  const { title, emoji, color, frequency, targetCount } = await req.json();
  if (!title || typeof title !== "string" || !title.trim()) {
    return NextResponse.json({ error: "Give the habit a title." }, { status: 400 });
  }

  const habit = await prisma.habit.create({
    data: {
      title: title.trim(),
      emoji: emoji || "✅",
      color: color || "#6366f1",
      frequency: frequency || "DAILY",
      targetCount: frequency === "X_PER_WEEK" ? Number(targetCount) || 3 : null,
      userId: session.user.id,
    },
  });

  return NextResponse.json({ habit }, { status: 201 });
}
