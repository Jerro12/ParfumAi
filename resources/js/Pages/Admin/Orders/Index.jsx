import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { Search, Eye, Trash2, X, Sparkles, CheckCircle2, Clock, Truck, Ban, DollarSign, Package, User, MapPin, CreditCard, FileText, ShoppingBag, Store } from 'lucide-react';

export default function OrdersIndex({ orders }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTab, setSelectedTab] = useState('Semua');
    const [inspectingOrder, setInspectingOrder] = useState(null);

    const { data, setData, put, processing } = useForm({
        order_status: 'Menunggu Verifikasi',
        payment_status: 'Menunggu Pembayaran',
    });

    // KPI Metrics Calculation
    const totalOrders = orders.length;
    const totalRevenue = orders
        .filter(o => o.payment_status === 'Terverifikasi' && o.order_status !== 'Dibatalkan')
        .reduce((sum, o) => sum + Number(o.total_amount), 0);
    const pendingCount = orders.filter(o => o.order_status === 'Menunggu Verifikasi').length;
    const storePickupCount = orders.filter(o => o.delivery_type && o.delivery_type.includes('Ambil')).length;

    const filteredOrders = orders.filter(o => {
        const matchesSearch = (o.invoice_number && o.invoice_number.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (o.customer_name && o.customer_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (o.shipping_address && o.shipping_address.toLowerCase().includes(searchQuery.toLowerCase()));

        if (selectedTab === 'Semua') return matchesSearch;
        return matchesSearch && o.order_status === selectedTab;
    });

    const openInspectModal = (order) => {
        setInspectingOrder(order);
        setData({
            order_status: order.order_status || 'Menunggu Verifikasi',
            payment_status: order.payment_status || 'Menunggu Pembayaran',
        });
    };

    const handleUpdateStatus = (e) => {
        e.preventDefault();
        if (!inspectingOrder) return;
        put(route('admin.pembelian.status', inspectingOrder.id), {
            onSuccess: () => {
                setInspectingOrder(null);
            },
        });
    };

    const handleDelete = (order) => {
        if (confirm(`Anda yakin ingin menghapus pesanan #${order.invoice_number}?`)) {
            router.delete(route('admin.pembelian.destroy', order.id), {
                onSuccess: () => {
                    if (inspectingOrder && inspectingOrder.id === order.id) setInspectingOrder(null);
                }
            });
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Menunggu Verifikasi': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
            case 'Diproses': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
            case 'Siap Diambil': return 'bg-gold/10 text-gold border-gold/20';
            case 'Dikirim': return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
            case 'Selesai': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
            case 'Dibatalkan': return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
            default: return 'bg-secondary text-muted-foreground border-border';
        }
    };

    return (
        <AdminLayout title="Kelola Transaksi & Pembelian">
            <Head title="Manajemen Pembelian — Admin Parfumerie AI" />

            {/* Header Title */}
            <div className="border-b border-border/80 pb-6 font-sans">
                <h1 className="font-serif text-3xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
                    <ShoppingBag className="text-gold" size={28} />
                    <span>Pusat Pengelolaan Pesanan & Pembelian</span>
                </h1>
                <p className="text-xs text-muted-foreground mt-1">
                    Pantau pesanan pengiriman kurir ekspedisi maupun pengambilan langsung di butik (In-Store Pickup), verifikasi pembayaran, dan kelola faktur pemesanan secara terpusat.
                </p>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6 font-sans">
                <div className="bg-card border border-border/80 rounded-3xl p-6 shadow-sm flex items-center gap-4 group hover:border-gold/50 transition">
                    <div className="size-14 rounded-2xl bg-gold/10 text-gold flex items-center justify-center border border-gold/20 shrink-0">
                        <DollarSign size={28} />
                    </div>
                    <div>
                        <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Total Pendapatan Terverifikasi</div>
                        <div className="font-serif text-2xl font-extrabold text-foreground mt-0.5">Rp {totalRevenue.toLocaleString('id-ID')}</div>
                    </div>
                </div>

                <div className="bg-card border border-border/80 rounded-3xl p-6 shadow-sm flex items-center gap-4 group hover:border-blue-500/50 transition">
                    <div className="size-14 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center border border-blue-500/20 shrink-0">
                        <Package size={28} />
                    </div>
                    <div>
                        <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Total Seluruh Pesanan</div>
                        <div className="font-serif text-2xl font-extrabold text-foreground mt-0.5">{totalOrders} <span className="text-xs font-sans font-normal text-muted-foreground">Transaksi</span></div>
                    </div>
                </div>

                <div className="bg-card border border-border/80 rounded-3xl p-6 shadow-sm flex items-center gap-4 group hover:border-amber-500/50 transition">
                    <div className="size-14 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center border border-amber-500/20 shrink-0">
                        <Clock size={28} />
                    </div>
                    <div>
                        <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Menunggu Verifikasi</div>
                        <div className="font-serif text-2xl font-extrabold text-amber-500 mt-0.5">{pendingCount} <span className="text-xs font-sans font-normal text-muted-foreground">Antrean</span></div>
                    </div>
                </div>

                <div className="bg-card border border-border/80 rounded-3xl p-6 shadow-sm flex items-center gap-4 group hover:border-emerald-500/50 transition">
                    <div className="size-14 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20 shrink-0">
                        <Store size={28} />
                    </div>
                    <div>
                        <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Ambil Langsung di Toko</div>
                        <div className="font-serif text-2xl font-extrabold text-emerald-400 mt-0.5">{storePickupCount} <span className="text-xs font-sans font-normal text-muted-foreground">Pengambilan</span></div>
                    </div>
                </div>
            </div>

            {/* Controls & Filter Tabs */}
            <div className="flex flex-col lg:flex-row items-center justify-between gap-6 mt-8 font-sans overflow-hidden">
                <div className="flex items-center gap-2 overflow-x-auto w-full lg:w-auto pb-2 lg:pb-0 scrollbar-hide">
                    {['Semua', 'Menunggu Verifikasi', 'Diproses', 'Siap Diambil', 'Dikirim', 'Selesai', 'Dibatalkan'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setSelectedTab(tab)}
                            className={`px-4 py-2 rounded-full text-xs font-bold tracking-wider uppercase whitespace-nowrap transition shadow-sm border ${
                                selectedTab === tab
                                    ? 'bg-primary text-primary-foreground border-primary shadow-primary/20 scale-105'
                                    : 'bg-card text-muted-foreground border-border hover:border-primary/50 hover:text-foreground'
                            }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                <div className="relative w-full lg:w-80">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Cari No. Faktur atau nama pelanggan..."
                        className="w-full pl-10 pr-4 py-2 bg-input/60 text-foreground border border-border rounded-full text-xs focus:outline-none focus:ring-2 focus:ring-primary/50 transition font-medium"
                    />
                </div>
            </div>

            {/* Orders Table */}
            <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-xl mt-6 font-sans">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm border-collapse min-w-[1050px]">
                        <thead>
                            <tr className="border-b border-border/80 bg-secondary/30 text-[11px] text-muted-foreground uppercase tracking-wider font-semibold">
                                <th className="py-4 px-6">No. Faktur & Tanggal</th>
                                <th className="py-4 px-4">Pelanggan</th>
                                <th className="py-4 px-4">Tipe Pengiriman</th>
                                <th className="py-4 px-4">Metode Pembayaran</th>
                                <th className="py-4 px-4">Status Pembayaran</th>
                                <th className="py-4 px-4">Status Transaksi</th>
                                <th className="py-4 px-4 font-serif text-right">Total Transaksi</th>
                                <th className="py-4 px-6 text-right">Tindakan</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/60">
                            {filteredOrders.length === 0 ? (
                                <tr>
                                    <td colSpan="8" className="py-12 text-center text-xs text-muted-foreground italic">
                                        Tidak ada pesanan yang sesuai dengan filter atau pencarian Anda.
                                    </td>
                                </tr>
                            ) : (
                                filteredOrders.map((order) => (
                                    <tr key={order.id} className="hover:bg-secondary/20 transition duration-200 group">
                                        <td className="py-4 px-6 whitespace-nowrap">
                                            <div className="font-mono font-extrabold text-foreground text-sm tracking-wide group-hover:text-gold transition">
                                                {order.invoice_number}
                                            </div>
                                            <div className="text-[11px] text-muted-foreground mt-0.5">
                                                📅 {order.created_date || 'Hari ini'}
                                            </div>
                                        </td>
                                        <td className="py-4 px-4">
                                            <div className="font-serif font-bold text-foreground text-base truncate max-w-[180px]">
                                                {order.customer_name}
                                            </div>
                                            <div className="text-[11px] text-muted-foreground font-mono">
                                                📞 {order.customer_phone}
                                            </div>
                                        </td>
                                        <td className="py-4 px-4 whitespace-nowrap">
                                            {order.delivery_type && order.delivery_type.includes('Ambil') ? (
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full text-[10px] font-bold tracking-wider uppercase">
                                                    <Store size={12} /> Ambil di Toko
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full text-[10px] font-bold tracking-wider uppercase">
                                                    <Truck size={12} /> Kirim Kurir
                                                </span>
                                            )}
                                        </td>
                                        <td className="py-4 px-4">
                                            <span className="px-3 py-1 bg-secondary text-foreground border border-border rounded-full text-[10px] font-bold tracking-wider uppercase whitespace-nowrap">
                                                💳 {order.payment_method.replace(/ \(.+\)/, '')}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase border whitespace-nowrap ${
                                                order.payment_status === 'Terverifikasi'
                                                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                                    : order.payment_status === 'Gagal'
                                                        ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                                                        : 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                                            }`}>
                                                {order.payment_status === 'Terverifikasi' ? '✓ Terverifikasi' : order.payment_status}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4 whitespace-nowrap">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase border whitespace-nowrap ${getStatusColor(order.order_status)}`}>
                                                {order.order_status}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4 font-mono font-extrabold text-foreground text-base text-right whitespace-nowrap">
                                            {order.total_formatted}
                                            <div className="text-[10px] text-muted-foreground font-sans font-normal">{(order.items || []).length} Item Parfum</div>
                                        </td>
                                        <td className="py-4 px-6 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => openInspectModal(order)}
                                                    className="p-2 bg-secondary/80 hover:bg-primary/10 hover:text-primary text-foreground rounded-xl transition shadow-sm border border-border"
                                                    title="Lihat rincian & verifikasi"
                                                >
                                                    <Eye size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(order)}
                                                    className="p-2 bg-secondary/80 hover:bg-destructive/10 hover:text-destructive text-foreground rounded-xl transition shadow-sm border border-border"
                                                    title="Hapus pesanan"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Inspect Order & Status Update Modal */}
            {inspectingOrder && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md animate-fade-in font-sans">
                    <div className="bg-card border border-border/80 rounded-3xl p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl space-y-6 relative">
                        
                        <div className="flex items-center justify-between border-b border-border/80 pb-4">
                            <div>
                                <h2 className="font-serif text-2xl font-bold flex items-center gap-2">
                                    <Sparkles className="text-gold" size={20} />
                                    <span>Rincian Transaksi #{inspectingOrder.invoice_number}</span>
                                </h2>
                                <p className="text-xs text-muted-foreground mt-0.5">Tanggal Pemesanan: {inspectingOrder.created_date}</p>
                            </div>
                            <button
                                onClick={() => setInspectingOrder(null)}
                                className="p-2 rounded-full hover:bg-secondary text-muted-foreground transition"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Store Pickup Notice / Banner */}
                        {inspectingOrder.delivery_type && inspectingOrder.delivery_type.includes('Ambil') && (
                            <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-start gap-3 text-emerald-400">
                                <Store size={24} className="shrink-0 mt-0.5 text-emerald-400" />
                                <div className="space-y-1">
                                    <div className="text-xs font-bold text-foreground uppercase tracking-wider">🏪 Transaksi In-Store / Pengambilan Butik Fisik</div>
                                    <p className="text-xs text-muted-foreground font-sans leading-relaxed">
                                        Pelanggan ini memilih untuk mengambil atau membayar pesanannya secara langsung di kasir toko fisik. Siapkan barang di keranjang pengambilan kasir dan pastikan bukti QRIS/Tunai sudah diselesaikan saat penyerahan.
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Customer Info Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-secondary/30 p-6 rounded-2xl border border-border">
                            <div className="space-y-2">
                                <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                                    <User size={14} className="text-primary" /> Informasi Pemesan
                                </div>
                                <div className="font-serif text-lg font-bold text-foreground">{inspectingOrder.customer_name}</div>
                                <div className="text-xs text-muted-foreground font-mono">✉ {inspectingOrder.customer_email}</div>
                                <div className="text-xs text-muted-foreground font-mono">📞 {inspectingOrder.customer_phone}</div>
                            </div>

                            <div className="space-y-2">
                                <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                                    <MapPin size={14} className="text-gold" /> Alamat / Tujuan Pengiriman
                                </div>
                                <p className="text-xs text-foreground leading-relaxed font-medium">
                                    {inspectingOrder.shipping_address}
                                </p>
                            </div>

                            <div className="md:col-span-2 pt-4 border-t border-border/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                <div className="space-y-1">
                                    <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Metode Pembayaran</span>
                                    <div className="font-bold text-sm text-foreground flex items-center gap-1.5">
                                        <CreditCard size={16} className="text-primary" /> {inspectingOrder.payment_method}
                                    </div>
                                </div>
                                {inspectingOrder.notes && (
                                    <div className="space-y-1 bg-background p-3 rounded-xl border border-border/80 flex-1 ml-0 sm:ml-4">
                                        <span className="text-[11px] font-bold uppercase tracking-wider text-gold flex items-center gap-1">
                                            <FileText size={12} /> Catatan Pembeli
                                        </span>
                                        <p className="text-xs text-muted-foreground italic font-medium">"{inspectingOrder.notes}"</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Purchased Items Table */}
                        <div className="space-y-3">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Rincian Produk Parfum yang Dipesan</h3>
                            <div className="border border-border rounded-2xl overflow-hidden">
                                <table className="w-full text-left text-xs border-collapse">
                                    <thead>
                                        <tr className="bg-secondary/50 border-b border-border/80 text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">
                                            <th className="py-3 px-4">Nama Parfum & Ukuran Botol</th>
                                            <th className="py-3 px-4">Harga Satuan</th>
                                            <th className="py-3 px-4 text-center">Kuantitas</th>
                                            <th className="py-3 px-4 text-right font-serif">Subtotal</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border/60">
                                        {(inspectingOrder.items || []).map((item, idx) => (
                                            <tr key={item.id || idx} className="hover:bg-secondary/20">
                                                <td className="py-3 px-4">
                                                    <div className="font-serif font-bold text-foreground text-sm">{item.product_name}</div>
                                                    <span className="inline-block mt-0.5 px-2 py-0.5 bg-primary/10 text-primary border border-primary/20 rounded text-[10px] font-bold tracking-wider uppercase">
                                                        Varian {item.bottle_size}
                                                    </span>
                                                </td>
                                                <td className="py-3 px-4 font-mono font-medium">Rp {Number(item.unit_price).toLocaleString('id-ID')}</td>
                                                <td className="py-3 px-4 text-center font-bold text-sm">{item.quantity}x</td>
                                                <td className="py-3 px-4 text-right font-mono font-bold text-sm text-gold">
                                                    Rp {Number(item.subtotal).toLocaleString('id-ID')}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                    <tfoot>
                                        <tr className="bg-secondary/30 border-t border-border font-extrabold text-sm font-serif">
                                            <td colSpan="3" className="py-3 px-4 text-right">Total Transaksi Resmi:</td>
                                            <td className="py-3 px-4 text-right font-mono text-base text-foreground">{inspectingOrder.total_formatted}</td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        </div>

                        {/* Status Management Form */}
                        <form onSubmit={handleUpdateStatus} className="space-y-6 pt-4 border-t border-border/80">
                            <h3 className="text-xs font-extrabold uppercase tracking-widest text-primary">Verifikasi & Pembaruan Status</h3>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div>
                                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Status Verifikasi Pembayaran</label>
                                    <select
                                        value={data.payment_status}
                                        onChange={(e) => setData('payment_status', e.target.value)}
                                        className="mt-1.5 w-full bg-input/80 text-foreground border border-border rounded-xl px-4 py-3 text-xs font-bold uppercase focus:outline-none focus:ring-2 focus:ring-primary/50"
                                    >
                                        <option value="Menunggu Pembayaran">⏳ Menunggu Pembayaran</option>
                                        <option value="Terverifikasi">✓ Terverifikasi Lunas</option>
                                        <option value="Gagal">✕ Gagal / Ditolak</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Status Proses / Pengiriman</label>
                                    <select
                                        value={data.order_status}
                                        onChange={(e) => setData('order_status', e.target.value)}
                                        className="mt-1.5 w-full bg-input/80 text-foreground border border-border rounded-xl px-4 py-3 text-xs font-bold uppercase focus:outline-none focus:ring-2 focus:ring-primary/50"
                                    >
                                        <option value="Menunggu Verifikasi">Menunggu Verifikasi</option>
                                        <option value="Diproses">Diproses / Dikemas</option>
                                        <option value="Siap Diambil">Siap Diambil di Kasir Butik</option>
                                        <option value="Dikirim">Dikirim via Kurir Ekspedisi</option>
                                        <option value="Selesai">Selesai / Diterima</option>
                                        <option value="Dibatalkan">Dibatalkan</option>
                                    </select>
                                </div>
                            </div>

                            <div className="pt-4 flex items-center justify-end gap-4">
                                <button
                                    type="button"
                                    onClick={() => setInspectingOrder(null)}
                                    className="px-6 py-2.5 bg-secondary text-secondary-foreground rounded-full text-xs font-bold uppercase tracking-wider hover:bg-secondary/80 transition"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-8 py-2.5 bg-primary text-primary-foreground rounded-full text-xs font-bold uppercase tracking-wider shadow-lg shadow-primary/25 hover:opacity-90 transition transform active:scale-95"
                                >
                                    {processing ? 'Menyimpan...' : 'Simpan Perubahan Status'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
