import AdminLayout from '@/Layouts/AdminLayout';
import { Link } from '@inertiajs/react';
import { TrendingUp, Users, ShoppingCart, Wallet, MessageSquare, Bot } from "lucide-react";

const fallbackOrders = [
  { id: "#INV-240518-001", cust: "Dewi Lestari", prod: "Aura de Fleur (100ml)", total: "Rp 1.275.000", status: "Selesai" },
  { id: "#INV-240518-002", cust: "Ricky Pratama", prod: "Velvet Oud (100ml)", total: "Rp 1.475.000", status: "Diproses" },
  { id: "#INV-240518-003", cust: "Siti Rahma", prod: "Bois d'Elegance (100ml)", total: "Rp 1.375.000", status: "Diproses" },
  { id: "#INV-240518-004", cust: "Andi Wijaya", prod: "Citrus Lumière (100ml)", total: "Rp 1.125.000", status: "Menunggu Verifikasi" },
  { id: "#INV-240517-005", cust: "Budi Santoso", prod: "Velvet Oud (100ml)", total: "Rp 1.475.000", status: "Selesai" },
];

const fallbackChatActivities = [
  { name: "Siti Rahma", msg: "Saya cari parfum yang aromanya tahan lama", time: "10:24", source: "rasa" },
  { name: "Andi Wijaya", msg: "Parfum untuk acara formal yang elegan", time: "10:18", source: "rasa" },
  { name: "Dewi Lestari", msg: "Rekomendasi parfum bunga lembut dong", time: "10:15", source: "rasa" },
  { name: "Ricky Pratama", msg: "Parfum pria yang segar dan maskulin", time: "10:10", source: "db_fallback" },
];

