import ComplaintForm from "./complaint-form";
import ComplaintTracker from "./complaint-tracker";
import ServiceForm from "./service-form";
import OfficialServices from "./official-services";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getConsumerSession } from "./lib/session";
import { readFile } from "node:fs/promises";
import path from "node:path";

const services = [
  ["⚡", "Power outage", "Report a supply issue"],
  ["💸", "Bills & payments", "View your electricity bill"],
  ["⚠️", "Complaints", "Register or track an issue"],
  ["🔌", "Other services", "Connection and meter help"],
];

export default async function Home() {
  const cookieStore = await cookies();
  const token = cookieStore.get("voltcare_consumer")?.value;
  const session = await getConsumerSession(token);

  if (!session) {
    redirect("/login");
  }

  const usersPath = path.join(process.cwd(), "data", "users.json");
  const users = JSON.parse(await readFile(usersPath, "utf8"));
  const user = users.find((u) => u.consumerNumber === session.consumerNumber);

  if (!user) {
    redirect("/login");
  }

  // Count open requests for this consumer
  const requestsPath = path.join(process.cwd(), "data", "requests.json");
  let openRequestsCount = 0;
  try {
    const requests = JSON.parse(await readFile(requestsPath, "utf8"));
    openRequestsCount = requests.filter(r => r.consumerNumber === user.consumerNumber && r.status !== "Resolved").length;
  } catch (err) {
    // ignore
  }

  return (
    <main id="home" className="min-h-screen bg-[#080d18] px-4 pb-24 text-white sm:px-8">
      <header className="mx-auto flex max-w-6xl items-center justify-between py-6">
        <div className="flex items-center gap-3">
          <div className="grid size-10 place-items-center rounded-xl bg-cyan-300 text-xl text-slate-950">
            ⚡
          </div>
          <div>
            <h1 className="font-bold">VoltCare</h1>
            <p className="text-xs text-slate-400">MSEDCL consumer help</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="rounded-full border border-cyan-300/30 px-3 py-2 text-xs text-cyan-300">
            {user.consumerNumber}
          </span>
          <form action="/api/consumer/logout" method="POST">
            <button className="text-xs text-slate-400 hover:text-white">Logout</button>
          </form>
        </div>
      </header>

      <div className="mx-auto max-w-6xl">
        <section className="py-8">
          <p className="text-sm uppercase tracking-widest text-cyan-300">
            Your electricity, made simpler
          </p>
          <h2 className="mt-3 text-3xl font-bold sm:text-5xl">
            Good day, {user.name}.
          </h2>
          <p className="mt-3 text-sm text-slate-400">
            Manage bills, complaints, and service requests in one place.
          </p>
        </section>

        <section className="grid gap-4 sm:grid-cols-3">
          <article className="rounded-2xl border border-white/10 bg-slate-900 p-5">
            <p className="text-sm text-slate-400">Connection status</p>
            <p className="mt-3 text-2xl font-bold text-emerald-300">Active</p>
            <p className="mt-2 text-xs text-slate-500">Account verified</p>
          </article>

          <article className="rounded-2xl border border-white/10 bg-slate-900 p-5">
            <p className="text-sm text-slate-400">Current bill A— sample</p>
            <p className="mt-3 text-2xl font-bold">₹1,486.20</p>
            <p className="mt-2 text-xs text-slate-500">Due 05 October 2026</p>
          </article>

          <article className="rounded-2xl border border-white/10 bg-slate-900 p-5">
            <p className="text-sm text-slate-400">Open requests</p>
            <p className="mt-3 text-2xl font-bold">{openRequestsCount}</p>
            <p className="mt-2 text-xs text-slate-500">Associated with your account</p>
          </article>
        </section>

        <section id="services" className="mt-8">
          <h3 className="text-lg font-bold">What do you need help with?</h3>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {services.map(([icon, title, description]) => (
              <a
                key={title}
                href="#support"
                className="rounded-2xl border border-white/10 bg-slate-900 p-5 transition hover:border-cyan-300/40"
              >
                <span className="text-2xl text-cyan-300">{icon}</span>
                <h4 className="mt-4 font-semibold">{title}</h4>
                <p className="mt-1 text-xs text-slate-400">{description}</p>
              </a>
            ))}
          </div>
        </section>
        
        <section id="support" className="mt-8 rounded-2xl border border-cyan-300/20 bg-cyan-300/5 p-5">
          <OfficialServices />
          <ComplaintForm defaultName={user.name} defaultNumber={user.consumerNumber} />
          <ComplaintTracker />
          <ServiceForm />
          <p className="font-semibold mt-8">Need urgent help?</p>
          <p className="mt-1 text-sm text-slate-400">
            For official MSEDCL assistance, call the consumer helpline.
          </p>
          <a
            href="tel:1912"
            className="mt-4 inline-block rounded-xl bg-cyan-300 px-4 py-3 text-sm font-bold text-slate-950"
          >
            Call 1912
          </a>
        </section>

        <p className="mt-8 text-center text-xs text-slate-500">
          VoltCare is a student project prototype. Bill and account details are sample data.
        </p>
      </div>
    </main>
  );
}