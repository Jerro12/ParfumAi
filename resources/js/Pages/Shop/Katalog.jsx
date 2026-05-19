import { SiteHeader } from '@/Components/SiteHeader';
import { SiteFooter } from '@/Components/SiteFooter';
import { ChatbotWidget } from '@/Components/ChatbotWidget';
import { Head, Link } from '@inertiajs/react';
import { useState, useMemo } from 'react';
import { Search, Sparkles, SlidersHorizontal, ArrowRight, Star } from 'lucide-react';

export default function Katalog({ dbProducts }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('Semua');
    const [sortBy, setSortBy] = useState('Rekomendasi AI');

    const categories = ['Semua', 'Manis Floral', 'Floral Sweet', 'Manis Soft', 'Manis Creamy', 'Fruity Manis', 'Fruity Fresh', 'Manis', 'Flower', 'Fresh Cold', 'Glamor', 'Fresh Aquatic', 'Floral Powdery', 'Soft Floral', 'Soft Powdery', 'Fresh Sweet', 'Vanilla Creamy', 'Soft', 'Fruity', 'Fresh', 'Sweet Romantic', 'Sweet Vanilla', 'Luxury Manis', 'Maskulin', 'Fresh Spicy', 'Kopi Manis', 'Sporty Fresh', 'Fresh Calming', 'Fresh Woody', 'Woody Elegan', 'Woody Musky'];

    const filteredProducts = useMemo(() => {
        let list = [...(dbProducts || [])];

        if (selectedCategory !== 'Semua') {
            list = list.filter((p) => p.category === selectedCategory);
        }

        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            list = list.filter((p) =>
                (p.name && p.name.toLowerCase().includes(q)) ||
                (p.category && p.category.toLowerCase().includes(q)) ||
                (p.gender && p.gender.toLowerCase().includes(q))
            );
        }

        if (sortBy === 'Harga Rendah ke Tinggi') {
            list.sort((a, b) => Number(a.price) - Number(b.price));
        } else if (sortBy === 'Harga Tinggi ke Rendah') {
            list.sort((a, b) => Number(b.price) - Number(a.price));
        } else if (sortBy === 'Rating Teratas') {
            list.sort((a, b) => Number(b.rating || 5) - Number(a.rating || 5));
        }

        return list;
    }, [dbProducts, searchQuery, selectedCategory, sortBy]);

    return (
        <div className="min-h-screen flex flex-col bg-background text-foreground antialiased font-sans">
            <Head title="Katalog Eksklusif — Parfumerie AI" />
            <SiteHeader />

            <main className="flex-1 container mx-auto px-6 pt-12 pb-24 max-w-7xl">
                
                {/* AI Sommelier Banner */}
                <div className="bg-card border border-border rounded-3xl p-8 sm:p-12 shadow-xl mb-12 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="absolute top-0 right-0 w-80 h-80 bg-gold/10 rounded-full blur-3xl pointer-events-none" />
                    <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

                    <div className="max-w-2xl space-y-4 relative z-10">
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider border border-primary/20">
                            <Sparkles size={14} className="animate-spin" /> Algoritma Scent Sommelier 4.2
                        </div>
                        <h1 className="font-serif text-4xl sm:text-6xl font-extrabold tracking-tight text-foreground leading-tight">
                            Katalog Eksklusif <span className="text-primary font-serif">Wewangian</span>
                        </h1>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                            Jelajahi 36 varian parfum berkelas dari dataset asli kami. Setiap produk diformulasikan dengan keharuman tahan lama dan dipasangkan secara cerdas melalui AI Scent Sommelier.
                        </p>
                    </div>

                    <div className="relative z-10 bg-background/80 backdrop-blur-md p-6 rounded-2xl border border-border shadow-md max-w-sm w-full space-y-3">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-serif font-bold text-lg">✦</div>
                            <div>
                                <h3 className="text-xs font-bold uppercase tracking-wider text-primary">Konsultasi Aroma Kilat</h3>
                                <p className="text-[11px] text-muted-foreground">Tanya AI Sommelier di pojok kanan bawah</p>
                            </div>
                        </div>
                        <button 
                            onClick={() => window.dispatchEvent(new CustomEvent('open-ai-chat'))}
                            className="w-full py-2.5 bg-primary text-primary-foreground rounded-full text-xs font-semibold shadow-md shadow-primary/20 hover:opacity-90 transition uppercase tracking-wider"
                        >
                            Mulai Diagnosis AI Sekarang ➜
                        </button>
                    </div>
                </div>

                {/* Search & Filter Toolbar */}
                <div className="flex flex-col lg:flex-row items-center justify-between gap-6 mb-12 border-b border-border/80 pb-8">
                    
                    {/* Search Input */}
                    <div className="relative w-full lg:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Cari parfum, kategori aroma, atau gender..."
                            className="w-full pl-12 pr-4 py-3.5 bg-input/60 text-foreground border border-border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition shadow-sm font-medium"
                        />
                    </div>

                    {/* Sorting Controls */}
                    <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto justify-end">
                        <div className="flex items-center gap-2">
                            <SlidersHorizontal size={16} className="text-muted-foreground" />
                            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Urutkan:</span>
                        </div>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="bg-input text-foreground border border-border rounded-full px-4 py-2.5 text-xs font-semibold uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-primary/50 shadow-sm"
                        >
                            <option value="Rekomendasi AI">✧ Rekomendasi AI</option>
                            <option value="Rating Teratas">★ Rating Teratas</option>
                            <option value="Harga Rendah ke Tinggi">Harga: Rendah ke Tinggi</option>
                            <option value="Harga Tinggi ke Rendah">Harga: Tinggi ke Rendah</option>
                        </select>
                    </div>
                </div>

                {/* Category Filter Chips */}
                <div className="flex items-center gap-3 overflow-x-auto pb-6 mb-8 scrollbar-hide">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap transition duration-300 shadow-sm ${
                                selectedCategory === cat
                                    ? 'bg-primary text-primary-foreground shadow-primary/20 scale-105'
                                    : 'bg-card text-muted-foreground border border-border hover:border-primary/50 hover:text-foreground'
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Products Grid */}
                {filteredProducts.length === 0 ? (
                    <div className="text-center py-24 bg-card border border-border rounded-3xl space-y-4">
                        <div className="size-16 mx-auto rounded-full bg-secondary text-muted-foreground flex items-center justify-center text-2xl font-serif">
                            ?
                        </div>
                        <h3 className="font-serif text-2xl font-bold">Wewangian Tidak Ditemukan</h3>
                        <p className="text-sm text-muted-foreground max-w-md mx-auto">
                            Tidak ada parfum yang cocok dengan kueri "{searchQuery}". Coba gunakan istilah lain atau reset filter kategori.
                        </p>
                        <button
                            onClick={() => { setSearchQuery(''); setSelectedCategory('Semua'); }}
                            className="px-6 py-2.5 bg-primary text-primary-foreground rounded-full text-xs font-semibold uppercase tracking-wider shadow-md"
                        >
                            Reset Filter
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {filteredProducts.map((p) => (
                            <div key={p.id} className="bg-card border border-border rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition duration-500 flex flex-col group relative">
                                
                                <div className="absolute top-4 left-4 z-10 px-3 py-1 bg-background/85 backdrop-blur-md text-foreground rounded-full text-[10px] font-bold uppercase tracking-wider border border-border shadow-sm flex items-center gap-1.5">
                                    {p.is_bestseller ? <><Star size={10} className="fill-gold text-gold" /> Best Seller</> : p.category}
                                </div>

                                <div className="relative h-72 overflow-hidden bg-secondary/50 flex items-center justify-center">
                                    <img
                                        src={p.image || 'https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=800&auto=format&fit=crop'}
                                        alt={p.name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                                    />
                                    <div className="absolute top-4 right-4 z-10 bg-background/85 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-bold text-gold border border-border shadow-sm flex items-center gap-1">
                                        <Star size={12} className="fill-gold" /> {Number(p.rating || 5).toFixed(1)}
                                    </div>
                                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition duration-300 flex items-end p-4">
                                        <Link
                                            href={route('katalog.detail', { id: p.id })}
                                            className="w-full py-2.5 bg-primary text-primary-foreground rounded-full text-xs font-semibold text-center uppercase tracking-wider shadow-lg transform translate-y-2 group-hover:translate-y-0 transition duration-300"
                                        >
                                            Lihat Spesifikasi & Ukuran ➜
                                        </Link>
                                    </div>
                                </div>

                                <div className="p-6 flex-1 flex flex-col justify-between space-y-4 font-sans">
                                    <div>
                                        <Link href={route('katalog.detail', { id: p.id })}>
                                            <h3 className="font-serif text-2xl font-bold text-foreground group-hover:text-primary transition duration-300 truncate">
                                                {p.name}
                                            </h3>
                                        </Link>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-[10px] px-2 py-0.5 rounded bg-secondary text-secondary-foreground font-bold uppercase tracking-wider">{p.category}</span>
                                            <span className="text-[10px] px-2 py-0.5 rounded bg-secondary/60 text-muted-foreground font-medium uppercase tracking-wider">{p.gender}</span>
                                        </div>
                                        <p className="text-xs text-muted-foreground mt-2 line-clamp-2 leading-relaxed italic">
                                            {p.description || `Parfum eksklusif dengan ketahanan ${p.longevity || '4-6 jam'}.`}
                                        </p>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="text-[11px] text-muted-foreground font-medium bg-secondary/50 p-2.5 rounded-xl border border-border flex items-center gap-1.5">
                                            <Sparkles size={12} className="text-primary shrink-0" />
                                            <span className="truncate italic">" {p.ai_verdict || 'Sangat direkomendasikan untuk aktivitas harian.'} "</span>
                                        </div>
                                        <div className="pt-3 border-t border-border/80 flex items-center justify-between">
                                            <div>
                                                <div className="text-[10px] uppercase text-muted-foreground font-semibold">Mulai dari</div>
                                                <span className="font-serif font-extrabold text-foreground text-lg">
                                                    Rp 8.000
                                                </span>
                                            </div>
                                            <Link
                                                href={route('katalog.detail', { id: p.id })}
                                                className="px-4 py-2 bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground rounded-full text-xs font-bold tracking-wide uppercase transition flex items-center gap-1.5"
                                            >
                                                <span>Pilih</span> <ArrowRight size={14} />
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            <ChatbotWidget />
            <SiteFooter />
        </div>
    );
}
