import ComplaintForm from "./complaint-form";
import ComplaintTracker from "./complaint-tracker";
import ServiceForm from "./service-form";
import OfficialServices from "./official-services";
import ThemeToggle from "./components/theme-toggle";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getConsumerSession } from "./lib/session";
import { prisma } from "./lib/prisma";

const services = [
  [
    <svg key="1" className="size-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>,
    "Report Outage",
    "Power outage report & telemetry"
  ],
  [
    <svg key="2" className="size-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    "Bills & Payments",
    "View electricity bill nodes"
  ],
  [
    <svg key="3" className="size-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>,
    "Complaints",
    "Register anomalies & issues"
  ],
  [
    <svg key="4" className="size-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>,
    "Other Services",
    "Connection & hardware diagnostic"
  ],
];

export default async function Home() {
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

  const openRequestsCount = await prisma.complaint.count({
    where: {
      consumerNumber: user.consumerNumber,
      status: { not: "Resolved" }
    }
  });

  return (
    <main id="home" className="min-h-screen bg-slate-50 dark:bg-[#05070e] px-4 pb-24 text-slate-800 dark:text-white sm:px-8 bg-grid cyber-font relative overflow-hidden transition-colors duration-300">
      <div className="scanline"></div>
      <div className="hidden dark:block fixed inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,rgba(0,242,254,0.05),transparent_70%)]"></div>

      <header className="mx-auto flex max-w-6xl items-center justify-between py-6 relative z-10 border-b border-blue-200 dark:border-cyan-500/30">
        <div className="flex items-center gap-3">
          <div className="grid size-10 place-items-center rounded-xl dark:rounded-sm bg-blue-600 dark:bg-cyan-500/20 border border-blue-700 dark:border-cyan-400 text-xl text-white dark:text-cyan-300 shadow-sm dark:shadow-[0_0_10px_rgba(0,242,254,0.5)]">
            <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
          </div>
          <div>
            <h1 className="font-bold text-blue-700 dark:text-cyan-300 tracking-wide dark:tracking-[0.2em] text-xl">
              <span className="dark:hidden">MSEDCL VoltCare</span>
              <span className="hidden dark:inline">ENERGY CORE MATRIX</span>
            </h1>
            <p className="text-xs text-slate-500 dark:text-cyan-500/70 tracking-widest">
              <span className="dark:hidden">Official Consumer Portal</span>
              <span className="hidden dark:inline">// STATUS: SYNCHRONIZED</span>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="hidden lg:flex gap-2">
            <span className="bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-[10px] px-2 py-0.5 border border-emerald-200 dark:border-emerald-500/50 rounded dark:rounded-none">SECURE</span>
            <span className="bg-blue-100 dark:bg-cyan-500/20 text-blue-700 dark:text-cyan-400 text-[10px] px-2 py-0.5 border border-blue-200 dark:border-cyan-500/50 rounded dark:rounded-none">ID: {user.consumerNumber}</span>
          </div>
          
          <ThemeToggle />

          <a href="/profile" className="text-xs text-blue-600 dark:text-cyan-400 hover:text-blue-800 dark:hover:text-white uppercase tracking-widest bg-blue-50 dark:bg-cyan-900/40 px-3 py-1.5 border border-blue-200 dark:border-cyan-500/50 rounded-lg dark:rounded-none ml-2 font-semibold">
            Profile
          </a>
          <form action="/api/consumer/logout" method="POST">
            <button className="text-xs text-slate-500 dark:text-cyan-400 hover:text-slate-800 dark:hover:text-white uppercase tracking-widest font-semibold ml-2">Logout</button>
          </form>
        </div>
      </header>

      <div className="mx-auto max-w-6xl relative z-10">
        <section className="py-12">
          <p className="text-sm uppercase tracking-widest text-blue-600 dark:text-cyan-500 font-bold mb-2">
            <span className="dark:hidden">Welcome to VoltCare</span>
            <span className="hidden dark:inline">{">"} Initializing user parameters...</span>
          </p>
          <h2 className="mt-3 text-3xl font-bold sm:text-5xl hover-glitch text-slate-800 dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-r dark:from-cyan-300 dark:to-blue-500 dark:uppercase">
            Good day, {user.name}.
          </h2>
          <p className="mt-3 text-sm text-slate-600 dark:text-cyan-600 tracking-wider">
            <span className="dark:hidden">Manage your electricity bills, complaints, and service requests in one place.</span>
            <span className="hidden dark:inline">SYSTEM ACCESS GRANTED. Manage telemetry, anomalies, and diagnostics.</span>
          </p>
        </section>

        <section className="grid gap-6 sm:grid-cols-3">
          <article className="hud-panel p-6">
            <p className="text-sm text-slate-500 dark:text-cyan-500 uppercase tracking-widest font-semibold">Connection status</p>
            <div className="mt-4 relative inline-block plasma-pulse">
              <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 tracking-wider">Active</p>
            </div>
            <p className="mt-4 text-xs text-slate-500 dark:text-cyan-700 uppercase tracking-widest">
              <span className="dark:hidden">Account Verified</span>
              <span className="hidden dark:inline">{">"} Link established</span>
            </p>
          </article>

          <article className="hud-panel p-6 flex justify-between items-center">
            <div>
              <p className="text-sm text-slate-500 dark:text-cyan-500 uppercase tracking-widest font-semibold">Current bill</p>
              <p className="mt-3 text-2xl font-bold text-blue-700 dark:text-cyan-300">₹1,486.20</p>
              <p className="mt-2 text-xs text-slate-500 dark:text-cyan-700 uppercase tracking-widest">
                <span className="dark:hidden">Due 05 Oct 2026</span>
                <span className="hidden dark:inline">{">"} Due 05 Oct 2026</span>
              </p>
            </div>
            <div className="relative flex justify-center items-center">
              <div className="ring-hud"></div>
              <span className="absolute text-slate-400 dark:text-cyan-300 text-[10px] font-bold">1486</span>
            </div>
          </article>

          <article className="hud-panel p-6 border-orange-200 dark:border-amber-500/30">
            <p className="text-sm text-slate-500 dark:text-cyan-500 uppercase tracking-widest font-semibold">Open requests</p>
            <div className="mt-3 flex items-center gap-3">
              <svg className="size-8 text-orange-500 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
              <p className="text-xl font-bold text-orange-600 dark:text-amber-400 dark:uppercase">Open: {openRequestsCount}</p>
            </div>
            <p className="mt-4 text-xs text-slate-500 dark:text-cyan-700 uppercase tracking-widest">
              <span className="dark:hidden">Associated with your account</span>
              <span className="hidden dark:inline">{">"} Tracking active</span>
            </p>
          </article>
        </section>

        <section id="services" className="mt-12">
          <h3 className="text-xl font-bold text-blue-800 dark:text-cyan-400 uppercase tracking-widest mb-6 flex items-center gap-2">
            <span className="w-4 h-4 bg-blue-600 dark:bg-cyan-400 rounded-full dark:rounded-none animate-pulse"></span>
            <span className="dark:hidden">What do you need help with?</span>
            <span className="hidden dark:inline">Execute Command</span>
          </h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {services.map(([icon, title, description], index) => (
              <a
                key={index}
                href="#support"
                className="hud-panel p-6 group cursor-pointer"
              >
                <div className="text-blue-600 dark:text-cyan-500 group-hover:text-blue-800 dark:group-hover:text-cyan-300 dark:group-hover:drop-shadow-[0_0_8px_rgba(0,242,254,0.8)] transition-all">
                  {icon}
                </div>
                <h4 className="mt-6 font-bold text-sm tracking-widest text-slate-800 dark:text-cyan-300 dark:group-hover:text-white">{title}</h4>
                <p className="mt-2 text-xs text-slate-500 dark:text-cyan-600 uppercase">{description}</p>
                <div className="absolute bottom-0 left-0 w-full h-[2px] bg-blue-600 dark:bg-cyan-400 scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
              </a>
            ))}
          </div>
        </section>
        
        <section id="support" className="mt-12 hud-panel p-8 border-blue-200 dark:border-cyan-500/40 bg-blue-50/50 dark:bg-transparent">
          <div className="flex items-center gap-3 mb-6 border-b border-blue-200 dark:border-cyan-500/20 pb-4">
            <div className="w-2 h-6 bg-blue-600 dark:bg-cyan-400 animate-pulse"></div>
            <h3 className="text-xl font-bold text-blue-800 dark:text-cyan-300 uppercase tracking-widest">
              <span className="dark:hidden">Support Services</span>
              <span className="hidden dark:inline">Diagnostic Terminal</span>
            </h3>
          </div>
          
          <div className="opacity-90">
            <OfficialServices />
          </div>
          <div className="my-8">
            <ComplaintForm defaultName={user.name} defaultNumber={user.consumerNumber} />
          </div>
          <ComplaintTracker />
          <ServiceForm />

          <div className="mt-12 p-6 border border-orange-200 dark:border-red-500/30 bg-orange-50 dark:bg-red-500/5 rounded-xl dark:rounded-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[1px] bg-orange-200 dark:bg-red-500/50"></div>
            <p className="font-bold text-orange-700 dark:text-red-400 uppercase tracking-widest flex items-center gap-2">
              <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
              <span className="dark:hidden">Need urgent help?</span>
              <span className="hidden dark:inline">Critical Override Required?</span>
            </p>
            <p className="mt-2 text-xs text-orange-600 dark:text-red-400/70 uppercase">
              <span className="dark:hidden">For official MSEDCL assistance, call the consumer helpline.</span>
              <span className="hidden dark:inline">Initiate direct voice protocol with Central Command.</span>
            </p>
            <a
              href="tel:1912"
              className="mt-4 inline-block rounded-xl dark:rounded-sm bg-orange-500 dark:bg-red-500/20 border border-orange-600 dark:border-red-500 px-6 py-3 text-sm font-bold text-white dark:text-red-400 hover:bg-orange-600 dark:hover:bg-red-500 dark:hover:text-black transition-colors uppercase tracking-widest"
            >
              Call 1912
            </a>
          </div>
        </section>

        <p className="mt-12 mb-8 text-center text-xs dark:text-[10px] text-slate-500 dark:text-cyan-800 uppercase tracking-widest font-semibold">
          <span className="dark:hidden">VoltCare is a student project prototype. Bill and account details are sample data.</span>
          <span className="hidden dark:inline">// VoltCare Matrix v2.0 - End of transmission - Sample node data</span>
        </p>
      </div>
    </main>
  );
}