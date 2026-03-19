import { getCustomer, getInvoices } from "@/app/services/api";
import Link from "next/link";

function getBadgeStyles(status: string) {
  switch(status?.toLowerCase()) {
    case "paid": return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
    case "pending": return "bg-amber-500/10 text-amber-400 border-amber-500/20";
    case "overdue": return "bg-rose-500/10 text-rose-400 border-rose-500/20";
    default: return "bg-slate-500/10 text-slate-400 border-slate-500/20";
  }
}

function getInitials(name: string) {
  return (name ?? "?")
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

const avatarColors = ["#4f8ef7", "#7c6bf0", "#22d3ee", "#10b981", "#f59e0b", "#f43f5e"];

export default async function CustomerDetail({ params }: any) {
  const { id } = await params;
  const customer = await getCustomer(id);

  // Fetch all invoices and filter for this customer
  let customerInvoices: any[] = [];
  try {
    const allInvoices = await getInvoices();
    customerInvoices = Array.isArray(allInvoices)
      ? allInvoices.filter((inv: any) => String(inv.customer?.id) === String(id))
      : [];
  } catch (_) {}

  if (!customer) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4 animate-fade-in">
        <Link href="/customers" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-400 hover:text-accent-blue transition-colors mb-8 group">
          <span className="transition-transform group-hover:-translate-x-1">←</span> Back to Customers
        </Link>
        <div className="py-24 flex flex-col items-center text-center bg-accent-rose/5 border border-accent-rose/10 rounded-[2.5rem]">
          <div className="w-20 h-20 rounded-3xl bg-accent-rose/10 flex items-center justify-center text-4xl mb-6">👤</div>
          <h1 className="text-2xl font-black text-accent-rose mb-2">Customer Not Found</h1>
          <p className="text-slate-400">No customer with record ID <strong className="text-white">#{id}</strong> exists in the system.</p>
        </div>
      </div>
    );
  }

  const totalSpend = customerInvoices.reduce((s: number, i: any) => s + (Number(i.amount) || 0), 0);
  const paidInvoices = customerInvoices.filter((i: any) => i.status === "paid");
  const colorIdx = Number(id) % avatarColors.length;
  const avatarColor = avatarColors[colorIdx] ?? "#4f8ef7";

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 animate-fade-in">
      {/* Navigation */}
      <div className="mb-10">
        <Link 
          href="/customers" 
          className="inline-flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-accent-blue transition-all group w-fit"
        >
          <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-accent-blue/10 group-hover:text-accent-blue transition-colors">
            <span className="transition-transform group-hover:-translate-x-0.5">←</span>
          </div>
          Back to Customers
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sidebar: Profile Card */}
        <div className="space-y-6">
          <div className="bg-white/5 border border-white/5 rounded-[2.5rem] p-8 text-center relative overflow-hidden group">
             <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent-blue to-transparent opacity-30 group-hover:opacity-100 transition-opacity" />
             
             <div className="relative z-10">
                <div 
                  className="w-24 h-24 rounded-3xl flex items-center justify-center text-4xl font-black mx-auto mb-6 shadow-2xl"
                  style={{ background: `${avatarColor}15`, color: avatarColor, border: `1px solid ${avatarColor}30` }}
                >
                  {getInitials(customer.name)}
                </div>
                <h1 className="text-2xl font-black text-white mb-2">{customer.name}</h1>
                <p className="text-sm font-medium text-slate-400 mb-8">{customer.email}</p>
                
                <div className="grid grid-cols-1 gap-3 pt-6 border-t border-white/5 text-left">
                  <ContactRow icon="📧" label="Email Address" value={customer.email} />
                  {customer.phone && <ContactRow icon="📱" label="Phone Number" value={customer.phone} />}
                  <ContactRow icon="🆔" label="Internal ID" value={`#${customer.id}`} />
                </div>
             </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
             <StatCard label="Total Invoices" value={customerInvoices.length} color="text-accent-blue" />
             <StatCard label="Paid Volume" value={paidInvoices.length} color="text-accent-emerald" />
             <StatCard label="Revenue Yield" value={`₦${totalSpend.toLocaleString()}`} color="text-accent-cyan" isAmount />
          </div>

          {/* Activity Section */}
          <div className="bg-white/5 border border-white/5 rounded-[2.5rem] p-8">
             <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-bold text-white flex items-center gap-3">
                   <span className="w-1.5 h-6 rounded-full bg-accent-purple" />
                   Transaction History
                </h3>
                <span className="text-xs font-black text-slate-500 uppercase tracking-widest bg-white/5 px-3 py-1 rounded-lg">
                   {customerInvoices.length} Records
                </span>
             </div>

             {customerInvoices.length > 0 ? (
               <div className="space-y-3">
                 {customerInvoices.map((inv, idx) => {
                    const invColor = avatarColors[idx % avatarColors.length];
                    return (
                      <Link 
                        key={inv.id} 
                        href={`/invoices/${inv.id}`}
                        className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/[0.08] hover:border-white/10 transition-all group"
                      >
                         <div 
                           className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105"
                           style={{ background: `${invColor}15`, color: invColor }}
                         >
                           <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                             <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                           </svg>
                         </div>
                         <div className="flex-1 min-w-0">
                            <div className="text-sm font-bold text-white mb-0.5 truncate">Invoice #{inv.id}</div>
                            {inv.description && <div className="text-[10px] text-slate-500 font-medium truncate">{inv.description}</div>}
                         </div>
                         <div className="text-right flex flex-col items-end gap-2">
                            <div className="text-sm font-black text-white">₦{Number(inv.amount).toLocaleString()}</div>
                            <div className={`text-[9px] font-black uppercase tracking-tighter px-2 py-0.5 rounded-md border ${getBadgeStyles(inv.status)}`}>
                               {inv.status}
                            </div>
                         </div>
                      </Link>
                    )
                 })}
               </div>
             ) : (
               <div className="py-20 flex flex-col items-center text-center opacity-40">
                  <div className="text-4xl mb-4">📋</div>
                  <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">No activity found</p>
               </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, color, isAmount }: { label: string; value: string | number; color: string; isAmount?: boolean }) {
  return (
    <div className="bg-white/5 border border-white/5 p-6 rounded-[2rem] hover:bg-white/[0.07] transition-colors">
       <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.15em] mb-4">{label}</p>
       <p className={`text-2xl font-black ${isAmount ? 'gradient-text-amount' : color}`}>{value}</p>
    </div>
  );
}

function ContactRow({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <span className="text-base mt-0.5 opacity-60 grayscale group-hover:grayscale-0 transition-all">{icon}</span>
      <div className="min-w-0">
        <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-0.5">{label}</p>
        <p className="text-xs font-bold text-slate-300 truncate">{value}</p>
      </div>
    </div>
  );
}