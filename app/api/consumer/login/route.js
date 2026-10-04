import { cookies } from "next/headers";
import { createConsumerSession } from "../../../lib/session";
import { prisma } from "../../../lib/prisma";

export async function POST(request) {
  try {
    const { consumerNumber, password } = await request.json();

    if (!consumerNumber || !password) {
      return Response.json({ error: "Missing fields" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { consumerNumber }
    });
    
    if (!user || user.password !== password) {
      return Response.json({ error: "Invalid credentials" }, { status: 401 });
    }

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
