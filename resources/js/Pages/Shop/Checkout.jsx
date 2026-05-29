import { SiteHeader } from '@/Components/SiteHeader';
import { SiteFooter } from '@/Components/SiteFooter';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { ShieldCheck, Truck, CreditCard, QrCode, Building2, Store, Check, Sparkles, ArrowLeft, Clock, ShoppingBag } from 'lucide-react';

export default function Checkout({ cartItems = [], totalAmount = 0, totalFormatted = 'Rp 0', defaultName = '', defaultEmail = '' }) {
    const [deliveryType, setDeliveryType] = useState('Kirim ke Alamat (Kurir / Ekspedisi)');
    const [selectedCourier, setSelectedCourier] = useState('Parfumerie VIP Express (1 Hari Sampai)');
    const [selectedPayment, setSelectedPayment] = useState('WhatsApp Payment Link (Bayar Langsung via Chat WhatsApp Admin)');
    const [isLoading, setIsLoading] = useState(false);

    const [form, setForm] = useState({
        customer_name: defaultName || '',
        customer_email: defaultEmail || '',
        customer_phone: '',
        shipping_address: '',
        notes: '',
    });

    const courierCost = 0; // Bebas ongkir
    const subtotal = Number(totalAmount);
    const finalTotal = subtotal + courierCost;

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);

        router.post(route('checkout.process'), {
            customer_name: form.customer_name,
            customer_email: form.customer_email,
            customer_phone: form.customer_phone,
            delivery_type: deliveryType,
            shipping_address: form.shipping_address,
            payment_method: selectedPayment,
            notes: form.notes,
        }, {
            onFinish: () => setIsLoading(false),
        });
    };

    return (
        <div className="min-h-screen flex flex-col bg-background text-foreground antialiased font-sans">
            <Head title="Penyelesaian Pembayaran — Parfumerie AI" />
            <SiteHeader />

            <main className="flex-1 container mx-auto px-6 pt-12 pb-24 max-w-7xl font-sans">
                
                <div className="border-b border-border/80 pb-6 mb-12 font-sans">
                    <h1 className="font-serif text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground flex items-center gap-3">
                        <ShieldCheck className="text-primary" size={36} /> Formulir Penyelesaian Transaksi
                    </h1>
                    <p className="text-xs text-muted-foreground mt-1 font-sans">
                        Lengkapi informasi penerima untuk mencatat faktur pemesanan Anda dan hubungkan langsung ke WhatsApp.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start font-sans">
                    
                    {/* Checkout Form */}
                    <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-8 font-sans">
                        
                        {/* Informasi Pemesan & Alamat */}
                        <div className="bg-card border border-border rounded-3xl p-8 shadow-xl space-y-6 font-sans">
                            <div className="flex items-center gap-3 border-b border-border/80 pb-4 font-sans">
                                <div className="size-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm font-mono">✦</div>
                                <h2 className="font-serif text-2xl font-bold">Informasi Penerima & Alamat Pengiriman</h2>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 font-sans">
                                <div>
                                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground font-sans">Nama Lengkap</label>
                                    <input
                                        type="text"
                                        value={form.customer_name}
                                        onChange={(e) => setForm({ ...form, customer_name: e.target.value })}
                                        required
                                        className="mt-1.5 w-full bg-input/80 text-foreground border border-border rounded-xl px-4 py-3 text-xs focus:outline-none focus:ring-2 focus:ring-primary/50 font-bold"
                                        placeholder="Contoh: Budi Santoso"
                                    />
                                </div>

                                <div>
                                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground font-sans">Alamat Surel / Email</label>
                                    <input
                                        type="email"
                                        value={form.customer_email}
                                        onChange={(e) => setForm({ ...form, customer_email: e.target.value })}
                                        required
                                        className="mt-1.5 w-full bg-input/80 text-foreground border border-border rounded-xl px-4 py-3 text-xs focus:outline-none focus:ring-2 focus:ring-primary/50 font-mono"
                                        placeholder="budi@example.com"
                                    />
                                </div>

                                <div>
                                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground font-sans">No. WhatsApp / Telepon Aktif (Penting)</label>
                                    <input
                                        type="tel"
                                        value={form.customer_phone}
                                        onChange={(e) => setForm({ ...form, customer_phone: e.target.value })}
                                        required
                                        className="mt-1.5 w-full bg-input/80 border border-border rounded-xl px-4 py-3 text-xs focus:outline-none focus:ring-2 focus:ring-primary/50 font-mono font-bold text-primary"
                                        placeholder="Contoh: 08123456789"
                                    />
                                </div>

                                <div>
                                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground font-sans">Catatan Tambahan (Opsional)</label>
                                    <input
                                        type="text"
                                        value={form.notes}
                                        onChange={(e) => setForm({ ...form, notes: e.target.value })}
                                        className="mt-1.5 w-full bg-input/80 text-foreground border border-border rounded-xl px-4 py-3 text-xs focus:outline-none focus:ring-2 focus:ring-primary/50 font-sans"
                                        placeholder="Contoh: Titip di satpam depan"
                                    />
                                </div>

                                <div className="sm:col-span-2 font-sans">
                                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground font-sans">
                                        Alamat Lengkap Pengiriman (RT/RW, Kecamatan, Kota, Kode Pos)
                                    </label>
                                    <textarea
                                        rows="3"
                                        value={form.shipping_address}
                                        onChange={(e) => setForm({ ...form, shipping_address: e.target.value })}
                                        required
                                        className="mt-1.5 w-full bg-input/80 text-foreground border border-border rounded-xl px-4 py-3 text-xs focus:outline-none focus:ring-2 focus:ring-primary/50 leading-relaxed font-sans"
                                        placeholder="Jl. Merdeka No. 45, Kebayoran Baru, Jakarta Selatan, 12110"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="p-6 bg-card border border-border rounded-3xl text-left space-y-3 font-sans shadow-xl">
                            <span className="text-xs font-bold text-gold uppercase tracking-widest font-sans flex items-center gap-1.5">
                                <Sparkles size={14} /> Keamanan Transaksi & Hubungkan ke WhatsApp
                            </span>
                            <p className="text-[11px] text-muted-foreground leading-relaxed font-sans">
                                Setelah menekan tombol <strong>"Konfirmasi & Kirim Pesanan ke WhatsApp"</strong> di bawah, data pesanan Anda akan segera disimpan ke sistem dan Anda akan dialihkan secara otomatis ke chat WhatsApp admin butik dengan pesan rincian pesanan yang sudah terisi lengkap.
                            </p>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-4 bg-primary text-primary-foreground rounded-full font-bold text-xs uppercase tracking-widest shadow-xl shadow-primary/25 hover:opacity-90 transition transform active:scale-95 flex items-center justify-center gap-2 font-sans"
                        >
                            {isLoading ? (
                                <>
                                    <Clock size={18} className="animate-spin" /> Memproses Transaksi...
                                </>
                            ) : (
                                <>
                                    <ShieldCheck size={18} /> Konfirmasi & Kirim Pesanan ke WhatsApp (Rp {finalTotal.toLocaleString('id-ID')})
                                </>
                            )}
                        </button>
                    </form>

                    {/* Order Summary Sidebar */}
                    <div className="bg-card border border-border rounded-3xl p-8 shadow-xl space-y-6 sticky top-28 font-sans">
                        <h3 className="font-serif text-2xl font-bold text-foreground border-b border-border/80 pb-4">Daftar Belanja Anda</h3>

                        <div className="space-y-4 divide-y divide-border/60 font-sans max-h-80 overflow-y-auto pr-2">
                            {cartItems.map((item) => (
                                <div key={item.id} className="flex justify-between items-center text-xs pt-3 font-sans">
                                    <div className="font-sans">
                                        <div className="font-bold text-foreground truncate max-w-[160px]">
                                            {item.quantity}x {item.product?.name || 'Parfum'}
                                        </div>
                                        <div className="text-[11px] text-primary uppercase font-bold tracking-wider">{item.bottle_size}</div>
                                    </div>
                                    <div className="font-mono font-bold text-foreground">
                                        Rp {(Number(item.unit_price) * item.quantity).toLocaleString('id-ID')}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="space-y-3 pt-6 border-t border-border/80 text-xs font-sans">
                            <div className="flex justify-between text-muted-foreground font-sans">
                                <span>Subtotal Produk:</span>
                                <span className="font-mono font-bold text-foreground">Rp {subtotal.toLocaleString('id-ID')}</span>
                            </div>
                            <div className="flex justify-between text-muted-foreground font-sans">
                                <span>Ongkos Kirim:</span>
                                <span className="font-mono font-bold text-foreground">Rp {courierCost.toLocaleString('id-ID')}</span>
                            </div>
                            <div className="pt-4 border-t border-border/80 flex justify-between items-baseline font-sans">
                                <span className="text-sm font-bold uppercase tracking-wider text-foreground font-sans">Total Tagihan:</span>
                                <span className="font-mono text-3xl font-extrabold tracking-tight text-gold">
                                    Rp {finalTotal.toLocaleString('id-ID')}
                                </span>
                            </div>
                        </div>

                        <div className="p-4 bg-secondary/50 rounded-2xl border border-border/80 text-center text-xs space-y-1 font-sans">
                            <div className="font-bold text-primary flex items-center justify-center gap-1 font-sans">
                                <ShieldCheck size={14} /> Jaminan Parfumerie AI
                            </div>
                            <div className="text-[11px] text-muted-foreground font-sans">Verifikasi instan & garansi penuh pengiriman.</div>
                        </div>
                    </div>

                </div>
            </main>

            <SiteFooter />
        </div>
    );
}
