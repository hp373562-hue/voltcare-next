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
    "Report Outage / Fault",
    "Instant geo-location tag & emergency contact"
  ],
  [
    <svg key="2" className="size-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
    "Self-Meter Reading Submit",
    "For non-smart meters, with photo upload"
  ],
  [
    <svg key="3" className="size-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707" /></svg>,
    "Apply for New Connection",
    "Including Solar Net Metering (PM Surya Ghar)"
  ],
  [
    <svg key="4" className="size-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>,
    "Register Complaint",
    "Track grievance and view AI resolution"
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

      {/* TOP NAVIGATION BAR */}
      <header className="mx-auto flex flex-col md:flex-row max-w-7xl items-center justify-between py-4 relative z-10 border-b border-blue-900/10 dark:border-cyan-500/30 gap-4">
        <div className="flex items-center gap-3 w-full md:w-auto justify-between">
          <div className="flex items-center gap-3">
            <div className="grid size-12 place-items-center rounded-xl dark:rounded-sm bg-[#004085] dark:bg-cyan-500/20 border border-[#004085] dark:border-cyan-400 text-xl text-white dark:text-cyan-300 shadow-sm dark:shadow-[0_0_10px_rgba(0,242,254,0.5)]">
              <svg className="size-7" fill="currentColor" viewBox="0 0 24 24">
                <path d="M13 2.05v3.03c3.39.49 6 3.39 6 6.92 0 .9-.22 1.75-.61 2.51l2.47 1.43C21.57 14.74 22 13.43 22 12c0-5.16-3.92-9.42-8.9-9.95zM11 2.05C6.08 2.58 2.16 6.84 2.16 12c0 1.43.43 2.74 1.14 3.94l2.47-1.43C5.38 13.75 5.16 12.9 5.16 12c0-3.53 2.61-6.43 6-6.92V2.05zM12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zm-1 7.5L8.5 12h2.5V9.5l2.5 2.5h-2.5v2.5z" />
              </svg>
            </div>
            <div>
              <h1 className="font-extrabold text-[#004085] dark:text-cyan-300 tracking-tight dark:tracking-[0.2em] text-xl lg:text-2xl">
                <span className="dark:hidden">Mahavitaran Consumer Portal</span>
                <span className="hidden dark:inline">ENERGY CORE MATRIX</span>
              </h1>
              <p className="text-xs text-slate-500 dark:text-cyan-500/70 font-semibold dark:tracking-widest">
                <span className="dark:hidden">Official Online Services</span>
                <span className="hidden dark:inline">// STATUS: SYNCHRONIZED</span>
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
          <div className="flex gap-2 items-center bg-white dark:bg-cyan-900/40 px-3 py-1.5 border border-slate-200 dark:border-cyan-500/50 rounded-lg dark:rounded-none shadow-sm dark:shadow-none whitespace-nowrap">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-xs font-bold text-slate-700 dark:text-cyan-400">ID: {user.consumerNumber}</span>
          </div>
          
          <button className="flex gap-1 items-center bg-slate-100 dark:bg-transparent px-2 py-1.5 border border-slate-200 dark:border-cyan-500/50 rounded-lg dark:rounded-none text-xs font-bold text-[#004085] dark:text-cyan-400 transition-colors">
            <span className="px-1 text-slate-800 dark:text-white">EN</span>|<span className="px-1 text-slate-400 hover:text-slate-800 dark:hover:text-cyan-200">मराठी</span>
          </button>

          <button className="relative p-2 text-slate-600 dark:text-cyan-400 hover:bg-slate-100 dark:hover:bg-cyan-900/40 rounded-full dark:rounded-none transition-colors">
            <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
            <span className="absolute top-1.5 right-2 w-2 h-2 bg-orange-500 dark:bg-red-500 rounded-full border border-white dark:border-[#05070e]"></span>
          </button>

          <ThemeToggle />

          <a href="/profile" className="p-2 text-slate-600 dark:text-cyan-400 hover:bg-slate-100 dark:hover:bg-cyan-900/40 rounded-full dark:rounded-none transition-colors">
            <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
          </a>

          <form action="/api/consumer/logout" method="POST">
            <button className="p-2 text-slate-600 dark:text-cyan-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full dark:rounded-none transition-colors">
              <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            </button>
          </form>
        </div>
      </header>

      <div className="mx-auto max-w-7xl relative z-10 mt-8">
        
        {/* CONSUMER HERO / QUICK SUMMARY */}
        <section className="bg-white dark:bg-transparent dark:hud-panel rounded-2xl shadow-sm border border-slate-200 dark:border-cyan-500/40 p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <p className="text-sm uppercase tracking-widest text-[#004085] dark:text-cyan-500 font-bold mb-2">
              <span className="dark:hidden">B.U. 4110 - Pune Urban</span>
              <span className="hidden dark:inline">{">"} Initializing user parameters...</span>
            </p>
            <h2 className="text-3xl font-extrabold sm:text-4xl text-slate-900 dark:hover-glitch dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-r dark:from-cyan-300 dark:to-blue-500 dark:uppercase">
              Welcome, {user.name}.
            </h2>
            <div className="mt-4 flex flex-wrap gap-3">
              <span className="inline-flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-xs font-bold px-3 py-1.5 border border-emerald-200 dark:border-emerald-500/50 rounded-full dark:rounded-none">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse"></span>
                Smart Meter Connected (Live)
              </span>
            </div>
          </div>
          
          <div className="bg-slate-50 dark:bg-cyan-900/20 border border-slate-200 dark:border-cyan-500/50 rounded-xl dark:rounded-none p-5 text-center min-w-[200px]">
             <p className="text-xs text-slate-500 dark:text-cyan-500 font-bold uppercase tracking-widest">Live Load Indicator</p>
             <div className="mt-2 text-4xl font-black text-[#004085] dark:text-cyan-300">
               1.4 <span className="text-xl text-slate-400 dark:text-cyan-600 font-bold">kW</span>
             </div>
             <p className="mt-2 text-[10px] text-orange-600 dark:text-amber-400 font-bold uppercase bg-orange-100 dark:bg-amber-900/30 py-1 px-2 rounded dark:rounded-none">
               ⚠ Peak Hours Advisory (6PM-10PM)
             </p>
          </div>
        </section>

        {/* 3-COLUMN CORE METRICS */}
        <section className="grid gap-6 md:grid-cols-3 mt-8">
          <article className="hud-panel p-6 border-t-4 border-t-orange-500 dark:border-t-transparent">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-slate-500 dark:text-cyan-500 uppercase tracking-widest font-bold">Current Outstanding</p>
                <p className="mt-2 text-3xl font-black text-slate-900 dark:text-cyan-300">₹2,549.60</p>
              </div>
              <span className="bg-orange-100 dark:bg-amber-500/20 text-orange-700 dark:text-amber-400 text-xs font-bold px-2 py-1 rounded dark:rounded-none">
                Due in 3 days
              </span>
            </div>
            
            <div className="mt-6 flex flex-col gap-3">
              <button className="w-full bg-orange-500 dark:bg-cyan-300/10 hover:bg-orange-600 dark:hover:bg-cyan-400 text-white dark:text-cyan-400 dark:hover:text-slate-950 font-bold py-3 px-4 rounded-xl dark:rounded-none transition-colors border border-transparent dark:border-cyan-400 dark:shadow-[0_0_10px_rgba(0,242,254,0.3)] shadow-md shadow-orange-500/20 uppercase tracking-wide">
                Pay Now <span className="text-[10px] font-normal opacity-80">(UPI/BBPS/NetBanking)</span>
              </button>
              <button className="text-sm text-[#004085] dark:text-cyan-500 hover:underline font-semibold flex items-center justify-center gap-1">
                <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                Download PDF Bill
              </button>
            </div>
          </article>

          <article className="hud-panel p-6 border-t-4 border-t-emerald-500 dark:border-t-transparent">
            <p className="text-sm text-slate-500 dark:text-cyan-500 uppercase tracking-widest font-bold">Last Payment Status</p>
            <div className="mt-4 flex items-center gap-4">
               <div className="bg-emerald-100 dark:bg-emerald-500/20 p-3 rounded-full dark:rounded-none">
                  <svg className="size-6 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
               </div>
               <div>
                  <p className="text-xl font-bold text-slate-900 dark:text-emerald-400">₹2,104.00</p>
                  <p className="text-xs text-slate-500 dark:text-cyan-700 font-bold mt-1">Paid on 02 Sep 2026</p>
               </div>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-200 dark:border-cyan-500/30 flex justify-between items-center">
              <span className="text-xs font-mono text-slate-400 dark:text-cyan-600">#RCPT-99218347</span>
              <button className="text-sm text-[#004085] dark:text-cyan-400 hover:underline font-bold flex items-center gap-1">
                Receipt <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
              </button>
            </div>
          </article>

          <article className="hud-panel p-6 border-t-4 border-t-blue-600 dark:border-t-transparent">
            <div className="flex justify-between items-start">
              <p className="text-sm text-slate-500 dark:text-cyan-500 uppercase tracking-widest font-bold">Active Requests</p>
              <span className="bg-blue-100 dark:bg-amber-500/20 text-[#004085] dark:text-amber-400 text-xs font-bold px-2 py-1 rounded dark:rounded-none">
                {openRequestsCount} pending
              </span>
            </div>
            
            {openRequestsCount > 0 ? (
              <div className="mt-4 relative pl-4 border-l-2 border-slate-200 dark:border-cyan-500/30 py-2">
                <div className="absolute w-3 h-3 bg-blue-500 dark:bg-amber-400 rounded-full -left-[7px] top-3"></div>
                <p className="text-sm font-bold text-slate-800 dark:text-cyan-300">Ticket #TKT-829</p>
                <p className="text-xs text-slate-500 dark:text-cyan-600 mt-1">Status: Technician Assigned</p>
                <p className="text-xs text-slate-400 dark:text-cyan-700 mt-2">Expected resolution: 4 hours</p>
              </div>
            ) : (
              <div className="mt-6 flex flex-col items-center justify-center text-center opacity-70">
                <svg className="size-10 text-slate-300 dark:text-cyan-800 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                <p className="text-sm text-slate-500 dark:text-cyan-700 font-bold">No active anomalies detected.</p>
              </div>
            )}
            
            <div className="mt-5 text-center">
               <a href="#support" className="text-xs text-[#004085] dark:text-cyan-500 font-bold uppercase tracking-widest hover:underline">
                 View tracking timeline &rarr;
               </a>
            </div>
          </article>
        </section>

        {/* QUICK SERVICE ACTIONS */}
        <section id="services" className="mt-12">
          <h3 className="text-xl font-extrabold text-[#004085] dark:text-cyan-400 uppercase tracking-widest mb-6 flex items-center gap-2">
            <span className="w-4 h-4 bg-[#004085] dark:bg-cyan-400 rounded-full dark:rounded-none animate-pulse"></span>
            <span className="dark:hidden">Quick Service Actions</span>
            <span className="hidden dark:inline">Execute Command</span>
          </h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {services.map(([icon, title, description], index) => (
              <a
                key={index}
                href="#support"
                className="bg-white dark:bg-transparent dark:hud-panel border border-slate-200 dark:border-cyan-500/30 p-6 rounded-xl dark:rounded-none group cursor-pointer hover:shadow-lg dark:hover:shadow-none hover:border-blue-400 dark:hover:border-cyan-400 transition-all relative overflow-hidden"
              >
                <div className="text-blue-600 dark:text-cyan-500 group-hover:text-orange-500 dark:group-hover:text-cyan-300 dark:group-hover:drop-shadow-[0_0_8px_rgba(0,242,254,0.8)] transition-all">
                  {icon}
                </div>
                <h4 className="mt-5 font-bold text-sm text-[#004085] dark:text-cyan-300 dark:group-hover:text-white leading-tight">{title}</h4>
                <p className="mt-2 text-[11px] text-slate-500 dark:text-cyan-600 uppercase font-semibold leading-relaxed">{description}</p>
                <div className="absolute bottom-0 left-0 w-full h-[3px] bg-orange-500 dark:bg-cyan-400 scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
              </a>
            ))}
          </div>
        </section>

        {/* ENERGY ANALYTICS MODULE */}
        <section className="mt-12 bg-white dark:bg-transparent dark:hud-panel rounded-2xl dark:rounded-none shadow-sm dark:shadow-none border border-slate-200 dark:border-cyan-500/40 p-6 md:p-8">
           <h3 className="text-lg font-extrabold text-[#004085] dark:text-cyan-400 uppercase tracking-widest mb-6">Energy Analytics</h3>
           <div className="flex flex-col md:flex-row gap-8 items-end">
              <div className="w-full md:w-2/3 h-48 flex items-end justify-between gap-2 border-b border-slate-200 dark:border-cyan-500/30 pb-2 relative">
                 {/* Chart Guide Lines */}
                 <div className="absolute w-full h-[1px] bg-slate-100 dark:bg-cyan-900/30 bottom-1/2 left-0 -z-10"></div>
                 <div className="absolute w-full h-[1px] bg-slate-100 dark:bg-cyan-900/30 top-0 left-0 -z-10"></div>
                 <span className="absolute -left-6 top-0 text-[10px] text-slate-400 dark:text-cyan-700">400</span>
                 <span className="absolute -left-6 bottom-1/2 text-[10px] text-slate-400 dark:text-cyan-700">200</span>
                 
                 {/* HTML Bars */}
                 <div className="w-1/6 flex flex-col items-center gap-2 group">
                   <div className="w-full max-w-[40px] bg-slate-200 dark:bg-cyan-900/50 h-[40%] rounded-t-sm transition-all group-hover:bg-blue-400 dark:group-hover:bg-cyan-500 relative">
                     <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold text-slate-600 dark:text-cyan-300 opacity-0 group-hover:opacity-100">160</span>
                   </div>
                   <span className="text-xs font-bold text-slate-500 dark:text-cyan-600">Apr</span>
                 </div>
                 <div className="w-1/6 flex flex-col items-center gap-2 group">
                   <div className="w-full max-w-[40px] bg-slate-200 dark:bg-cyan-900/50 h-[55%] rounded-t-sm transition-all group-hover:bg-blue-400 dark:group-hover:bg-cyan-500 relative">
                     <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold text-slate-600 dark:text-cyan-300 opacity-0 group-hover:opacity-100">220</span>
                   </div>
                   <span className="text-xs font-bold text-slate-500 dark:text-cyan-600">May</span>
                 </div>
                 <div className="w-1/6 flex flex-col items-center gap-2 group">
                   <div className="w-full max-w-[40px] bg-slate-200 dark:bg-cyan-900/50 h-[85%] rounded-t-sm transition-all group-hover:bg-blue-400 dark:group-hover:bg-cyan-500 relative">
                      <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold text-slate-600 dark:text-cyan-300 opacity-0 group-hover:opacity-100">340</span>
                   </div>
                   <span className="text-xs font-bold text-slate-500 dark:text-cyan-600">Jun</span>
                 </div>
                 <div className="w-1/6 flex flex-col items-center gap-2 group">
                   <div className="w-full max-w-[40px] bg-slate-200 dark:bg-cyan-900/50 h-[70%] rounded-t-sm transition-all group-hover:bg-blue-400 dark:group-hover:bg-cyan-500 relative">
                      <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold text-slate-600 dark:text-cyan-300 opacity-0 group-hover:opacity-100">280</span>
                   </div>
                   <span className="text-xs font-bold text-slate-500 dark:text-cyan-600">Jul</span>
                 </div>
                 <div className="w-1/6 flex flex-col items-center gap-2 group">
                   <div className="w-full max-w-[40px] bg-[#004085] dark:bg-cyan-400 h-[65%] rounded-t-sm shadow-[0_0_10px_rgba(0,64,133,0.3)] dark:shadow-[0_0_10px_rgba(0,242,254,0.3)] relative">
                      <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold text-[#004085] dark:text-cyan-300">260</span>
                   </div>
                   <span className="text-xs font-bold text-[#004085] dark:text-cyan-400">Aug</span>
                 </div>
              </div>

              <div className="w-full md:w-1/3 flex flex-col gap-4">
                <div className="bg-slate-50 dark:bg-cyan-900/20 p-5 rounded-xl dark:rounded-none border border-slate-200 dark:border-cyan-500/30">
                  <p className="text-sm text-slate-600 dark:text-cyan-500 font-bold mb-4">August Summary</p>
                  <div className="flex justify-between items-center mb-2">
                      <span className="text-xs text-slate-500 dark:text-cyan-600 font-semibold uppercase">Your Consumption</span>
                      <span className="text-sm font-black text-[#004085] dark:text-cyan-300">260 kWh</span>
                  </div>
                  <div className="flex justify-between items-center mb-4 pb-4 border-b border-slate-200 dark:border-cyan-500/30">
                      <span className="text-xs text-slate-500 dark:text-cyan-600 font-semibold uppercase">Regional Average</span>
                      <span className="text-sm font-bold text-slate-500 dark:text-cyan-700">295 kWh</span>
                  </div>
                  <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 p-2 rounded dark:rounded-none border border-emerald-100 dark:border-emerald-500/30">
                      <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" /></svg>
                      <span className="text-xs font-bold">11% lower than average!</span>
                  </div>
                </div>

                <div className="bg-[#004085] dark:bg-cyan-950/40 p-5 rounded-xl dark:rounded-none border border-blue-900 dark:border-cyan-500/30 text-white dark:text-cyan-100">
                  <p className="text-xs text-blue-200 dark:text-cyan-500 font-bold uppercase tracking-widest mb-3">MSEDCL LT-I Tariff (Updated)</p>
                  <div className="space-y-2 text-xs font-mono">
                    <div className="flex justify-between">
                      <span className="text-blue-100 dark:text-cyan-600">Fixed Charge</span>
                      <span>₹128.00</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-100 dark:text-cyan-600">0 - 100 units (@ ₹5.88)</span>
                      <span>₹588.00</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-100 dark:text-cyan-600">101 - 260 units (@ ₹11.46)</span>
                      <span>₹1,833.60</span>
                    </div>
                    <div className="pt-2 mt-2 border-t border-blue-700 dark:border-cyan-500/30 flex justify-between font-bold">
                      <span className="text-white dark:text-cyan-300">Energy Subtotal</span>
                      <span className="text-emerald-400 dark:text-cyan-300">₹2,549.60</span>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-blue-800 dark:border-cyan-900/50 flex flex-col gap-2">
                      <a 
                        href="/calculator" 
                        className="flex items-center justify-center gap-2 w-full bg-blue-600 dark:bg-cyan-400 hover:bg-blue-500 dark:hover:bg-cyan-300 text-white dark:text-slate-900 py-3 rounded-lg dark:rounded-none font-extrabold transition-all uppercase tracking-widest shadow-md shadow-blue-500/20 dark:shadow-[0_0_10px_rgba(0,242,254,0.3)]"
                      >
                        <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                        Interactive Bill Calculator
                      </a>

                      <a 
                        href="https://wss.mahadiscom.in/wss/wss?uiActionName=getEnergyBillCalculator" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="flex items-center justify-center gap-2 w-full bg-blue-800 dark:bg-cyan-500/10 hover:bg-blue-700 dark:hover:bg-cyan-500/20 text-blue-200 dark:text-cyan-300 py-2 rounded-lg dark:rounded-none border border-transparent dark:border-cyan-500/30 text-[10px] font-bold transition-colors uppercase tracking-wide"
                      >
                        Official Mahavitaran Site (वीज देयक परिगणक) ↗
                      </a>
                    </div>
                  </div>
                </div>
              </div>
           </div>
        </section>
        
        <section id="support" className="mt-12 bg-white dark:bg-transparent dark:hud-panel p-8 rounded-2xl dark:rounded-none shadow-sm dark:shadow-none border border-slate-200 dark:border-cyan-500/40">
          <div className="flex items-center gap-3 mb-6 border-b border-slate-200 dark:border-cyan-500/20 pb-4">
            <div className="w-2 h-6 bg-[#004085] dark:bg-cyan-400 animate-pulse"></div>
            <h3 className="text-xl font-extrabold text-[#004085] dark:text-cyan-300 uppercase tracking-widest">
              <span className="dark:hidden">Support & Help Desk</span>
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
              <span className="dark:hidden">For official MSEDCL assistance, call the 24x7 toll-free consumer helpline.</span>
              <span className="hidden dark:inline">Initiate direct voice protocol with Central Command.</span>
            </p>
            <a
              href="tel:1912"
              className="mt-4 inline-flex items-center gap-2 rounded-xl dark:rounded-sm bg-orange-500 dark:bg-red-500/20 border border-orange-600 dark:border-red-500 px-6 py-3 text-sm font-bold text-white dark:text-red-400 hover:bg-orange-600 dark:hover:bg-red-500 dark:hover:text-black transition-colors uppercase tracking-widest shadow-md shadow-orange-500/20 dark:shadow-none"
            >
              <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
              Call 1912 / 1800-233-3435
            </a>
          </div>
        </section>

        <p className="mt-12 mb-8 text-center text-xs dark:text-[10px] text-slate-500 dark:text-cyan-800 uppercase tracking-widest font-semibold">
          <span className="dark:hidden">&copy; 2026 Maharashtra State Electricity Distribution Co. Ltd. (MSEDCL)</span>
          <span className="hidden dark:inline">// VoltCare Matrix v2.0 - End of transmission - Sample node data</span>
        </p>
      </div>
    </main>
  );
}