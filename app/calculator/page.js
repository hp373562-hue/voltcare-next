"use client";

import { useState } from "react";
import Link from "next/link";
import ThemeToggle from "../components/theme-toggle";

export default function CalculatorPage() {
  const [units, setUnits] = useState(260);
  
  // MSEDCL LT-I Tariff Constants
  const FIXED_CHARGE = 128.0; // Single Phase
  const WHEELING_CHARGE_PER_UNIT = 1.17;
  const ELECTRICITY_DUTY_RATE = 0.16; // 16%

  // Slabs
  const slab1Rate = 5.88; // 0-100
  const slab2Rate = 11.46; // 101-300
  const slab3Rate = 15.72; // 301-500
  const slab4Rate = 17.81; // >500

  let slab1Units = 0, slab2Units = 0, slab3Units = 0, slab4Units = 0;
  let remaining = units;

  if (remaining > 500) {
    slab4Units = remaining - 500;
    remaining = 500;
  }
  if (remaining > 300) {
    slab3Units = remaining - 300;
    remaining = 300;
  }
  if (remaining > 100) {
    slab2Units = remaining - 100;
    remaining = 100;
  }
  slab1Units = remaining;

  const slab1Cost = slab1Units * slab1Rate;
  const slab2Cost = slab2Units * slab2Rate;
  const slab3Cost = slab3Units * slab3Rate;
  const slab4Cost = slab4Units * slab4Rate;

  const totalEnergyCost = slab1Cost + slab2Cost + slab3Cost + slab4Cost;
  const totalWheelingCharge = units * WHEELING_CHARGE_PER_UNIT;
  
  const subtotalForDuty = FIXED_CHARGE + totalEnergyCost + totalWheelingCharge;
  const electricityDuty = subtotalForDuty * ELECTRICITY_DUTY_RATE;
  
  const grandTotal = subtotalForDuty + electricityDuty;

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-[#05070e] px-4 py-12 text-slate-800 dark:text-white sm:px-8 bg-grid cyber-font relative overflow-hidden transition-colors duration-300">
      <div className="scanline"></div>
      <div className="hidden dark:block fixed inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,rgba(0,242,254,0.05),transparent_70%)]"></div>

      <div className="mx-auto max-w-4xl relative z-10">
        <header className="mb-8 flex justify-between items-center bg-white dark:bg-transparent dark:hud-panel p-4 rounded-xl dark:rounded-none border border-slate-200 dark:border-cyan-500/30">
          <Link href="/" className="text-[#004085] dark:text-cyan-400 hover:text-orange-600 dark:hover:text-cyan-300 uppercase tracking-widest text-xs font-bold flex items-center gap-2 transition-colors">
            <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            Return to Dashboard
          </Link>
          <ThemeToggle />
        </header>

        <section className="bg-white dark:bg-transparent dark:hud-panel p-6 md:p-10 rounded-2xl dark:rounded-none shadow-sm dark:shadow-none border border-slate-200 dark:border-cyan-500/40">
          <div className="flex items-center gap-3 mb-8 border-b border-slate-200 dark:border-cyan-500/20 pb-6">
            <div className="w-2 h-8 bg-orange-500 dark:bg-cyan-400 animate-pulse"></div>
            <div>
              <h1 className="text-2xl font-black text-[#004085] dark:text-cyan-300 uppercase tracking-widest">
                <span className="dark:hidden">Energy Bill Calculator</span>
                <span className="hidden dark:inline">Tariff Matrix Estimator</span>
              </h1>
              <p className="text-xs text-slate-500 dark:text-cyan-600 mt-1 uppercase font-bold tracking-widest">
                MSEDCL LT-I (Residential) Single Phase
              </p>
            </div>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            
            {/* INPUT SECTION */}
            <div className="flex flex-col gap-6">
              <div className="bg-blue-50 dark:bg-cyan-900/10 border border-blue-100 dark:border-cyan-500/30 p-6 rounded-xl dark:rounded-none">
                <label className="block text-sm text-[#004085] dark:text-cyan-400 uppercase tracking-widest font-bold mb-4">
                  Enter Units Consumed (kWh)
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="number"
                    min="0"
                    value={units}
                    onChange={(e) => setUnits(Number(e.target.value))}
                    className="w-full bg-white dark:bg-cyan-950/40 border-2 border-[#004085] dark:border-cyan-400 p-4 text-2xl font-black text-slate-900 dark:text-cyan-100 outline-none focus:ring-4 focus:ring-blue-500/20 dark:focus:shadow-[0_0_15px_rgba(0,242,254,0.4)] transition-all rounded-lg dark:rounded-none"
                  />
                  <span className="text-xl font-bold text-slate-400 dark:text-cyan-600">kWh</span>
                </div>
                
                <input
                  type="range"
                  min="0"
                  max="1500"
                  value={units}
                  onChange={(e) => setUnits(Number(e.target.value))}
                  className="w-full mt-6 accent-[#004085] dark:accent-cyan-400"
                />
              </div>

              <div className="bg-orange-50 dark:bg-amber-500/5 border border-orange-200 dark:border-amber-500/20 p-5 rounded-xl dark:rounded-none">
                <p className="text-xs font-bold text-orange-700 dark:text-amber-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                   <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                   Important Note
                </p>
                <p className="text-xs text-orange-600/80 dark:text-amber-500/70 font-semibold leading-relaxed">
                  This calculator provides an estimated bill based on standard LT-I residential tariff slabs. It excludes past arrears, specific local taxes, prompt payment discounts, or delayed payment charges.
                </p>
              </div>
            </div>

            {/* BILL BREAKDOWN */}
            <div className="bg-[#004085] dark:bg-cyan-950/40 p-6 rounded-xl dark:rounded-none border border-blue-900 dark:border-cyan-500/30 text-white dark:text-cyan-100 flex flex-col">
              <h2 className="text-sm text-blue-200 dark:text-cyan-500 font-bold uppercase tracking-widest mb-4 border-b border-blue-800 dark:border-cyan-500/30 pb-3">
                Estimated Bill Breakdown
              </h2>
              
              <div className="space-y-3 text-sm flex-grow">
                <div className="flex justify-between items-center">
                  <span className="text-blue-100 dark:text-cyan-600">Fixed Charges</span>
                  <span className="font-mono">₹{FIXED_CHARGE.toFixed(2)}</span>
                </div>
                
                <div className="pt-2">
                  <span className="text-blue-200 dark:text-cyan-500 text-xs uppercase font-bold">Energy Charges</span>
                  
                  {slab1Units > 0 && (
                    <div className="flex justify-between items-center mt-1 pl-2 border-l-2 border-blue-700 dark:border-cyan-800">
                      <span className="text-xs text-blue-100/70 dark:text-cyan-600">0-100 (@ ₹5.88) &times; {slab1Units}</span>
                      <span className="font-mono text-xs">₹{slab1Cost.toFixed(2)}</span>
                    </div>
                  )}
                  {slab2Units > 0 && (
                    <div className="flex justify-between items-center mt-1 pl-2 border-l-2 border-blue-700 dark:border-cyan-800">
                      <span className="text-xs text-blue-100/70 dark:text-cyan-600">101-300 (@ ₹11.46) &times; {slab2Units}</span>
                      <span className="font-mono text-xs">₹{slab2Cost.toFixed(2)}</span>
                    </div>
                  )}
                  {slab3Units > 0 && (
                    <div className="flex justify-between items-center mt-1 pl-2 border-l-2 border-blue-700 dark:border-cyan-800">
                      <span className="text-xs text-blue-100/70 dark:text-cyan-600">301-500 (@ ₹15.72) &times; {slab3Units}</span>
                      <span className="font-mono text-xs">₹{slab3Cost.toFixed(2)}</span>
                    </div>
                  )}
                  {slab4Units > 0 && (
                    <div className="flex justify-between items-center mt-1 pl-2 border-l-2 border-blue-700 dark:border-cyan-800">
                      <span className="text-xs text-blue-100/70 dark:text-cyan-600">&gt;500 (@ ₹17.81) &times; {slab4Units}</span>
                      <span className="font-mono text-xs">₹{slab4Cost.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center mt-2 font-bold text-blue-50 dark:text-cyan-400">
                    <span>Total Energy Charge</span>
                    <span className="font-mono">₹{totalEnergyCost.toFixed(2)}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-2">
                  <span className="text-blue-100 dark:text-cyan-600">Wheeling Charges (@ ₹1.17)</span>
                  <span className="font-mono">₹{totalWheelingCharge.toFixed(2)}</span>
                </div>

                <div className="flex justify-between items-center pt-2">
                  <span className="text-blue-100 dark:text-cyan-600">Electricity Duty (16%)</span>
                  <span className="font-mono">₹{electricityDuty.toFixed(2)}</span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-blue-700 dark:border-cyan-500/50">
                <div className="flex justify-between items-end">
                  <span className="text-lg font-bold uppercase tracking-widest text-orange-400 dark:text-cyan-300">
                    Grand Total
                  </span>
                  <span className="text-4xl font-black text-white dark:text-cyan-100 tracking-tight">
                    ₹{Math.round(grandTotal).toLocaleString('en-IN')}.00
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
