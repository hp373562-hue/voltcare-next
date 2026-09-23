import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getAdminSession } from "../lib/session";
import AdminQueue from "./admin-queue";
import LogoutButton from "./logout-button";

export default async function AdminPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("voltcare_admin")?.value;
  const admin = await getAdminSession(token);

  if (!admin) {
    redirect("/admin/login");
  }

  return (
    <main className="min-h-screen bg-[#080d18] px-4 py-8 text-white sm:px-8">
      <div className="mx-auto max-w-5xl">
        <a href="/" className="text-sm text-cyan-300">
          ← Back to VoltCare
        </a>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Admin dashboard</h1>
            <p className="mt-2 text-sm text-slate-400">
              Signed in as <strong className="text-cyan-300">{admin.username}</strong>
            </p>
          </div>

          <LogoutButton />
        </div>

        <AdminQueue />
      </div>
    </main>
  );
}