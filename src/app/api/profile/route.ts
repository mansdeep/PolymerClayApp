import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

function str(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

export async function PUT(request: Request) {
  const current = await getCurrentUser();
  if (!current) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const data = body as Record<string, unknown>;
  const name = str(data.name);
  const phone = str(data.phone);
  const address = str(data.address);

  if (!name || !phone || !address) {
    return NextResponse.json(
      { error: "Name, phone, and address are required." },
      { status: 400 },
    );
  }

  const user = await prisma.user.update({
    where: { id: current.id },
    data: { name, phone, address },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      address: true,
      createdAt: true,
    },
  });

  return NextResponse.json({ user });
}
