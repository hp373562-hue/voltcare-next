import { cookies } from "next/headers";
import { createAdminSession } from "../../../lib/session";

export async function POST(request) {
  if (!process.env.ADMIN_USERNAME || !process.env.ADMIN_PASSWORD) {
    return Response.json(
      { error: "Set ADMIN_USERNAME and ADMIN_PASSWORD in .env.local." },
      { status: 500 }
    );
  }

  const { username, password } = await request.json();

  if (
    username !== process.env.ADMIN_USERNAME ||
    password !== process.env.ADMIN_PASSWORD
  ) {
    return Response.json(
      { error: "Incorrect admin username or password." },
      { status: 401 }
    );
  }

  const token = await createAdminSession(username);
  const cookieStore = await cookies();

  cookieStore.set("voltcare_admin", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8,
  });

  return Response.json({ success: true });
}