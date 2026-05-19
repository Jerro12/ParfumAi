import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { Plus, Edit2, Trash2, X, Sparkles, AlertCircle, CheckCircle2, SlidersHorizontal, Info } from 'lucide-react';

export default function BottleSizesIndex({ bottleSizes }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSize, setEditingSize] = useState(null);
    const [deletingSize, setDeletingSize] = useState(null);

    const { data, setData, post, put, delete: destroy, processing, errors, reset } = useForm({
        size: '',
        default_price: '',
        is_active: true,
    });

    const openAddModal = () => {
        setEditingSize(null);
        reset();
        setIsModalOpen(true);
    };

    const openEditModal = (item) => {
        setEditingSize(item);
        setData({
            size: item.size || '',
            default_price: item.default_price || '',
            is_active: Boolean(item.is_active),
        });
        setIsModalOpen(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingSize) {
            put(route('admin.ukuran-botol.update', editingSize.id), {
                onSuccess: () => {
                    setIsModalOpen(false);
                    reset();
                },
            });
        } else {
            post(route('admin.ukuran-botol.store'), {
                onSuccess: () => {
                    setIsModalOpen(false);
                    reset();
                },
            });
        }
    };

    const confirmDelete = (item) => {
        setDeletingSize(item);
    };

    const executeDelete = () => {
        if (!deletingSize) return;
        destroy(route('admin.ukuran-botol.destroy', deletingSize.id), {
            onSuccess: () => setDeletingSize(null),
        });
    };

    return (
        <AdminLayout title="Manajemen Ukuran & Harga Botol Dinamis">
            <Head title="Kelola Ukuran Botol — Admin Parfumerie AI" />

            {/* Header Title & Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/80 pb-6 font-sans">
                <div>
                    <h1 className="font-serif text-3xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
                        <SlidersHorizontal className="text-gold" size={28} />
                        <span>Konfigurasi Ukuran & Harga Botol</span>
                    </h1>
                    <p className="text-xs text-muted-foreground mt-1">
                        Kelola varian kapasitas botol (mis. 10ml, 100ml, 150ml) beserta harga dasarnya secara dinamis untuk seluruh toko & AI chatbot.
                    </p>
                </div>

                <button
                    onClick={openAddModal}
                    className="px-5 py-2.5 bg-primary text-primary-foreground rounded-full text-xs font-bold uppercase tracking-wider shadow-lg shadow-primary/25 hover:opacity-90 transition flex items-center gap-1.5 shrink-0"
                >
                    <Plus size={16} /> Tambah Ukuran Baru
                </button>
            </div>

            {/* Info Banner */}
            <div className="mt-6 p-4 bg-gold/10 border border-gold/30 rounded-2xl flex items-start gap-3">
                <Info size={20} className="text-gold shrink-0 mt-0.5" />
                <div className="space-y-1 text-xs">
                    <div className="font-bold text-foreground">Fleksibilitas Masa Depan E-Commerce</div>
                    <p className="text-muted-foreground leading-relaxed">
                        Perubahan harga atau penambahan ukuran baru (seperti botol 150ml atau edisi travel 5ml) di sini akan secara otomatis disinkronkan dan ditampilkan pada kalkulator harga di Halaman Detail Produk serta asisten Chatbot AI.
                    </p>
                </div>
            </div>

            {/* Table */}
            <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-xl mt-6 font-sans">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm border-collapse min-w-[600px]">
                        <thead>
                            <tr className="border-b border-border/80 bg-secondary/30 text-[11px] text-muted-foreground uppercase tracking-wider font-semibold">
                                <th className="py-4 px-6">ID</th>
                                <th className="py-4 px-6">Kapasitas Ukuran Botol</th>
                                <th className="py-4 px-6">Harga Resmi (Rp)</th>
                                <th className="py-4 px-6">Status Tampil</th>
                                <th className="py-4 px-6 text-right">Tindakan</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/60">
                            {(!bottleSizes || bottleSizes.length === 0) ? (
                                <tr>
                                    <td colSpan="5" className="py-12 text-center text-xs text-muted-foreground italic">
                                        Belum ada ukuran botol yang dikonfigurasi.
                                    </td>
                                </tr>
                            ) : (
                                bottleSizes.map((item, idx) => (
                                    <tr key={item.id} className="hover:bg-secondary/20 transition duration-200 group">
                                        <td className="py-4 px-6 text-xs text-muted-foreground font-mono font-bold">
                                            #{idx + 1}
                                        </td>
                                        <td className="py-4 px-6 font-serif font-bold text-foreground text-base">
                                            {item.size}
                                        </td>
                                        <td className="py-4 px-6 font-mono font-extrabold text-foreground text-base">
                                            Rp {Number(item.default_price).toLocaleString('id-ID')}
                                        </td>
                                        <td className="py-4 px-6">
                                            {item.is_active ? (
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full text-[10px] font-bold tracking-wider uppercase">
                                                    <CheckCircle2 size={12} /> Aktif / Ditampilkan
                                                </span>
                                            ) : (
                                                <span className="px-3 py-1 bg-secondary text-muted-foreground border border-border rounded-full text-[10px] font-medium tracking-wider uppercase">
                                                    Nonaktif
                                                </span>
                                            )}
                                        </td>
                                        <td className="py-4 px-6 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => openEditModal(item)}
                                                    className="p-2 bg-secondary/80 hover:bg-primary/10 hover:text-primary text-foreground rounded-xl transition shadow-sm border border-border"
                                                    title="Edit ukuran"
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                                <button
                                                    onClick={() => confirmDelete(item)}
                                                    className="p-2 bg-secondary/80 hover:bg-destructive/10 hover:text-destructive text-foreground rounded-xl transition shadow-sm border border-border"
                                                    title="Hapus ukuran"
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
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md animate-fade-in font-sans">
                    <div className="bg-card border border-border/80 rounded-3xl p-8 max-w-lg w-full shadow-2xl space-y-6 relative">
                        
                        <div className="flex items-center justify-between border-b border-border/80 pb-4">
                            <h2 className="font-serif text-2xl font-bold flex items-center gap-2">
                                <Sparkles className="text-gold" size={20} />
                                <span>{editingSize ? 'Perbarui Ukuran & Harga' : 'Tambah Ukuran Botol Baru'}</span>
                            </h2>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="p-2 rounded-full hover:bg-secondary text-muted-foreground transition"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Kapasitas Ukuran Botol</label>
                                <input
                                    type="text"
                                    value={data.size}
                                    onChange={(e) => setData('size', e.target.value)}
                                    required
                                    placeholder="Contoh: 150 ml atau 5 ml"
                                    className="mt-1.5 w-full bg-input/60 text-foreground border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 font-serif font-bold"
                                />
                                {errors.size && <p className="text-xs text-destructive font-medium mt-1">{errors.size}</p>}
                            </div>

                            <div>
                                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Harga Resmi Botol (Rp)</label>
                                <input
                                    type="number"
                                    value={data.default_price}
                                    onChange={(e) => setData('default_price', e.target.value)}
                                    required
                                    placeholder="Contoh: 75000"
                                    className="mt-1.5 w-full bg-input/60 text-foreground border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 font-mono font-extrabold text-base"
                                />
                                {errors.default_price && <p className="text-xs text-destructive font-medium mt-1">{errors.default_price}</p>}
                            </div>

                            <div className="flex items-center gap-3 p-4 bg-secondary/40 border border-border rounded-2xl">
                                <input
                                    type="checkbox"
                                    id="is_active"
                                    checked={data.is_active}
                                    onChange={(e) => setData('is_active', e.target.checked)}
                                    className="size-5 rounded border-border text-primary focus:ring-primary/50 bg-input cursor-pointer"
                                />
                                <label htmlFor="is_active" className="text-sm font-bold text-foreground cursor-pointer">
                                    Aktif & Ditampilkan di Toko / Chatbot AI
                                </label>
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
                                    {processing ? 'Menyimpan...' : 'Simpan Ukuran'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deletingSize && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md animate-fade-in font-sans">
                    <div className="bg-card border border-border/80 rounded-3xl p-8 max-w-md w-full shadow-2xl text-center space-y-6">
                        <div className="size-16 mx-auto rounded-full bg-destructive/10 text-destructive flex items-center justify-center border border-destructive/20">
                            <AlertCircle size={32} />
                        </div>

                        <div>
                            <h3 className="font-serif text-2xl font-bold">Hapus Ukuran Botol Ini?</h3>
                            <p className="text-xs text-muted-foreground mt-2">
                                Anda yakin ingin menghapus ukuran <span className="font-bold text-foreground">{deletingSize.size}</span> seharga Rp {Number(deletingSize.default_price).toLocaleString('id-ID')} dari toko?
                            </p>
                        </div>

                        <div className="flex items-center justify-center gap-4 pt-4 border-t border-border/80">
                            <button
                                onClick={() => setDeletingSize(null)}
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
