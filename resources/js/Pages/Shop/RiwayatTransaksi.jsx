import { SiteHeader } from '@/Components/SiteHeader';
import { SiteFooter } from '@/Components/SiteFooter';
import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import { Package, Store, Truck, Clock, CheckCircle2, QrCode, ArrowRight, ShieldCheck, FileText, X, Printer, MapPin, Sparkles } from 'lucide-react';

export default function RiwayatTransaksi({ orders = [] }) {
    const [filter, setFilter] = useState('Semua');
    const [selectedOrder, setSelectedOrder] = useState(null);

    const filteredOrders = orders.filter(o => {
        if (filter === 'Ambil di Toko') return o.delivery_type.includes('Ambil');
        if (filter === 'Kirim Ekspedisi') return o.delivery_type.includes('Kirim');
        return true;
    });

    const getStatusBadge = (status) => {
        switch (status) {
            case 'Siap Diambil':
                return <span className="px-3 py-1 bg-emerald-500/10 text-emerald-600 rounded-full font-bold text-xs flex items-center gap-1.5"><CheckCircle2 size={14} /> Siap Diambil di Kasir</span>;
            case 'Selesai':
                return <span className="px-3 py-1 bg-emerald-500/10 text-emerald-600 rounded-full font-bold text-xs flex items-center gap-1.5"><CheckCircle2 size={14} /> Transaksi Selesai</span>;
            case 'Dikirim':
            case 'Diproses':
                return <span className="px-3 py-1 bg-primary/10 text-primary rounded-full font-bold text-xs flex items-center gap-1.5"><Clock size={14} className="animate-spin" /> Sedang Diproses / Dikirim</span>;
            default:
                return <span className="px-3 py-1 bg-amber-500/10 text-amber-600 rounded-full font-bold text-xs flex items-center gap-1.5"><Clock size={14} /> {status || 'Menunggu Verifikasi'}</span>;
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-background text-foreground antialiased font-sans">
            <Head title="Riwayat & Tiket Pengambilan Toko — Parfumerie AI" />
            <SiteHeader />

            <main className="flex-1 container mx-auto px-6 pt-12 pb-24 max-w-7xl font-sans">
                
                {/* Header Banner */}
                <div className="bg-card border border-border rounded-3xl p-8 sm:p-12 shadow-2xl mb-12 relative overflow-hidden font-sans">
                    <div className="absolute -top-24 -right-24 w-80 h-80 bg-gold/10 rounded-full blur-3xl pointer-events-none" />
                    <div className="relative z-10 max-w-2xl space-y-4 font-sans">
                        <span className="px-3.5 py-1.5 rounded-full bg-primary/10 text-primary font-bold text-xs uppercase tracking-wider font-sans">
                            Area Pelanggan Terverifikasi
                        </span>
                        <h1 className="font-serif text-3xl sm:text-5xl font-extrabold text-foreground tracking-tight">
                            Riwayat Transaksi & Tiket Pengambilan Toko
                        </h1>
                        <p className="text-muted-foreground text-sm leading-relaxed font-sans">
                            Pantau status pengiriman paket ekspedisi Anda atau tampilkan tiket digital QR Code di meja kasir butik fisik Parfumerie AI untuk pengambilan instan tanpa antrean.
                        </p>
                    </div>
                </div>

                {/* Filter Tabs */}
                <div className="flex flex-wrap items-center gap-3 border-b border-border/80 pb-6 mb-8 font-sans">
                    {['Semua', 'Ambil di Toko', 'Kirim Ekspedisi'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setFilter(tab)}
                            className={`px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition font-sans ${
                                filter === tab
                                    ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20'
                                    : 'bg-card border border-border text-muted-foreground hover:border-border/80 hover:text-foreground'
                            }`}
                        >
                            {tab === 'Ambil di Toko' && '🏪 '} Ambil di Toko (*In-Store*)
                            {tab === 'Kirim Ekspedisi' && '🚚 Kirim via Kurir'}
                            {tab === 'Semua' && '📋 Semua Transaksi'}
                        </button>
                    ))}
                </div>

                {filteredOrders.length === 0 ? (
                    <div className="text-center py-20 bg-card border border-border rounded-3xl space-y-5 shadow-sm font-sans">
                        <div className="size-20 mx-auto rounded-full bg-secondary text-muted-foreground flex items-center justify-center border border-border font-sans">
                            <Package size={32} />
                        </div>
                        <h2 className="font-serif text-2xl font-bold text-foreground">Belum Ada Transaksi</h2>
                        <p className="text-xs text-muted-foreground max-w-md mx-auto font-sans">
                            Anda belum memiliki riwayat pesanan dengan filter ini. Temukan wewangian premium favorit Anda di katalog eksklusif kami.
                        </p>
                        <Link href={route('katalog')} className="inline-block px-8 py-3.5 bg-primary text-primary-foreground rounded-full text-xs font-bold uppercase tracking-wider shadow-md hover:opacity-90 transition font-sans">
                            Eksplorasi Katalog Toko ➜
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 font-sans">
                        {filteredOrders.map((o) => (
                            <div key={o.id} className="bg-card border border-border rounded-3xl p-8 shadow-xl flex flex-col justify-between space-y-6 hover:border-gold/50 transition duration-300 relative overflow-hidden font-sans">
                                <div className="space-y-4 font-sans">
                                    <div className="flex justify-between items-start font-sans">
                                        <div className="font-sans">
                                            <span className="font-mono text-xs font-bold text-foreground bg-secondary px-2.5 py-1 rounded-md border border-border">
                                                {o.invoice_number}
                                            </span>
                                            <div className="text-[10px] text-muted-foreground mt-1 font-mono">
                                                {new Date(o.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                        </div>
                                        <div>{getStatusBadge(o.order_status)}</div>
                                    </div>

                                    <div className="p-3 bg-background rounded-2xl border border-border/80 flex items-center gap-3 font-sans">
                                        {o.delivery_type.includes('Ambil') ? (
                                            <Store size={20} className="text-emerald-500 shrink-0" />
                                        ) : (
                                            <Truck size={20} className="text-primary shrink-0" />
                                        )}
                                        <div className="text-xs font-sans">
                                            <div className="font-bold text-foreground font-sans">
                                                {o.delivery_type.includes('Ambil') ? 'Ambil Langsung di Butik Fisik' : 'Kirim via Kurir Ekspedisi'}
                                            </div>
                                            <div className="text-[10px] text-muted-foreground truncate max-w-[200px] font-sans">
                                                {o.shipping_address}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2 pt-2 border-t border-border/60 font-sans">
                                        <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Rincian Parfum:</div>
                                        <div className="max-h-24 overflow-y-auto space-y-1 pr-1 font-sans">
                                            {o.items?.map((item) => (
                                                <div key={item.id} className="flex justify-between items-center text-xs font-sans">
                                                    <span className="text-foreground truncate max-w-[180px]">
                                                        {item.quantity}x <strong className="font-serif">{item.product_name}</strong>
                                                    </span>
                                                    <span className="text-muted-foreground font-mono text-[11px] uppercase">{item.bottle_size}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-border/80 flex items-center justify-between font-sans">
                                    <div className="font-sans">
                                        <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Total Pembayaran</span>
                                        <div className="font-mono text-xl font-extrabold text-foreground">
                                            Rp {Number(o.total_amount).toLocaleString('id-ID')}
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => setSelectedOrder(o)}
                                        className="px-5 py-2.5 rounded-full bg-primary text-primary-foreground text-xs font-bold uppercase tracking-wider hover:opacity-90 transition flex items-center gap-1.5 shadow-md shadow-primary/20 font-sans"
                                    >
                                        <QrCode size={16} /> Tiket & Invois
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Pickup Ticket Modal */}
                {selectedOrder && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md animate-fade-in font-sans">
                        <div className="bg-card border border-border/80 rounded-3xl p-8 sm:p-12 max-w-xl w-full shadow-2xl relative space-y-6 max-h-[90vh] overflow-y-auto font-sans">
                            <button
                                onClick={() => setSelectedOrder(null)}
                                className="absolute top-6 right-6 size-10 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition font-sans"
                            >
                                <X size={20} />
                            </button>

                            <div className="text-center space-y-2 border-b border-border/80 pb-6 font-sans">
                                <span className="px-3.5 py-1 rounded-full bg-gold/15 text-gold font-bold font-serif text-xs uppercase tracking-wider">
                                    Faktur & Tiket Pengambilan Toko
                                </span>
                                <h3 className="font-serif text-3xl font-bold text-foreground tracking-tight">
                                    {selectedOrder.invoice_number}
                                </h3>
                                <p className="text-xs text-muted-foreground font-mono">
                                    Tanggal Transaksi: {new Date(selectedOrder.created_at).toLocaleDateString('id-ID', { dateStyle: 'full' })}
                                </p>
                            </div>

                            {/* QR Barcode Section */}
                            <div className="bg-background rounded-3xl p-8 border border-border text-center space-y-4 shadow-inner font-sans">
                                <div className="inline-block p-4 bg-white rounded-2xl shadow-md border border-gray-200 font-sans">
                                    <QrCode size={180} className="text-gray-900 mx-auto" />
                                </div>
                                <div className="font-mono font-bold tracking-[0.25em] text-foreground text-sm uppercase">
                                    {selectedOrder.invoice_number}
                                </div>
                                <p className="text-xs text-muted-foreground leading-relaxed max-w-sm mx-auto font-sans">
                                    {selectedOrder.delivery_type.includes('Ambil') ? (
                                        <strong>🏪 Tunjukkan barcode digital ini kepada sommelier atau kasir di butik Parfumerie AI untuk mengambil pesanan Anda tanpa antrean.</strong>
                                    ) : (
                                        <span>🚚 Pesanan Anda sedang dipersiapkan untuk dikirim oleh jasa ekspedisi ke alamat tujuan.</span>
                                    )}
                                </p>
                            </div>

                            <div className="space-y-4 bg-secondary/50 rounded-2xl p-6 border border-border/80 font-sans">
                                <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground font-sans">Rincian Pembelian:</div>
                                <div className="space-y-2 divide-y divide-border/60 font-sans">
                                    {selectedOrder.items?.map((item) => (
                                        <div key={item.id} className="flex justify-between items-center text-xs pt-2 font-sans">
                                            <div className="font-sans">
                                                <div className="font-bold text-foreground font-serif">{item.product_name}</div>
                                                <div className="text-[10px] text-primary uppercase font-bold tracking-wider">{item.bottle_size} ({item.quantity}x botol)</div>
                                            </div>
                                            <div className="font-mono font-bold text-foreground">
                                                Rp {Number(item.subtotal).toLocaleString('id-ID')}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-2 pt-2 text-xs font-sans">
                                <div className="flex justify-between font-sans">
                                    <span className="text-muted-foreground font-sans">Metode Pembayaran:</span>
                                    <span className="font-semibold text-foreground font-sans">{selectedOrder.payment_method}</span>
                                </div>
                                <div className="flex justify-between font-sans">
                                    <span className="text-muted-foreground font-sans">Status Pesanan:</span>
                                    <span className="font-bold text-primary font-sans">{selectedOrder.order_status}</span>
                                </div>
                                <div className="flex justify-between pt-3 border-t border-border/80 font-serif font-bold text-lg">
                                    <span className="font-sans font-bold">Total Tagihan:</span>
                                    <span className="text-gold font-mono font-bold">Rp {Number(selectedOrder.total_amount).toLocaleString('id-ID')}</span>
                                </div>
                            </div>

                            <div className="pt-4 flex items-center justify-between gap-4 font-sans">
                                <button
                                    onClick={() => window.print()}
                                    className="flex-1 py-3.5 bg-secondary text-secondary-foreground border border-border rounded-full text-xs font-bold uppercase tracking-wider hover:bg-secondary/80 transition flex items-center justify-center gap-2 font-sans"
                                >
                                    <Printer size={16} /> Cetak Tiket / PDF
                                </button>
                                {selectedOrder.delivery_type.includes('Ambil') && (
                                    <Link
                                        href={route('tentang')}
                                        className="flex-1 py-3.5 bg-emerald-600 text-white rounded-full text-xs font-bold uppercase tracking-wider hover:bg-emerald-500 transition flex items-center justify-center gap-2 text-center font-sans"
                                    >
                                        <MapPin size={16} /> Lokasi Butik Fisik
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </main>

            <SiteFooter />
        </div>
    );
}
