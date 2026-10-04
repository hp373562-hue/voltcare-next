import { cookies } from "next/headers";
import { createConsumerSession } from "../../../lib/session";
import { readFile } from "node:fs/promises";
import path from "node:path";

const usersPath = path.join(process.cwd(), "data", "users.json");

export async function POST(request) {
  try {
    const { consumerNumber, password } = await request.json();

    if (!consumerNumber || !password) {
      return Response.json({ error: "Missing fields" }, { status: 400 });
    }

    const users = JSON.parse(await readFile(usersPath, "utf8"));
    const user = users.find((u) => u.consumerNumber === consumerNumber && u.password === password);

    if (!user) {
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
    return Response.json({ error: "Internal error" }, { status: 500 });
  }
}
