import { getInvoice } from "@/app/services/api";
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

export default async function InvoiceDetail({ params }: any) {
  const { id } = await params;
  const invoice = await getInvoice(id);

  if (!invoice) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4 animate-fade-in">
        <Link href="/invoices" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-400 hover:text-accent-blue transition-colors mb-8 group">
          <span className="transition-transform group-hover:-translate-x-1">←</span> Back to Invoices
        </Link>
        <div className="py-24 flex flex-col items-center text-center bg-accent-rose/5 border border-accent-rose/10 rounded-[2.5rem]">
          <div className="w-20 h-20 rounded-3xl bg-accent-rose/10 flex items-center justify-center text-4xl mb-6">⚠️</div>
          <h1 className="text-2xl font-black text-accent-rose mb-2">Invoice Not Found</h1>
          <p className="text-slate-400">No invoice with record ID <strong className="text-white">#{id}</strong> exists in the system.</p>
        </div>
      </div>
    );
  }

  const amount = Number(invoice.amount) || 0;
  const customerInitials = getInitials(invoice.customer?.name);

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 animate-fade-in">
      {/* Navigation & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10">
        <Link 
          href="/invoices" 
          className="inline-flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-accent-blue transition-all group w-fit"
        >
          <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-accent-blue/10 group-hover:text-accent-blue transition-colors">
            <span className="transition-transform group-hover:-translate-x-0.5">←</span>
          </div>
          Back to Invoices
        </Link>
        
        <div className="flex items-center gap-3">
           <div className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border ${getBadgeStyles(invoice.status)}`}>
             {invoice.status ?? 'draft'}
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-8">
          {/* Hero Hero Amount Card */}
          <div className="relative p-10 bg-white/5 border border-white/5 rounded-[2.5rem] overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent-cyan/10 blur-[100px] -translate-y-1/2 translate-x-1/2" />
            
            <div className="relative z-10 flex flex-col items-center text-center">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">Total Outstanding Amount</span>
              <h1 className="text-5xl md:text-7xl font-black gradient-text-amount mb-4">
                ₦{amount.toLocaleString()}
              </h1>
              {invoice.description && (
                <p className="text-slate-400 font-medium max-w-md mx-auto line-clamp-2 italic">
                  &ldquo;{invoice.description}&rdquo;
                </p>
              )}
            </div>
          </div>

          {/* Core Info Details */}
          <div className="bg-white/5 border border-white/5 rounded-[2rem] p-8">
            <h3 className="text-lg font-bold text-white mb-8 flex items-center gap-3">
               <span className="w-1.5 h-6 rounded-full bg-accent-blue" />
               Billing Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12">
              <DetailItem label="Invoice Number" value={`#${invoice.id}`} />
              <DetailItem label="Global Reference" value={invoice.description || "N/A"} />
              <DetailItem 
                label="Issuance Date" 
                value={invoice.createdAt ? new Date(invoice.createdAt).toLocaleDateString("en-US", {
                  day: "numeric",
                  month: "long",
                  year: "numeric"
                }) : "N/A"} 
              />
              <DetailItem label="Payment Status" value={invoice.status?.toUpperCase() || "DEFAULT"} accent />
            </div>
          </div>
        </div>

        {/* Sidebar: Customer Info */}
        <div className="space-y-8">
          <div className="bg-white/5 border border-white/5 rounded-[2rem] p-8 h-full">
            <h3 className="text-lg font-bold text-white mb-8">Recipient</h3>
            
            {invoice.customer ? (
              <div className="space-y-8">
                <div className="flex flex-col items-center text-center">
                  <div className="w-20 h-20 rounded-3xl bg-accent-purple/10 text-accent-purple border border-accent-purple/20 flex items-center justify-center text-3xl font-black mb-4">
                    {customerInitials}
                  </div>
                  <h4 className="text-xl font-bold text-white mb-1">{invoice.customer.name}</h4>
                  <p className="text-sm font-medium text-slate-400 mb-6">{invoice.customer.email}</p>
                  
                  <Link 
                    href={`/customers/${invoice.customer.id}`}
                    className="w-full h-11 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-xs font-bold text-white hover:bg-white/10 transition-all group"
                  >
                    View Customer Profile 
                    <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                  </Link>
                </div>

                <div className="pt-8 border-t border-white/5 space-y-6">
                  <SidebarInfoRow icon="📧" label="Email" value={invoice.customer.email} />
                  {invoice.customer.phone && (
                    <SidebarInfoRow icon="📱" label="Phone" value={invoice.customer.phone} />
                  )}
                </div>
              </div>
            ) : (
              <div className="py-12 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-2xl opacity-30 mb-4">👤</div>
                <p className="text-slate-500 font-bold">Unregistered Customer</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailItem({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="space-y-1.5">
      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{label}</p>
      <p className={`text-base font-bold ${accent ? 'text-accent-blue' : 'text-white'}`}>{value}</p>
    </div>
  );
}

function SidebarInfoRow({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <span className="text-base grayscale opacity-60 mt-0.5">{icon}</span>
      <div className="space-y-0.5 min-w-0">
        <p className="text-[9px] font-black text-slate-500 uppercase tracking-tighter">{label}</p>
        <p className="text-xs font-bold text-slate-300 truncate">{value}</p>
      </div>
    </div>
  );
}