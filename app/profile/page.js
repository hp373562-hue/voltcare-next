import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getConsumerSession } from "../lib/session";
import { prisma } from "../lib/prisma";
import Link from "next/link";
import ThemeToggle from "../components/theme-toggle";

export default async function ProfilePage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("voltcare_consumer")?.value;
  const session = await getConsumerSession(token);

  if (!session) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { consumerNumber: session.consumerNumber }
  });

  if (!user) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-[#05070e] px-4 py-12 text-slate-800 dark:text-white sm:px-8 bg-grid cyber-font relative overflow-hidden transition-colors duration-300">
      <div className="scanline"></div>
      <div className="hidden dark:block fixed inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,rgba(0,242,254,0.05),transparent_70%)]"></div>

      <div className="mx-auto max-w-3xl relative z-10">
        <div className="mb-8 flex justify-between items-center">
          <Link href="/" className="text-blue-600 dark:text-cyan-400 hover:text-blue-800 dark:hover:text-cyan-300 uppercase tracking-widest text-xs font-bold flex items-center gap-2">
            {`{<}`} Return to Dashboard
          </Link>
          <ThemeToggle />
        </div>

        <section className="hud-panel p-8">
          <div className="flex items-center gap-3 mb-8 border-b border-blue-200 dark:border-cyan-500/20 pb-4">
            <div className="w-2 h-6 bg-blue-600 dark:bg-cyan-400 animate-pulse"></div>
            <h1 className="text-2xl font-bold text-blue-800 dark:text-cyan-300 uppercase tracking-widest">Consumer Profile</h1>
          </div>

          <div className="grid gap-8 sm:grid-cols-2">
            <div>
              <p className="text-xs text-slate-500 dark:text-cyan-600 uppercase tracking-widest mb-1 font-bold">Registered Name</p>
              <p className="text-xl font-bold text-slate-800 dark:text-white uppercase">{user.name}</p>
            </div>
            
            <div>
              <p className="text-xs text-slate-500 dark:text-cyan-600 uppercase tracking-widest mb-1 font-bold">Consumer Number (ID)</p>
              <p className="text-xl font-bold text-blue-700 dark:text-cyan-300 tracking-widest">{user.consumerNumber}</p>
            </div>

            <div>
              <p className="text-xs text-slate-500 dark:text-cyan-600 uppercase tracking-widest mb-1 font-bold">System Join Date</p>
              <p className="text-md text-slate-600 dark:text-slate-300 uppercase font-semibold">{new Date(user.createdAt).toLocaleDateString()}</p>
            </div>

            <div>
              <p className="text-xs text-slate-500 dark:text-cyan-600 uppercase tracking-widest mb-1 font-bold">Clearance Level</p>
              <p className="text-md text-emerald-600 dark:text-emerald-400 uppercase font-bold tracking-widest">Standard Consumer</p>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-blue-200 dark:border-cyan-500/20">
            <h3 className="text-lg font-bold text-blue-800 dark:text-cyan-400 uppercase tracking-widest mb-4">Account Security</h3>
            <form action="/api/consumer/logout" method="POST">
              <button className="bg-red-50 dark:bg-red-500/10 border border-red-500 px-6 py-3 text-sm font-bold text-red-600 dark:text-red-400 hover:bg-red-500 hover:text-white dark:hover:text-black transition-colors uppercase tracking-widest dark:shadow-[0_0_10px_rgba(239,68,68,0.2)] rounded-xl dark:rounded-none">
                Terminate Session (Logout)
              </button>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}
