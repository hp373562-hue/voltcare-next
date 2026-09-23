const services = [
  {
    title: "View or pay a bill",
    description: "Open MSEDCL’s official bill and payment page.",
    href: "https://wss.mahadiscom.in/wss/wss?Lang=English&uiActionName=getViewPayBill",
  },
  {
    title: "Official complaint tracking",
    description: "Track an ICRS complaint or submit feedback.",
    href: "https://wss.mahadiscom.in/ICRS/TrackComplaint.aspx?Lang=en-US",
  },
  {
    title: "Power failure information",
    description: "See MSEDCL’s official power-failure complaint options.",
    href: "https://www.mahadiscom.in/en/power-failure-complaint-registration-2/",
  },
  {
    title: "All consumer services",
    description: "Find new connections, self-reading, outage information, and more.",
    href: "https://www.mahadiscom.in/en/consumer/",
  },
];

export default function OfficialServices() {
  return (
    <section className="mt-8">
      <h2 className="text-lg font-bold">Official MSEDCL services</h2>
      <p className="mt-1 text-sm text-slate-400">
        These links open MSEDCL’s website in a new tab.
      </p>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {services.map(service => (
          <a
            key={service.title}
            href={service.href}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-2xl border border-white/10 bg-slate-900 p-5 transition hover:border-cyan-300/40"
          >
            <h3 className="font-semibold">{service.title} ↗</h3>
            <p className="mt-2 text-sm text-slate-400">
              {service.description}
            </p>
          </a>
        ))}
      </div>
    </section>
  );
}