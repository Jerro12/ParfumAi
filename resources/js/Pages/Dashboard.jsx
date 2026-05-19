import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { products } from '@/lib/products';
import { Sparkles, Clock, ShoppingBag, Heart, Compass, CheckCircle2, ArrowRight } from 'lucide-react';

export default function Dashboard({ auth }) {
    const user = auth.user;

    const userOrders = [
        { id: "#INV-240518-001", prod: "Elysian Gold Herb (100ml)", date: "18 Mei 2026", total: "Rp 450.000", status: "Dalam Pengiriman" },
        { id: "#INV-240510-089", prod: "Midnight Velour (50ml)", date: "10 Mei 2026", total: "Rp 580.000", status: "Selesai" },
    ];

    const savedFormulas = [
        { title: "Formula Malam Eksotis", notes: "Oud, Amber, Vanilla, Black Pepper", date: "15 Mei 2026", match: "98% Kecocokan" },
        { title: "Formula Pagi Musim Semi", notes: "Green Tea, Bergamot, White Musk", date: "12 Mei 2026", match: "95% Kecocokan" },
    ];

    return (
        <AuthenticatedLayout>
            <Head title="Dasbor Pelanggan - Parfumerie AI" />

            <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12 font-sans">

                {/* Hero Greeting Card */}
                <div className="bg-card border border-border rounded-3xl p-8 sm:p-12 shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-bl-full pointer-events-none blur-2xl" />
                    <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-gold/10 rounded-full pointer-events-none blur-3xl" />

                    <div className="space-y-4 relative z-10 max-w-2xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider border border-primary/20">
                            <Sparkles size={14} className="animate-spin" /> Scent Sommelier AI Aktif
                        </div>
                        <h1 className="font-serif text-3xl sm:text-5xl font-extrabold text-foreground tracking-tight leading-tight">
                            Selamat Datang, <span className="text-primary">{user.name}</span>
                        </h1>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                            Berdasarkan analisis olfaktori terakhir Anda, profil aroma khas Anda cenderung mengarah pada kehangatan <span className="text-foreground font-semibold">Oriental Woody</span> dengan sentuhan <span className="text-foreground font-semibold">Citrus Luminary</span>.
                        </p>

                        <div className="pt-2 flex flex-wrap items-center gap-4">
                            <button className="px-6 py-3 bg-primary text-primary-foreground rounded-full text-xs font-semibold shadow-lg shadow-primary/25 hover:opacity-90 transition flex items-center gap-2 transform active:scale-95">
                                <Sparkles size={16} /> Konsultasi Ulang dengan AI
                            </button>
                            <Link href="/" className="px-6 py-3 bg-secondary text-secondary-foreground rounded-full text-xs font-semibold border border-border hover:bg-secondary/80 transition flex items-center gap-2">
                                <Compass size={16} /> Eksplorasi Katalog Penuh
                            </Link>
                        </div>
                    </div>

                    {/* Scent Profile Badge */}
                    <div className="relative z-10 w-full md:w-auto bg-background/80 backdrop-blur-md p-6 rounded-2xl border border-border/80 shadow-md flex flex-col items-center justify-center min-w-[240px]">
                        <div className="size-16 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center text-gold text-2xl font-serif font-bold mb-3 shadow-inner">
                            ✦
                        </div>
                        <span className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Profil Aroma Anda</span>
                        <span className="font-serif text-lg font-bold text-foreground mt-0.5">Warm Amber & Oud</span>
                        <div className="mt-4 pt-4 border-t border-border/80 w-full flex justify-between text-xs">
                            <span className="text-muted-foreground">Poin Loyalitas:</span>
                            <span className="font-bold text-primary">450 Pts</span>
                        </div>
                    </div>
                </div>

                {/* AI Personalized Recommendations */}
                <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/80 pb-6">
                        <div>
                            <h2 className="font-serif text-2xl font-bold text-foreground flex items-center gap-2">
                                <Sparkles className="text-gold" size={24} /> Rekomendasi Terkurasi AI
                            </h2>
                            <p className="text-xs text-muted-foreground mt-1">Disesuaikan secara real-time dengan preferensi dan memori aroma Anda.</p>
                        </div>
                        <span className="text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full uppercase tracking-widest">
                            Akurasi 98%
                        </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {products.map((p) => (
                            <div key={p.id} className="bg-card border border-border rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition duration-300 flex flex-col group">
                                <div className="relative h-64 overflow-hidden bg-secondary">
                                    <img
                                        src={p.image}
                                        alt={p.name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                                    />
                                    <div className="absolute top-3 right-3 bg-background/80 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-bold text-primary border border-border shadow-sm flex items-center gap-1">
                                        <span>✦</span> 98% Match
                                    </div>
                                </div>
                                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                                    <div>
                                        <h3 className="font-serif text-xl font-bold text-foreground group-hover:text-primary transition">
                                            {p.name}
                                        </h3>
                                        <p className="text-xs text-muted-foreground mt-1 italic leading-relaxed">
                                            {p.notes}
                                        </p>
                                    </div>
                                    <div className="pt-4 border-t border-border/60 flex items-center justify-between">
                                        <span className="font-serif font-bold text-foreground text-lg">
                                            {p.price}
                                        </span>
                                        <button className="px-4 py-2 bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground rounded-full text-xs font-semibold transition flex items-center gap-1">
                                            <span>Beli</span> <ArrowRight size={14} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bottom Section: Orders & Saved Formulas */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    
                    {/* Saved Scent Formulas */}
                    <div className="bg-card border border-border rounded-3xl p-8 shadow-xl space-y-6">
                        <div className="flex items-center justify-between border-b border-border/80 pb-4">
                            <h3 className="font-serif text-xl font-bold text-foreground flex items-center gap-2">
                                <Heart size={20} className="text-primary" /> Riwayat Formulasi Scent Sommelier
                            </h3>
                            <span className="text-xs text-muted-foreground">Tersimpan</span>
                        </div>

                        <div className="space-y-4">
                            {savedFormulas.map((form, idx) => (
                                <div key={idx} className="p-5 bg-background rounded-2xl border border-border/80 hover:border-primary/40 transition space-y-2 group">
                                    <div className="flex justify-between items-start">
                                        <h4 className="font-bold text-foreground font-serif text-base group-hover:text-primary transition">{form.title}</h4>
                                        <span className="px-2.5 py-0.5 rounded-full bg-gold/10 text-gold font-bold text-[10px]">{form.match}</span>
                                    </div>
                                    <p className="text-xs text-muted-foreground"><span className="font-semibold text-foreground">Notes:</span> {form.notes}</p>
                                    <div className="flex justify-between text-[10px] text-muted-foreground pt-2">
                                        <span className="flex items-center gap-1"><Clock size={12} /> {form.date}</span>
                                        <button className="text-primary font-semibold hover:underline">Racik Ulang Parfum ➜</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Recent Orders */}
                    <div className="bg-card border border-border rounded-3xl p-8 shadow-xl space-y-6">
                        <div className="flex items-center justify-between border-b border-border/80 pb-4">
                            <h3 className="font-serif text-xl font-bold text-foreground flex items-center gap-2">
                                <ShoppingBag size={20} className="text-primary" /> Pesanan & Transaksi Terakhir
                            </h3>
                            <Link href="#" className="text-xs text-primary font-semibold hover:underline">Lihat Semua</Link>
                        </div>

                        <div className="space-y-4">
                            {userOrders.map((ord, idx) => (
                                <div key={idx} className="p-5 bg-background rounded-2xl border border-border/80 flex items-center justify-between gap-4 hover:bg-secondary/20 transition">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-bold font-mono text-muted-foreground">{ord.id}</span>
                                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase ${
                                                ord.status === 'Selesai' ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-600 border border-amber-500/20 animate-pulse'
                                            }`}>
                                                {ord.status}
                                            </span>
                                        </div>
                                        <h4 className="font-bold text-foreground text-sm font-serif">{ord.prod}</h4>
                                        <span className="text-[11px] text-muted-foreground flex items-center gap-1"><Clock size={12} /> {ord.date}</span>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-serif font-bold text-foreground text-base">{ord.total}</div>
                                        <button className="text-[11px] text-primary font-semibold hover:underline mt-1">Lacak Paket ➜</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>

            </div>
        </AuthenticatedLayout>
    );
}
