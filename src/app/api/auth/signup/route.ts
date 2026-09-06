import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { hashPassword, startSession } from "@/lib/auth";

function str(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const data = body as Record<string, unknown>;
  const name = str(data.name);
  const email = str(data.email).toLowerCase();
  const phone = str(data.phone);
  const address = str(data.address);
  const password = typeof data.password === "string" ? data.password : "";

  if (!name || !email || !phone || !address) {
    return NextResponse.json(
      { error: "Name, email, phone, and address are all required." },
      { status: 400 },
    );
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  }
  if (password.length < 8) {
    return NextResponse.json(
      { error: "Password must be at least 8 characters." },
      { status: 400 },
    );
  }

  try {
    const user = await prisma.user.create({
      data: { name, email, phone, address, passwordHash: await hashPassword(password) },
      select: { id: true },
    });
    await startSession(user.id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        { error: "An account with that email already exists." },
        { status: 409 },
      );
    }
    console.error("signup error", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
