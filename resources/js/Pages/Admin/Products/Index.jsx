import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { Plus, Search, Edit2, Trash2, X, Sparkles, AlertCircle, Star } from 'lucide-react';

export default function ProductsIndex({ products }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [deletingProduct, setDeletingProduct] = useState(null);

    const { data, setData, post, put, delete: destroy, processing, errors, reset } = useForm({
        name: '',
        category: 'Manis Floral',
        gender: 'Perempuan',
        longevity: '4-6 Jam',
        is_bestseller: false,
        price: '50000',
        image: '',
        description: '',
        ai_verdict: '',
    });

    const categories = [
        'Manis Floral', 'Floral Sweet', 'Manis Soft', 'Manis Creamy', 'Fruity Manis',
        'Fruity Fresh', 'Manis', 'Flower', 'Fresh Cold', 'Glamor', 'Fresh Aquatic',
        'Floral Powdery', 'Soft Floral', 'Soft Powdery', 'Fresh Sweet', 'Vanilla Creamy',
        'Soft', 'Fruity', 'Fresh', 'Sweet Romantic', 'Sweet Vanilla', 'Luxury Manis',
        'Maskulin', 'Fresh Spicy', 'Kopi Manis', 'Sporty Fresh', 'Fresh Calming',
        'Fresh Woody', 'Woody Elegan', 'Woody Musky'
    ];

    const genders = ['Perempuan', 'Laki-laki', 'Unisex'];

    const filteredProducts = products.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.gender.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const openAddModal = () => {
        setEditingProduct(null);
        reset();
        setIsModalOpen(true);
    };

    const openEditModal = (prod) => {
        setEditingProduct(prod);
        setData({
            name: prod.name || '',
            category: prod.category || 'Manis Floral',
            gender: prod.gender || 'Perempuan',
            longevity: prod.longevity || '4-6 Jam',
            is_bestseller: Boolean(prod.is_bestseller),
            price: prod.price || '50000',
            image: prod.image || '',
            description: prod.description || '',
            ai_verdict: prod.ai_verdict || '',
        });
        setIsModalOpen(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingProduct) {
            put(route('admin.produk.update', editingProduct.id), {
                onSuccess: () => {
                    setIsModalOpen(false);
                    reset();
                },
            });
        } else {
            post(route('admin.produk.store'), {
                onSuccess: () => {
                    setIsModalOpen(false);
                    reset();
                },
            });
        }
    };

    const confirmDelete = (prod) => {
        setDeletingProduct(prod);
    };

    const executeDelete = () => {
        if (!deletingProduct) return;
        destroy(route('admin.produk.destroy', deletingProduct.id), {
            onSuccess: () => setDeletingProduct(null),
        });
    };

    return (
        <AdminLayout title="Kelola Katalog Produk">
            <Head title="Kelola Produk — Admin Parfumerie AI" />

            {/* Header Title & Top Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/80 pb-6">
                <div>
                    <h1 className="font-serif text-3xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
                        <span className="text-gold">✦</span> Manajemen Inventaris & Scent Dataset
                    </h1>
                    <p className="text-xs text-muted-foreground mt-1">Kelola 36 entri parfum, harga 4 ukuran botol, ketahanan aroma, dan parameter chatbot AI.</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative w-64">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Cari parfum, kategori, atau gender..."
                            className="w-full pl-10 pr-4 py-2 bg-input/60 text-foreground border border-border rounded-full text-xs focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
                        />
                    </div>

                    <button
                        onClick={openAddModal}
                        className="px-5 py-2.5 bg-primary text-primary-foreground rounded-full text-xs font-bold uppercase tracking-wider shadow-lg shadow-primary/25 hover:opacity-90 transition flex items-center gap-1.5 shrink-0"
                    >
                        <Plus size={16} /> Tambah Produk
                    </button>
                </div>
            </div>

            {/* Product Table */}
            <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-xl mt-6">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm border-collapse font-sans min-w-[1000px]">
                        <thead>
                            <tr className="border-b border-border/80 bg-secondary/30 text-[11px] text-muted-foreground uppercase tracking-wider font-semibold">
                                <th className="py-4 px-6">Produk & Gambar</th>
                                <th className="py-4 px-4">Kategori Aroma</th>
                                <th className="py-4 px-4">Target Gender</th>
                                <th className="py-4 px-4">Daya Tahan</th>
                                <th className="py-4 px-4">Status Penjualan</th>
                                <th className="py-4 px-4">Harga Dasar</th>
                                <th className="py-4 px-6 text-right">Tindakan</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/60">
                            {filteredProducts.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="py-12 text-center text-xs text-muted-foreground italic">
                                        Tidak ada produk yang cocok dengan pencarian Anda.
                                    </td>
                                </tr>
                            ) : (
                                filteredProducts.map((p) => (
                                    <tr key={p.id} className="hover:bg-secondary/20 transition duration-200 group">
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-4 min-w-[240px]">
                                                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-secondary border border-border shrink-0 shadow-md relative">
                                                    <img
                                                        src={p.image || 'https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=800&auto=format&fit=crop'}
                                                        alt={p.name}
                                                        className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                                                    />
                                                    {p.is_bestseller && (
                                                        <div className="absolute top-1 right-1 bg-gold text-background p-1 rounded-full shadow" title="Best Seller">
                                                            <Star size={12} fill="currentColor" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="space-y-1 min-w-0 flex-1">
                                                    <div className="font-serif font-bold text-foreground text-base group-hover:text-primary transition truncate">
                                                        {p.name}
                                                    </div>
                                                    <div className="text-[11px] text-muted-foreground line-clamp-2 italic leading-tight">
                                                        "{p.description || p.ai_verdict || 'Tersedia ukuran 10ml, 20ml, 35ml, 100ml'}"
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4">
                                            <span className="px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-secondary text-secondary-foreground border border-border whitespace-nowrap">
                                                {p.category}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase whitespace-nowrap ${
                                                p.gender === 'Perempuan' 
                                                    ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' 
                                                    : p.gender === 'Laki-laki'
                                                        ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                                                        : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                            }`}>
                                                {p.gender}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4 text-xs font-semibold text-muted-foreground whitespace-nowrap">
                                            ⏳ {p.longevity || '4-6 Jam'}
                                        </td>
                                        <td className="py-4 px-4">
                                            {p.is_bestseller ? (
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gold/10 text-gold border border-gold/30 rounded-full text-[10px] font-bold tracking-wider uppercase whitespace-nowrap">
                                                    <Star size={12} fill="currentColor" /> Best Seller
                                                </span>
                                            ) : (
                                                <span className="px-3 py-1 bg-secondary text-muted-foreground border border-border rounded-full text-[10px] font-medium tracking-wider uppercase whitespace-nowrap">
                                                    ✦ Regular
                                                </span>
                                            )}
                                        </td>
                                        <td className="py-4 px-4 font-serif font-extrabold text-foreground text-base whitespace-nowrap">
                                            Rp {Number(p.price).toLocaleString('id-ID')}
                                            <div className="text-[10px] text-muted-foreground font-sans font-normal">Harga 100ml (10ml = Rp 8k)</div>
                                        </td>
                                        <td className="py-4 px-6 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => openEditModal(p)}
                                                    className="p-2 bg-secondary/80 hover:bg-primary/10 hover:text-primary text-foreground rounded-xl transition shadow-sm border border-border"
                                                    title="Edit produk"
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                                <button
                                                    onClick={() => confirmDelete(p)}
                                                    className="p-2 bg-secondary/80 hover:bg-destructive/10 hover:text-destructive text-foreground rounded-xl transition shadow-sm border border-border"
                                                    title="Hapus produk"
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

            {/* Create & Edit Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md animate-fade-in">
                    <div className="bg-card border border-border/80 rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl space-y-6 relative font-sans">
                        
                        <div className="flex items-center justify-between border-b border-border/80 pb-4">
                            <h2 className="font-serif text-2xl font-bold flex items-center gap-2">
                                <Sparkles className="text-gold" size={20} />
                                <span>{editingProduct ? 'Perbarui Data Parfum' : 'Tambah Parfum Eksklusif Baru'}</span>
                            </h2>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="p-2 rounded-full hover:bg-secondary text-muted-foreground transition"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div>
                                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Nama Parfum</label>
                                    <input
                                        type="text"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        required
                                        placeholder="Contoh: Scandalouis"
                                        className="mt-1.5 w-full bg-input/60 text-foreground border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                                    />
                                    {errors.name && <p className="text-xs text-destructive font-medium mt-1">{errors.name}</p>}
                                </div>

                                <div>
                                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Kategori Aroma</label>
                                    <select
                                        value={data.category}
                                        onChange={(e) => setData('category', e.target.value)}
                                        className="mt-1.5 w-full bg-input/60 text-foreground border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 font-medium"
                                    >
                                        {categories.map((c) => (
                                            <option key={c} value={c}>{c}</option>
                                        ))}
                                    </select>
                                    {errors.category && <p className="text-xs text-destructive font-medium mt-1">{errors.category}</p>}
                                </div>

                                <div>
                                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Target Gender</label>
                                    <select
                                        value={data.gender}
                                        onChange={(e) => setData('gender', e.target.value)}
                                        className="mt-1.5 w-full bg-input/60 text-foreground border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 font-medium"
                                    >
                                        {genders.map((g) => (
                                            <option key={g} value={g}>{g}</option>
                                        ))}
                                    </select>
                                    {errors.gender && <p className="text-xs text-destructive font-medium mt-1">{errors.gender}</p>}
                                </div>

                                <div>
                                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Daya Tahan Aroma</label>
                                    <input
                                        type="text"
                                        value={data.longevity}
                                        onChange={(e) => setData('longevity', e.target.value)}
                                        required
                                        placeholder="Contoh: 4-6 Jam atau 8-12 Jam"
                                        className="mt-1.5 w-full bg-input/60 text-foreground border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                                    />
                                    {errors.longevity && <p className="text-xs text-destructive font-medium mt-1">{errors.longevity}</p>}
                                </div>

                                <div>
                                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Harga Dasar 100ml (Rp)</label>
                                    <input
                                        type="number"
                                        value={data.price}
                                        onChange={(e) => setData('price', e.target.value)}
                                        required
                                        placeholder="Contoh: 50000"
                                        className="mt-1.5 w-full bg-input/60 text-foreground border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 font-mono"
                                    />
                                    {errors.price && <p className="text-xs text-destructive font-medium mt-1">{errors.price}</p>}
                                </div>

                                <div>
                                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">URL Gambar Unsplash</label>
                                    <input
                                        type="url"
                                        value={data.image}
                                        onChange={(e) => setData('image', e.target.value)}
                                        placeholder="https://images.unsplash.com/..."
                                        className="mt-1.5 w-full bg-input/60 text-foreground border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                                    />
                                    {errors.image && <p className="text-xs text-destructive font-medium mt-1">{errors.image}</p>}
                                </div>

                                <div className="sm:col-span-2 flex items-center gap-3 p-4 bg-secondary/40 border border-border rounded-2xl">
                                    <input
                                        type="checkbox"
                                        id="is_bestseller"
                                        checked={data.is_bestseller}
                                        onChange={(e) => setData('is_bestseller', e.target.checked)}
                                        className="size-5 rounded border-border text-gold focus:ring-gold/50 bg-input"
                                    />
                                    <label htmlFor="is_bestseller" className="text-sm font-bold text-gold flex items-center gap-1.5 cursor-pointer">
                                        <Star size={16} fill="currentColor" /> Tandai Parfum Ini Sebagai "Best Seller" di Toko & Chatbot AI
                                    </label>
                                </div>

                                <div className="sm:col-span-2">
                                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Deskripsi & Rincian Ukuran</label>
                                    <textarea
                                        rows="3"
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        placeholder="Tersedia ukuran 10ml (Rp 8k), 20ml (Rp 13k), 35ml (Rp 25k), 100ml (Rp 50k)..."
                                        className="mt-1.5 w-full bg-input/60 text-foreground border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 leading-relaxed"
                                    />
                                </div>

                                <div className="sm:col-span-2">
                                    <label className="text-xs font-bold uppercase tracking-wider text-gold flex items-center gap-1.5">
                                        <Sparkles size={14} /> Analisis AI Scent Sommelier (AI Verdict)
                                    </label>
                                    <textarea
                                        rows="2"
                                        value={data.ai_verdict}
                                        onChange={(e) => setData('ai_verdict', e.target.value)}
                                        placeholder="Cocok untuk kepribadian yang aktif, ceria..."
                                        className="mt-1.5 w-full bg-input/60 text-foreground border border-border rounded-xl px-4 py-3 text-xs focus:outline-none focus:ring-2 focus:ring-primary/50 italic"
                                    />
                                </div>
                            </div>

                            <div className="pt-6 border-t border-border/80 flex items-center justify-end gap-4">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-6 py-2.5 bg-secondary text-secondary-foreground rounded-full text-xs font-bold uppercase tracking-wider hover:bg-secondary/80 transition"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-8 py-2.5 bg-primary text-primary-foreground rounded-full text-xs font-bold uppercase tracking-wider shadow-lg shadow-primary/25 hover:opacity-90 transition transform active:scale-95"
                                >
                                    {processing ? 'Menyimpan...' : 'Simpan Produk'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deletingProduct && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md animate-fade-in font-sans">
                    <div className="bg-card border border-border/80 rounded-3xl p-8 max-w-md w-full shadow-2xl text-center space-y-6">
                        <div className="size-16 mx-auto rounded-full bg-destructive/10 text-destructive flex items-center justify-center border border-destructive/20">
                            <AlertCircle size={32} />
                        </div>

                        <div>
                            <h3 className="font-serif text-2xl font-bold">Hapus Produk Ini?</h3>
                            <p className="text-xs text-muted-foreground mt-2">
                                Anda yakin ingin menghapus <span className="font-bold text-foreground">{deletingProduct.name}</span> dari basis data inventaris? Tindakan ini tidak dapat dibatalkan.
                            </p>
                        </div>

                        <div className="flex items-center justify-center gap-4 pt-4 border-t border-border/80">
                            <button
                                onClick={() => setDeletingProduct(null)}
                                className="px-6 py-2.5 bg-secondary text-secondary-foreground rounded-full text-xs font-bold uppercase tracking-wider hover:bg-secondary/80 transition"
                            >
                                Batal
                            </button>
                            <button
                                onClick={executeDelete}
                                className="px-6 py-2.5 bg-destructive text-destructive-foreground rounded-full text-xs font-bold uppercase tracking-wider shadow-lg hover:opacity-90 transition"
                            >
                                Hapus Permanen
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
