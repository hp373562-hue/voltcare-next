import { cookies } from "next/headers";
import { createConsumerSession } from "../../../lib/session";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const usersPath = path.join(process.cwd(), "data", "users.json");

export async function POST(request) {
  try {
    const { name, consumerNumber, password } = await request.json();

    if (!name || !consumerNumber || !password) {
      return Response.json({ error: "Missing fields" }, { status: 400 });
    }

    if (!/^[0-9]{12}$/.test(consumerNumber.trim())) {
      return Response.json({ error: "Consumer number must be 12 digits" }, { status: 400 });
    }

    const users = JSON.parse(await readFile(usersPath, "utf8"));
    
    if (users.find((u) => u.consumerNumber === consumerNumber)) {
      return Response.json({ error: "Account already exists" }, { status: 400 });
    }

    const newUser = { name, consumerNumber, password };
    users.push(newUser);
    await writeFile(usersPath, JSON.stringify(users, null, 2));

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
