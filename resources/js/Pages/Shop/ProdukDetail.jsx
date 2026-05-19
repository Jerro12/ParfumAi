import { SiteHeader } from '@/Components/SiteHeader';
import { SiteFooter } from '@/Components/SiteFooter';
import { ChatbotWidget } from '@/Components/ChatbotWidget';
import { Head, Link, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { Sparkles, Star, ShoppingBag, ShieldCheck, Truck, RotateCcw, ArrowLeft, Heart, Share2, Check, Info } from 'lucide-react';

export default function ProdukDetail({ dbProduct, bottleSizes }) {
    const product = dbProduct || {
        id: 1,
        name: "Victoria Secret",
        category: "Manis Floral",
        gender: "Perempuan",
        longevity: "3-5 Jam",
        is_bestseller: false,
        price: 50000,
        image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=800&auto=format&fit=crop",
        description: "Wewangian manis floral yang ceria dan feminim.",
        ai_verdict: "Sangat direkomendasikan untuk aktivitas harian santai.",
        rating: 5.0,
        reviews_count: 12
    };
    
    const fallbackSizes = [
        { id: 1, size: '10 ml', default_price: 8000 },
        { id: 2, size: '20 ml', default_price: 13000 },
        { id: 3, size: '35 ml', default_price: 25000 },
        { id: 4, size: '100 ml', default_price: 50000 },
    ];
    
    const activeSizes = (bottleSizes && bottleSizes.length > 0) ? bottleSizes : fallbackSizes;

    const [selectedSizeObj, setSelectedSizeObj] = useState(activeSizes[2] || activeSizes[0] || { size: '35 ml', default_price: 25000 });
    const [quantity, setQuantity] = useState(1);
    const [addedToCart, setAddedToCart] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (activeSizes.length > 0 && !activeSizes.find(s => s.size === selectedSizeObj.size)) {
            setSelectedSizeObj(activeSizes[0]);
        }
    }, [bottleSizes]);

    const unitPrice = Number(selectedSizeObj.default_price || 25000);
    const totalPrice = unitPrice * quantity;
    const formattedPrice = `Rp ${totalPrice.toLocaleString('id-ID')}`;

    const handleAddToCart = () => {
        setIsSubmitting(true);
        router.post(route('keranjang.store'), {
            product_id: product.id,
            bottle_size: selectedSizeObj.size,
            unit_price: selectedSizeObj.default_price || 25000,
            quantity: quantity,
        }, {
            onSuccess: () => {
                setIsSubmitting(false);
                setAddedToCart(true);
                setTimeout(() => setAddedToCart(false), 3000);
            },
            onError: () => setIsSubmitting(false),
        });
    };

    return (
        <div className="min-h-screen flex flex-col bg-background text-foreground antialiased font-sans">
            <Head title={`${product.name} — Parfumerie AI`} />
            <SiteHeader />

            <main className="flex-1 container mx-auto px-6 pt-8 pb-24 max-w-7xl space-y-12 font-sans">
                
                {/* Back Navigation */}
                <div>
                    <Link href={route('katalog')} className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground transition font-sans">
                        <ArrowLeft size={16} /> Kembali ke Katalog Eksklusif
                    </Link>
                </div>

                {/* Product Overview Section */}
                <div className="bg-card border border-border rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden grid grid-cols-1 lg:grid-cols-2 gap-12 items-center font-sans">
                    
                    {/* High-Res Image Display */}
                    <div className="relative h-[480px] sm:h-[560px] rounded-2xl overflow-hidden bg-secondary border border-border/80 group shadow-inner font-sans">
                        <img
                            src={product.image || 'https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=800&auto=format&fit=crop'}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
                        />
                        <div className="absolute top-4 left-4 bg-background/85 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider text-primary border border-border shadow-md">
                            {product.category}
                        </div>
                        {product.is_bestseller && (
                            <div className="absolute top-4 right-4 bg-gold text-background px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-md flex items-center gap-1">
                                <Star size={12} className="fill-current" /> Best Seller
                            </div>
                        )}
                        <div className="absolute bottom-4 right-4 flex items-center gap-2 font-sans">
                            <button className="size-11 rounded-full bg-background/85 backdrop-blur-md flex items-center justify-center text-foreground hover:text-red-500 transition shadow-md border border-border">
                                <Heart size={20} />
                            </button>
                            <button className="size-11 rounded-full bg-background/85 backdrop-blur-md flex items-center justify-center text-foreground hover:text-primary transition shadow-md border border-border">
                                <Share2 size={20} />
                            </button>
                        </div>
                    </div>

                    {/* Product Metadata & Action Configuration */}
                    <div className="space-y-6 max-w-lg font-sans">
                        <div className="space-y-2 font-sans">
                            <div className="flex items-center gap-2 text-xs font-semibold text-gold uppercase tracking-widest font-sans">
                                <Star size={16} className="fill-gold text-gold" />
                                <span>{Number(product.rating || 5).toFixed(1)} / 5.0 ({product.reviews_count || 12} Ulasan Terverifikasi)</span>
                            </div>
                            <h1 className="font-serif text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground">
                                {product.name}
                            </h1>
                            <div className="flex items-center gap-2 pt-1 font-sans">
                                <span className="px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-bold uppercase tracking-wider">
                                    {product.category}
                                </span>
                                <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
                                    Target: {product.gender || 'Unisex'}
                                </span>
                                <span className="px-3 py-1 rounded-full bg-secondary text-muted-foreground text-xs font-medium whitespace-nowrap font-sans">
                                    ⏳ {product.longevity || '4-6 Jam'}
                                </span>
                            </div>
                            <p className="text-muted-foreground text-sm leading-relaxed pt-3 font-sans">
                                {product.description || `Wewangian eksklusif dengan formulasi tahan lama (${product.longevity}). Tersedia dalam berbagai pilihan ukuran botol praktis.`}
                            </p>
                        </div>

                        <div className="p-4 bg-primary/5 rounded-2xl border border-primary/20 space-y-2 font-sans">
                            <div className="flex items-center gap-2 text-xs font-bold text-primary uppercase tracking-wider font-sans">
                                <Sparkles size={16} className="animate-spin" /> Verifikasi AI Scent Sommelier
                            </div>
                            <p className="text-xs text-foreground italic leading-relaxed font-serif">
                                "{product.ai_verdict || 'Sangat cocok digunakan untuk aktivitas harian di dalam maupun luar ruangan. Menciptakan kesan bersih dan menyenangkan.'}"
                            </p>
                        </div>

                        <div className="space-y-3 pt-2 font-sans">
                            <div className="flex items-center justify-between font-sans">
                                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Pilih Ukuran Botol (Dinamis dari Database):</label>
                                <span className="text-[11px] text-primary flex items-center gap-1 font-semibold font-sans">
                                    <Info size={12} /> Tersedia {activeSizes.length} Ukuran
                                </span>
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-sans">
                                {activeSizes.map((item) => (
                                    <button
                                        key={item.id || item.size}
                                        onClick={() => setSelectedSizeObj(item)}
                                        className={`p-3 rounded-2xl border text-center transition flex flex-col items-center justify-center gap-1 font-sans ${
                                            selectedSizeObj.size === item.size
                                                ? 'border-primary bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-105'
                                                : 'border-border bg-background text-muted-foreground hover:border-border/80 hover:text-foreground'
                                        }`}
                                    >
                                        <span className="text-xs font-extrabold uppercase tracking-wider font-sans">{item.size}</span>
                                        <span className="text-[11px] opacity-90 font-mono font-bold">Rp {Number(item.default_price).toLocaleString('id-ID')}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="pt-4 border-t border-border/80 flex flex-col sm:flex-row sm:items-center justify-between gap-6 font-sans">
                            <div className="font-sans">
                                <span className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Total Pembayaran ({quantity}x botol)</span>
                                <div className="font-mono text-3xl font-extrabold text-foreground tracking-tight">{formattedPrice}</div>
                            </div>

                            <div className="flex items-center gap-3 font-sans">
                                <div className="flex items-center border border-border bg-input rounded-full p-1 shadow-sm font-sans">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="size-9 rounded-full flex items-center justify-center font-bold text-foreground hover:bg-secondary transition font-mono"
                                    >
                                        -
                                    </button>
                                    <span className="w-10 text-center text-sm font-bold font-mono">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity(quantity + 1)}
                                        className="size-9 rounded-full flex items-center justify-center font-bold text-foreground hover:bg-secondary transition font-mono"
                                    >
                                        +
                                    </button>
                                </div>

                                <button
                                    onClick={handleAddToCart}
                                    disabled={isSubmitting}
                                    className="flex-1 sm:flex-initial px-8 py-3.5 bg-primary text-primary-foreground rounded-full text-xs font-bold uppercase tracking-wider shadow-lg shadow-primary/25 hover:opacity-90 transition transform active:scale-95 flex items-center justify-center gap-2 font-sans"
                                >
                                    {isSubmitting ? (
                                        <span>Menyimpan...</span>
                                    ) : addedToCart ? (
                                        <>
                                            <Check size={16} /> Ditambahkan!
                                        </>
                                    ) : (
                                        <>
                                            <ShoppingBag size={16} /> Masukkan Keranjang
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>

                        {addedToCart && (
                            <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-between animate-fade-in font-sans">
                                <span className="text-xs text-emerald-600 font-bold font-sans">1x {product.name} ({selectedSizeObj.size}) ada di keranjang.</span>
                                <Link href={route('keranjang')} className="text-xs font-bold uppercase tracking-wider bg-emerald-600 text-white px-4 py-2 rounded-full shadow-md font-sans">
                                    Lihat Keranjang ➜
                                </Link>
                            </div>
                        )}

                        <div className="grid grid-cols-3 gap-4 pt-6 border-t border-border/60 text-center text-[11px] text-muted-foreground font-semibold font-sans">
                            <div className="space-y-1 font-sans">
                                <ShieldCheck size={20} className="mx-auto text-primary" />
                                <div>100% Ekstrak Asli</div>
                            </div>
                            <div className="space-y-1 font-sans">
                                <Truck size={20} className="mx-auto text-primary" />
                                <div>Pengiriman Terlindung</div>
                            </div>
                            <div className="space-y-1 font-sans">
                                <RotateCcw size={20} className="mx-auto text-primary" />
                                <div>Garansi Retur Pecah</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Specification & Dataset Table */}
                <div className="bg-card border border-border rounded-3xl p-8 sm:p-12 shadow-xl space-y-8 relative overflow-hidden font-sans">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 rounded-full blur-3xl pointer-events-none" />

                    <div className="text-center max-w-xl mx-auto space-y-2 font-sans">
                        <h2 className="font-serif text-3xl font-extrabold tracking-tight text-foreground">Spesifikasi Dataset Resmi</h2>
                        <p className="text-xs text-muted-foreground font-sans">Rincian parameter teknis parfum sesuai dengan basis data inventaris e-commerce dan Scent Sommelier AI.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pt-4 font-sans">
                        <div className="p-6 bg-background rounded-2xl border border-border/80 shadow-sm space-y-2 text-center group hover:border-primary/50 transition font-sans">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-primary font-sans">Kategori Olfaktori</span>
                            <div className="font-serif text-2xl font-bold text-foreground">{product.category}</div>
                            <p className="text-xs text-muted-foreground font-sans">Karakter utama dari racikan ekstrak minyak wangi.</p>
                        </div>

                        <div className="p-6 bg-background rounded-2xl border border-border/80 shadow-sm space-y-2 text-center group hover:border-primary/50 transition font-sans">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-primary font-sans">Target Pengguna</span>
                            <div className="font-serif text-2xl font-bold text-foreground">{product.gender || 'Unisex'}</div>
                            <p className="text-xs text-muted-foreground font-sans">Diformulasikan khusus untuk kecocokan feromon.</p>
                        </div>

                        <div className="p-6 bg-background rounded-2xl border border-border/80 shadow-sm space-y-2 text-center group hover:border-primary/50 transition font-sans">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-primary font-sans">Daya Tahan (Longevity)</span>
                            <div className="font-serif text-2xl font-bold text-gold">{product.longevity || '4-6 Jam'}</div>
                            <p className="text-xs text-muted-foreground font-sans">Perkiraan durasi keharuman melekat di kulit/pakaian.</p>
                        </div>

                        <div className="p-6 bg-background rounded-2xl border border-border/80 shadow-sm space-y-2 text-center group hover:border-primary/50 transition font-sans">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-primary font-sans">Status Popularitas</span>
                            <div className="font-serif text-2xl font-bold text-foreground flex items-center justify-center gap-1.5 whitespace-nowrap">
                                {product.is_bestseller ? <><Star size={18} className="fill-gold text-gold shrink-0" /> Best Seller</> : '✦ Edisi Premium'}
                            </div>
                            <p className="text-xs text-muted-foreground font-sans">Tingkat permintaan dari pelanggan setia Parfumerie.</p>
                        </div>
                    </div>
                </div>

            </main>

            <ChatbotWidget />
            <SiteFooter />
        </div>
    );
}