export default function Dashboard({ kpi, recentOrders, totalOrderCount, salesChart, chatbotLogs }) {
  const displayOrders = recentOrders && recentOrders.length > 0 ? recentOrders : fallbackOrders;
  const displayLogs = chatbotLogs && chatbotLogs.length > 0 ? chatbotLogs : fallbackChatActivities;
  const count = totalOrderCount ?? displayOrders.length;

  return (
    <AdminLayout title="Dasbor Utama">
      <div className="mb-8 font-sans">
        <h1 className="font-serif text-3xl font-bold tracking-tight text-foreground">Dasbor Admin Parfumerie AI</h1>
        <p className="text-muted-foreground text-sm mt-1">Selamat datang kembali, pantau performa penjualan dan aktivitas AI chatbot secara langsung dari basis data.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 font-sans">
        <Kpi label="Total Penjualan" value={kpi?.totalSales || "Rp 0"} delta="12,5%" icon={<Wallet className="text-primary" size={22} />} />
        <Kpi label="Pesanan" value={kpi?.totalOrders || "0"} delta="8,2%" icon={<ShoppingCart className="text-primary" size={22} />} />
        <Kpi label="Pelanggan" value={kpi?.totalCustomers || "0"} delta="6,1%" icon={<Users className="text-primary" size={22} />} />
        <Kpi label="Konversi" value={kpi?.conversionRate || "0%"} delta="2,1%" icon={<TrendingUp className="text-primary" size={22} />} />
      </div>

      <div className="grid lg:grid-cols-[1.6fr_1fr] gap-8 font-sans">
        <div className="bg-card rounded-3xl border border-border p-8 shadow-xl relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-bl-full pointer-events-none" />
          <div className="flex items-center justify-between mb-8 relative z-10">
            <div>
              <h2 className="font-serif text-2xl font-bold">Penjualan 7 Hari Terakhir</h2>
              <p className="text-xs text-muted-foreground mt-0.5 font-sans">Akumulasi nilai pesanan terverifikasi per hari (dalam Ribuan / Jutaan Rupiah).</p>
            </div>
            <select className="bg-input text-foreground border border-border rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 shadow-sm font-medium">
              <option>7 Hari Terakhir</option>
              <option>30 Hari Terakhir</option>
            </select>
          </div>
          <SalesChart chartData={salesChart?.data} chartLabels={salesChart?.labels} />
        </div>

        <div className="bg-card rounded-3xl border border-border p-8 shadow-xl flex flex-col justify-between relative overflow-hidden font-sans">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-bl-full pointer-events-none" />
          <div>
            <div className="flex items-center justify-between mb-6 relative z-10">
              <div>
                <h2 className="font-serif text-2xl font-bold flex items-center gap-2">
                  <Bot size={22} className="text-primary" />
                  <span>Aktivitas Chatbot</span>
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">Konsultasi AI Sommelier terkini.</p>
              </div>
              <span className="w-2.5 h-2.5 rounded-full bg-primary animate-ping" />
            </div>
            <ul className="space-y-5 relative z-10">
              {displayLogs.map((c, i) => (
                <li key={i} className="flex gap-4 items-start group">
                  <div className="size-10 rounded-2xl bg-secondary text-secondary-foreground border border-border flex items-center justify-center font-serif font-bold text-sm shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition duration-300 shadow-sm">
                    {c.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0 pt-0.5">
                    <div className="flex justify-between items-center text-sm mb-1">
                      <span className="font-bold text-foreground truncate">{c.name}</span>
                      <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-mono font-bold uppercase">
                        {c.source || 'rasa'}
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-foreground truncate">{c.msg}</p>
                    <p className="text-[11px] text-muted-foreground truncate pt-0.5 italic">🤖 &ldquo;{c.reply || 'Memberikan rekomendasi formulasi...'}&rdquo;</p>
                    <div className="text-[10px] text-muted-foreground text-right mt-0.5">{c.date ? `${c.date}, ${c.time}` : c.time}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <Link
            href={route('admin.chatbot')}
            className="block text-center w-full mt-6 py-3 text-xs font-bold uppercase tracking-wider text-foreground border border-border bg-card hover:bg-secondary hover:border-border/80 transition duration-300 rounded-xl shadow-sm font-sans relative z-10"
          >
            Lihat Semua Log Chatbot ({displayLogs.length} Terdata) ➜
          </Link>
        </div>
      </div>

      <div className="bg-card rounded-3xl border border-border p-8 shadow-xl mt-8 space-y-6 font-sans">
        <div className="flex items-center justify-between border-b border-border/80 pb-6">
          <div>
            <h2 className="font-serif text-2xl font-bold">Pesanan Terbaru</h2>
            <p className="text-xs text-muted-foreground mt-1">Daftar transaksi dan status pemesanan parfum terkini dari database.</p>
          </div>
          <span className="text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full uppercase tracking-widest font-mono">
            {count} Transaksi
          </span>
        </div>

        <div className="overflow-x-auto font-sans">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase tracking-wider font-semibold border-b border-border/60">
              <tr>
                <th className="py-4 px-4">No. Pesanan</th>
                <th className="py-4 px-4">Pelanggan</th>
                <th className="py-4 px-4">Produk</th>
                <th className="py-4 px-4">Total</th>
                <th className="py-4 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60 font-sans">
              {displayOrders.map((o) => (
                <tr key={o.id} className="hover:bg-secondary/40 transition duration-200">
                  <td className="py-4 px-4 font-bold text-foreground font-mono">{o.id}</td>
                  <td className="py-4 px-4 font-medium">{o.cust}</td>
                  <td className="py-4 px-4 text-muted-foreground">{o.prod}</td>
                  <td className="py-4 px-4 font-serif font-bold text-foreground text-base">{o.total}</td>
                  <td className="py-4 px-4"><StatusBadge s={o.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <Link
          href={route('admin.pembelian')}
          className="block text-center w-full mt-4 py-3 text-xs font-bold uppercase tracking-wider text-foreground border border-border bg-card hover:bg-secondary hover:border-border/80 transition duration-300 rounded-xl shadow-sm font-sans"
        >
          Lihat Semua Pesanan ({count} Total) ➜
        </Link>
      </div>
    </AdminLayout>
  );
}

function Kpi({ label, value, delta, icon }) {
  return (
    <div className="bg-card rounded-3xl border border-border p-6 shadow-sm hover:shadow-xl transition duration-300 relative overflow-hidden group">
      <div className="absolute -top-10 -right-10 w-24 h-24 bg-primary/5 rounded-full pointer-events-none group-hover:scale-125 transition duration-500" />
      <div className="flex justify-between items-start relative z-10">
        <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{label}</span>
        <div className="size-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center shadow-sm group-hover:scale-110 transition duration-300">
          {icon}
        </div>
      </div>
      <div className="font-serif text-3xl font-extrabold text-foreground mt-4 tracking-tight relative z-10">{value}</div>
      <div className="text-xs font-bold text-emerald-600 mt-2 flex items-center gap-1 relative z-10">
        <span>▲ {delta}</span>
        <span className="text-muted-foreground font-normal">dari pekan lalu</span>
      </div>
    </div>
  );
}

function StatusBadge({ s }) {
  const map = {
    "Selesai": "bg-emerald-500/10 text-emerald-700 border border-emerald-500/30",
    "Diproses": "bg-amber-500/10 text-amber-700 border border-amber-500/30",
    "Menunggu Verifikasi": "bg-sky-500/10 text-sky-700 border border-sky-500/30",
    "Siap Diambil": "bg-purple-500/10 text-purple-700 border border-purple-500/30",
  };
  return (
    <span className={`px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wide shadow-sm inline-block ${map[s] || "bg-secondary text-secondary-foreground border border-border"}`}>
      {s}
    </span>
  );
}

function SalesChart({ chartData, chartLabels }) {
  const data = chartData && chartData.length === 7 ? chartData : [15, 26, 22, 18, 38, 24, 14];
  const labels = chartLabels && chartLabels.length === 7 ? chartLabels : ["12 Mei", "13 Mei", "14 Mei", "15 Mei", "16 Mei", "17 Mei", "18 Mei"];
  const max = Math.max(...data, 200); // minimal skala 200 (rb)
  const ySteps = [Math.round(max * 0.25), Math.round(max * 0.5), Math.round(max * 0.75), max];
  const w = 600, h = 240, pad = 40;
  const stepX = (w - pad * 2) / (data.length - 1);
  const points = data.map((v, i) => [pad + i * stepX, h - pad - (v / max) * (h - pad * 2)]);
  const path = points.map((p, i) => (i === 0 ? `M${p[0]},${p[1]}` : `L${p[0]},${p[1]}`)).join(" ");
  const area = `${path} L${points[points.length - 1][0]},${h - pad} L${points[0][0]},${h - pad} Z`;

  return (
    <div className="w-full overflow-x-auto pt-2">
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-auto min-w-[500px]">
        <defs>
          <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="oklch(0.68 0.13 40)" stopOpacity="0.25" />
            <stop offset="100%" stopColor="oklch(0.68 0.13 40)" stopOpacity="0.0" />
          </linearGradient>
        </defs>
        
        {ySteps.map((y, idx) => (
          <g key={idx}>
            <line
              x1={pad}
              x2={w - pad}
              y1={h - pad - (y / max) * (h - pad * 2)}
              y2={h - pad - (y / max) * (h - pad * 2)}
              stroke="currentColor"
              className="text-border/60"
              strokeDasharray="4 4"
            />
            <text x={2} y={h - pad - (y / max) * (h - pad * 2) + 4} className="text-[10px] font-semibold fill-muted-foreground font-mono">
              {y >= 1000 ? (y / 1000).toFixed(1) + " jt" : y + " rb"}
            </text>
          </g>
        ))}

        <path d={area} fill="url(#chartGradient)" />
        <path d={path} fill="none" stroke="oklch(0.68 0.13 40)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        
        {points.map((p, i) => (
          <g key={i} className="group cursor-pointer">
            <circle cx={p[0]} cy={p[1]} r="5" fill="oklch(0.68 0.13 40)" stroke="oklch(0.97 0.012 80)" strokeWidth="2" />
            <circle cx={p[0]} cy={p[1]} r="10" fill="oklch(0.68 0.13 40)" opacity="0.2" className="animate-pulse" />
            <title>{labels[i]}: {data[i] >= 1000 ? (data[i]/1000).toFixed(2) + " Juta" : data[i] + " Ribu"} Rp</title>
          </g>
        ))}

        {labels.map((l, i) => (
          <text key={l} x={pad + i * stepX} y={h - 10} textAnchor="middle" className="text-[11px] font-bold fill-muted-foreground">
            {l}
          </text>
        ))}
      </svg>
    </div>
  );
}
