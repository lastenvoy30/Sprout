import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const code = typeof body?.inviteCode === "string" ? body.inviteCode.trim().toUpperCase() : "";
  if (!code) {
    return NextResponse.json({ error: "Enter an invite code." }, { status: 400 });
  }

  const group = await prisma.group.findUnique({ where: { inviteCode: code } });
  if (!group) {
    return NextResponse.json({ error: "No group found with that code." }, { status: 404 });
  }

  const existing = await prisma.groupMembership.findUnique({
    where: { groupId_userId: { groupId: group.id, userId: session.user.id } },
  });
  if (existing) {
    return NextResponse.json({ error: "You're already in this group." }, { status: 409 });
  }

  await prisma.groupMembership.create({
    data: { groupId: group.id, userId: session.user.id },
  });

  return NextResponse.json({ group }, { status: 201 });
}