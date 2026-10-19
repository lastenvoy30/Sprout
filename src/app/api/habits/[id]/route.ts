import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  _req: Request,
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

  // Check-ins are removed automatically (onDelete: Cascade in your schema).
  await prisma.habit.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}