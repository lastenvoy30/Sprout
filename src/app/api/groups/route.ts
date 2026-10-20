import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { randomBytes } from "crypto";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  const memberships = await prisma.groupMembership.findMany({
    where: { userId: session.user.id },
    orderBy: { joinedAt: "asc" },
    include: {
      group: {
        include: {
          memberships: {
            include: { user: { select: { id: true, name: true } } },
          },
        },
      },
    },
  });

  return NextResponse.json({ groups: memberships.map((m) => m.group) });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const name = typeof body?.name === "string" ? body.name.trim() : "";
  if (!name) {
    return NextResponse.json({ error: "Give the group a name." }, { status: 400 });
  }

  const group = await prisma.group.create({
    data: {
      name,
      inviteCode: randomBytes(4).toString("hex").toUpperCase(),
      memberships: { create: { userId: session.user.id } },
    },
  });

  return NextResponse.json({ group }, { status: 201 });
}