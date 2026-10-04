import { cookies } from "next/headers";
import { createConsumerSession } from "../../../lib/session";
import { prisma } from "../../../lib/prisma";

export async function POST(request) {
  try {
    const { name, consumerNumber, password } = await request.json();

    if (!name || !consumerNumber || !password) {
      return Response.json({ error: "Missing fields" }, { status: 400 });
    }

    if (!/^[0-9]{12}$/.test(consumerNumber.trim())) {
      return Response.json({ error: "Consumer number must be 12 digits" }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({
      where: { consumerNumber }
    });
    
    if (existingUser) {
      return Response.json({ error: "Account already exists" }, { status: 400 });
    }

    await prisma.user.create({
      data: { name, consumerNumber, password }
    });

    const token = await createConsumerSession(consumerNumber);
    const cookieStore = await cookies();

    cookieStore.set("voltcare_consumer", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });

    return Response.json({ success: true });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Internal error" }, { status: 500 });
  }
}
