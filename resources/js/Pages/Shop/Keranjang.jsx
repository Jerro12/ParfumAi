import { SiteHeader } from '@/Components/SiteHeader';
import { SiteFooter } from '@/Components/SiteFooter';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { Trash2, Gift, ShieldCheck, ArrowRight, ArrowLeft, Tag, ShoppingBag, Package } from 'lucide-react';

export default function Keranjang({ cartItems = [], totalAmount = 0, totalFormatted = 'Rp 0' }) {
    const [promoCode, setPromoCode] = useState('');
    const [discount, setDiscount] = useState(0);
    const [promoApplied, setPromoApplied] = useState(false);

    const updateQty = (id, currentQty, delta) => {
        const newQty = Math.max(1, currentQty + delta);
        router.put(route('keranjang.update', id), { quantity: newQty }, { preserveScroll: true });
    };

    const removeItem = (id) => {
        router.delete(route('keranjang.destroy', id), { preserveScroll: true });
    };

    const subtotal = Number(totalAmount);
    const finalTotal = Math.max(0, subtotal - discount);

    const applyPromo = (e) => {
        e.preventDefault();
        if (promoCode.toUpperCase() === 'SOMMELIER100') {
            setDiscount(100000);
            setPromoApplied(true);
        } else {
            alert('Kode voucher tidak ditemukan atau sudah kedaluwarsa.');
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-background text-foreground antialiased font-sans">
            <Head title="Keranjang Belanja — Parfumerie AI" />
            <SiteHeader />

            <main className="flex-1 container mx-auto px-6 pt-12 pb-24 max-w-7xl space-y-12 font-sans">
                
                <div className="border-b border-border/80 pb-6">
                    <h1 className="font-serif text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground flex items-center gap-3">
                        <ShoppingBag className="text-primary" size={36} /> Tas Belanja Olfaktori ({cartItems.length})
                    </h1>
                    <p className="text-xs text-muted-foreground mt-1 font-sans">Periksa kembali pilihan wewangian dan kemasan mewah pesanan Anda sebelum melakukan pembayaran.</p>
                </div>

                {cartItems.length === 0 ? (
                    <div className="text-center py-24 bg-card border border-border rounded-3xl space-y-5 shadow-sm">
                        <div className="size-20 mx-auto rounded-full bg-secondary text-muted-foreground flex items-center justify-center border border-border">
                            <ShoppingBag size={32} />
                        </div>
                        <h2 className="font-serif text-3xl font-bold text-foreground">Keranjang Belanja Kosong</h2>
                        <p className="text-sm text-muted-foreground max-w-md mx-auto font-sans">
                            Anda belum memilih parfum apapun. Mari temukan keharuman impian Anda di katalog eksklusif kami.
                        </p>
                        <Link href={route('katalog')} className="inline-block px-8 py-3.5 bg-primary text-primary-foreground rounded-full text-xs font-bold uppercase tracking-wider shadow-lg shadow-primary/20 hover:opacity-90 transition font-sans">
                            Mulai Eksplorasi Katalog ➜
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start font-sans">
                        
                        {/* Cart Items Table/List */}
                        <div className="lg:col-span-2 space-y-6">
                            <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-xl divide-y divide-border/80 font-sans">
                                {cartItems.map((item) => (
                                    <div key={item.id} className="py-6 first:pt-0 last:pb-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 font-sans">
                                        <div className="flex items-center gap-5">
                                            <img
                                                src={item.product?.image || 'https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=800&auto=format&fit=crop'}
                                                alt={item.product?.name || 'Parfum'}
                                                className="size-24 sm:size-28 rounded-2xl object-cover bg-secondary border border-border shrink-0 shadow-inner"
                                            />
                                            <div className="space-y-1 font-sans">
                                                <span className="text-[10px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-full bg-secondary text-muted-foreground border border-border font-sans">
                                                    {item.product?.category || 'Eksklusif'}
                                                </span>
                                                <Link href={route('katalog.detail', { id: item.product_id })}>
                                                    <h3 className="font-serif text-xl sm:text-2xl font-bold text-foreground hover:text-primary transition duration-200">
                                                        {item.product?.name || 'Parfum Eksklusif'}
                                                    </h3>
                                                </Link>
                                                <p className="text-xs text-muted-foreground font-sans">
                                                    Ukuran Botol: <span className="font-bold text-primary uppercase">{item.bottle_size}</span>
                                                </p>
                                                <p className="font-mono font-extrabold text-foreground text-lg pt-1">
                                                    Rp {(Number(item.unit_price) * item.quantity).toLocaleString('id-ID')}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between w-full sm:w-auto gap-6 pt-4 sm:pt-0 border-t border-border/80 sm:border-0 font-sans">
                                            <div className="flex items-center border border-border bg-input rounded-full p-1 shadow-sm font-sans">
                                                <button
                                                    onClick={() => updateQty(item.id, item.quantity, -1)}
                                                    className="size-8 rounded-full flex items-center justify-center font-bold text-foreground hover:bg-secondary transition font-mono"
                                                >
                                                    -
                                                </button>
                                                <span className="w-10 text-center text-xs font-bold font-mono">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQty(item.id, item.quantity, 1)}
                                                    className="size-8 rounded-full flex items-center justify-center font-bold text-foreground hover:bg-secondary transition font-mono"
                                                >
                                                    +
                                                </button>
                                            </div>

                                            <button
                                                onClick={() => removeItem(item.id)}
                                                className="p-2.5 rounded-full text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 transition"
                                                title="Hapus dari keranjang"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="flex items-center justify-between pt-4 font-sans">
                                <Link href={route('katalog')} className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary hover:underline">
                                    <ArrowLeft size={16} /> Lanjut Memilih Parfum
                                </Link>
                            </div>
                        </div>

                        {/* Order Summary & Gift Box Configurator */}
                        <div className="space-y-6 font-sans">
                            


                            {/* Order Summary Box */}
                            <div className="bg-card border border-border rounded-3xl p-8 shadow-xl space-y-6 font-sans">
                                <h3 className="font-serif text-2xl font-bold text-foreground border-b border-border/80 pb-4">Ringkasan Pemesanan</h3>

                                {/* Promo Code Form */}
                                <form onSubmit={applyPromo} className="space-y-2 font-sans">
                                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 font-sans">
                                        <Tag size={14} /> Kode Voucher / AI Sommelier
                                    </label>
                                    <div className="flex gap-2 font-sans">
                                        <input
                                            type="text"
                                            value={promoCode}
                                            onChange={(e) => setPromoCode(e.target.value)}
                                            placeholder="Coba: SOMMELIER100"
                                            className="flex-1 bg-input/60 text-foreground border border-border rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-primary/50 uppercase tracking-widest font-mono"
                                        />
                                        <button type="submit" className="px-5 py-2.5 bg-secondary hover:bg-secondary/80 text-secondary-foreground rounded-xl text-xs font-bold uppercase tracking-wider transition font-sans">
                                            Klaim
                                        </button>
                                    </div>
                                    {promoApplied && (
                                        <p className="text-[11px] text-emerald-600 font-bold font-sans">Voucher potongan Rp 100.000 berhasil diterapkan!</p>
                                    )}
                                </form>

                                <div className="space-y-3 pt-4 border-t border-border/80 text-xs font-sans">
                                    <div className="flex justify-between font-sans">
                                        <span className="text-muted-foreground">Subtotal Produk:</span>
                                        <span className="font-mono font-bold text-foreground">Rp {subtotal.toLocaleString('id-ID')}</span>
                                    </div>

                                    {discount > 0 && (
                                        <div className="flex justify-between text-emerald-600 font-bold font-sans">
                                            <span>Potongan Voucher:</span>
                                            <span className="font-mono">- Rp {discount.toLocaleString('id-ID')}</span>
                                        </div>
                                    )}
                                    <div className="pt-4 border-t border-border/80 flex justify-between items-baseline font-sans">
                                        <span className="text-sm font-bold uppercase tracking-wider text-foreground">Total Pembayaran:</span>
                                        <span className="font-mono text-3xl font-extrabold tracking-tight text-gold">
                                            Rp {finalTotal.toLocaleString('id-ID')}
                                        </span>
                                    </div>
                                </div>

                                <Link
                                    href={route('checkout')}
                                    className="w-full py-4 bg-primary text-primary-foreground rounded-full text-xs font-bold uppercase tracking-widest shadow-lg shadow-primary/25 hover:opacity-90 transition transform active:scale-95 flex items-center justify-center gap-2 text-center font-sans"
                                >
                                    <span>Lanjutkan ke Pembayaran</span> <ArrowRight size={16} />
                                </Link>

                                <div className="text-center text-[11px] text-muted-foreground pt-2 flex items-center justify-center gap-2 font-sans">
                                    <ShieldCheck size={14} className="text-primary" /> Transaksi Terenkripsi & Aman 256-bit
                                </div>
                            </div>

                        </div>

                    </div>
                )}
            </main>

            <SiteFooter />
        </div>
    );
}
