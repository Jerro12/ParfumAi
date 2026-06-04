import AdminLayout from '@/Layouts/AdminLayout';
import { useForm, usePage } from '@inertiajs/react';
import { useState, useRef } from 'react';
import { ImagePlus, Save, RotateCcw, CheckCircle, Image, Type, Tag, Home, Info } from 'lucide-react';
import { heroImg } from '@/assets/hero-perfume';

const KISAH_DEFAULT = 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=800&auto=format&fit=crop';

// ─── Sub-komponen upload gambar yang bisa dipakai ulang ─────────────────────
function ImageUploadCard({ title, description, previewSrc, fallbackSrc, onFileChange, onReset, showReset, error, aspectClass = 'h-[220px]' }) {
  const ref = useRef(null);
  return (
    <div className="bg-card rounded-3xl border border-border p-6 shadow-xl space-y-4">
      <h3 className="font-serif text-lg font-bold flex items-center gap-2">
        <Image size={18} className="text-primary" />
        {title}
      </h3>
      {description && <p className="text-xs text-muted-foreground -mt-2">{description}</p>}

      {/* Preview */}
      <div className={`relative ${aspectClass} rounded-2xl overflow-hidden border border-border bg-secondary/40`}>
        <img src={previewSrc || fallbackSrc} alt="Preview" className="w-full h-full object-cover" />
      </div>

      {/* Upload Button */}
      <input ref={ref} type="file" accept="image/jpeg,image/png,image/webp" onChange={onFileChange} className="hidden" />
      <button
        type="button"
        onClick={() => ref.current?.click()}
        className="w-full flex items-center justify-center gap-3 px-5 py-3.5 rounded-2xl border-2 border-dashed border-border hover:border-primary/60 bg-secondary/40 hover:bg-primary/5 text-foreground transition duration-300 group"
      >
        <ImagePlus size={20} className="text-muted-foreground group-hover:text-primary transition" />
        <div className="text-left">
          <p className="font-semibold text-sm group-hover:text-primary transition">
            {previewSrc ? 'Ganti Foto' : 'Upload Foto Baru'}
          </p>
          <p className="text-xs text-muted-foreground">JPG, PNG, WebP — Maks. 3 MB</p>
        </div>
      </button>
      {error && <p className="text-xs text-destructive font-semibold">{error}</p>}
      {showReset && onReset && (
        <button
          type="button"
          onClick={onReset}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-border text-xs font-bold text-muted-foreground hover:text-destructive hover:border-destructive/40 hover:bg-destructive/5 transition duration-300"
        >
          <RotateCcw size={13} /> Reset ke Default
        </button>
      )}
    </div>
  );
}

// ─── Komponen input teks ────────────────────────────────────────────────────
function TextField({ id, label, value, onChange, placeholder, maxLength, error, multiline = false }) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{label}</label>
      {multiline ? (
        <textarea
          id={id}
          rows={3}
          maxLength={maxLength}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full px-4 py-3 rounded-xl border border-border bg-input text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition resize-none"
        />
      ) : (
        <input
          id={id}
          type="text"
          maxLength={maxLength}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full px-4 py-3 rounded-xl border border-border bg-input text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
        />
      )}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

// ─── Halaman Utama ──────────────────────────────────────────────────────────
export default function Pengaturan({ settings }) {
  const { flash } = usePage().props;
  const [activeTab, setActiveTab] = useState('welcome');

  const { data, setData, post, processing, errors } = useForm({
    // Welcome
    hero_image:           null,
    hero_label:           settings?.hero_label           || 'AI Signature Blend',
    hero_title:           settings?.hero_title           || "Velour d'Or #99",
    hero_badge:           settings?.hero_badge           || 'Top 1% Pick',
    // Tentang Kami
    tentang_kisah_image:  null,
    tentang_kisah_label:  settings?.tentang_kisah_label  || 'Koleksi 36 Varian Pilihan',
    tentang_kisah_desc:   settings?.tentang_kisah_desc   || 'Diformulasikan secara ketat berdasarkan dataset olfaktori teruji untuk menjamin ketahanan dan proyeksi aroma terbaik.',
  });

  // Preview states
  const [heroPreview,        setHeroPreview]        = useState(settings?.hero_image        || null);
  const [kisahPreview,       setKisahPreview]        = useState(settings?.tentang_kisah_image || null);

  const heroInputRef = useRef(null);
  const kisahInputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    post(route('admin.pengaturan.update'), { forceFormData: true });
  };

  const tabs = [
    { id: 'welcome', label: 'Welcome Page', icon: Home },
    { id: 'tentang', label: 'Tentang Kami', icon: Info },
  ];

  return (
    <AdminLayout title="Pengaturan Tampilan">
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold tracking-tight text-foreground">Pengaturan Tampilan</h1>
        <p className="text-muted-foreground text-sm mt-1">Kelola foto dan teks yang tampil di halaman-halaman publik.</p>
      </div>

      {flash?.success && (
        <div className="mb-6 flex items-center gap-3 px-5 py-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 font-semibold text-sm shadow-sm">
          <CheckCircle size={18} />
          {flash.success}
        </div>
      )}

      {/* ── Tabs ── */}
      <div className="flex gap-2 mb-8 p-1.5 bg-secondary/60 rounded-2xl w-fit border border-border">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition duration-200 ${
              activeTab === id
                ? 'bg-card text-foreground shadow-sm border border-border'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Icon size={15} />
            {label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} encType="multipart/form-data">

        {/* ════════════════════════════════════════════════════════════
            TAB 1: WELCOME PAGE
        ════════════════════════════════════════════════════════════ */}
        {activeTab === 'welcome' && (
          <div className="grid lg:grid-cols-2 gap-8 items-start">

            {/* Kiri: Preview & Upload */}
            <div className="space-y-4">
              {/* Hero Image Preview */}
              <div className="bg-card rounded-3xl border border-border p-6 shadow-xl space-y-4">
                <h2 className="font-serif text-xl font-bold flex items-center gap-2">
                  <Image size={20} className="text-primary" />
                  Preview Foto Hero
                </h2>

                {/* Mini preview kartu hero */}
                <div className="relative w-full p-2 bg-gradient-to-tr from-primary/30 via-gold/30 to-forest/30 rounded-3xl shadow-2xl">
                  <img
                    src={heroPreview || heroImg}
                    alt="Preview hero"
                    className="rounded-2xl w-full h-[220px] object-cover transition duration-500"
                  />
                  <div className="absolute bottom-5 left-5 right-5 p-3 rounded-xl bg-background/80 backdrop-blur-md border border-border flex items-center justify-between shadow-lg">
                    <div className="space-y-0.5">
                      <p className="text-[10px] text-primary font-semibold uppercase">{data.hero_label}</p>
                      <p className="font-serif font-bold text-foreground text-sm">{data.hero_title}</p>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-gold/20 text-primary text-[10px] font-bold font-serif">{data.hero_badge}</span>
                  </div>
                </div>

                {/* Upload */}
                <input ref={heroInputRef} type="file" accept="image/jpeg,image/png,image/webp"
                  onChange={(e) => { const f = e.target.files[0]; if (f) { setData('hero_image', f); setHeroPreview(URL.createObjectURL(f)); } }}
                  className="hidden" id="hero_upload" />
                <button type="button" onClick={() => heroInputRef.current?.click()}
                  className="w-full flex items-center justify-center gap-3 px-5 py-3.5 rounded-2xl border-2 border-dashed border-border hover:border-primary/60 bg-secondary/40 hover:bg-primary/5 text-foreground transition duration-300 group"
                >
                  <ImagePlus size={20} className="text-muted-foreground group-hover:text-primary transition" />
                  <div className="text-left">
                    <p className="font-semibold text-sm group-hover:text-primary transition">{heroPreview ? 'Ganti Foto Hero' : 'Upload Foto Hero Baru'}</p>
                    <p className="text-xs text-muted-foreground">JPG, PNG, WebP — Maks. 3 MB</p>
                  </div>
                </button>
                {errors.hero_image && <p className="text-xs text-destructive">{errors.hero_image}</p>}
                {settings?.hero_image && (
                  <button type="button" onClick={() => post(route('admin.pengaturan.reset-hero'), { onSuccess: () => setHeroPreview(null) })}
                    disabled={processing}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-border text-xs font-bold text-muted-foreground hover:text-destructive hover:border-destructive/40 hover:bg-destructive/5 transition"
                  ><RotateCcw size={13} /> Reset ke Foto Default</button>
                )}
              </div>
            </div>

            {/* Kanan: Teks overlay + info */}
            <div className="space-y-6">
              <div className="bg-card rounded-3xl border border-border p-6 shadow-xl space-y-5">
                <h2 className="font-serif text-xl font-bold flex items-center gap-2">
                  <Type size={20} className="text-primary" />
                  Teks Overlay Hero
                </h2>
                <TextField id="hero_label" label="Label Kecil (uppercase)" value={data.hero_label} onChange={(v) => setData('hero_label', v)} placeholder="AI Signature Blend" maxLength={60} error={errors.hero_label} />
                <TextField id="hero_title" label="Judul Parfum (serif bold)" value={data.hero_title} onChange={(v) => setData('hero_title', v)} placeholder="Velour d'Or #99" maxLength={80} error={errors.hero_title} />
                <TextField id="hero_badge" label="Badge (pill kanan)" value={data.hero_badge} onChange={(v) => setData('hero_badge', v)} placeholder="Top 1% Pick" maxLength={40} error={errors.hero_badge} />
              </div>

              <div className="bg-primary/5 border border-primary/20 rounded-2xl p-5 space-y-2">
                <p className="text-xs font-bold text-primary uppercase tracking-wider">Catatan</p>
                <ul className="text-xs text-muted-foreground space-y-1.5">
                  <li>• Foto tersimpan di <code className="bg-secondary px-1 rounded text-foreground">storage/app/public/hero/</code></li>
                  <li>• Rasio ideal: <strong>16:9</strong> atau <strong>3:2</strong> (landscape)</li>
                  <li>• Resolusi minimal: <strong>1200 × 600 px</strong></li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════════════════
            TAB 2: TENTANG KAMI
        ════════════════════════════════════════════════════════════ */}
        {activeTab === 'tentang' && (
          <div className="space-y-8">

            {/* ── Bagian Kisah Kami ── */}
            <div>
              <div className="flex items-center gap-3 mb-5">
                <div className="size-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">1</div>
                <div>
                  <h2 className="font-serif text-xl font-bold text-foreground">Foto "Kisah Kami"</h2>
                  <p className="text-xs text-muted-foreground">Gambar besar di sebelah teks latar belakang inovasi.</p>
                </div>
              </div>

              <div className="grid lg:grid-cols-2 gap-6">
                {/* Preview Kisah */}
                <div className="bg-card rounded-3xl border border-border p-5 shadow-xl space-y-4">
                  <div className="relative h-[260px] rounded-2xl overflow-hidden border border-border">
                    <img src={kisahPreview || KISAH_DEFAULT} alt="Preview kisah" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4 p-4 bg-background/85 backdrop-blur-md rounded-xl border border-border/80">
                      <div className="font-serif font-bold text-sm text-foreground">{data.tentang_kisah_label}</div>
                      <p className="text-[10px] text-muted-foreground mt-0.5 line-clamp-2">{data.tentang_kisah_desc}</p>
                    </div>
                  </div>

                  <input ref={kisahInputRef} type="file" accept="image/jpeg,image/png,image/webp" id="kisah_upload"
                    onChange={(e) => { const f = e.target.files[0]; if (f) { setData('tentang_kisah_image', f); setKisahPreview(URL.createObjectURL(f)); } }}
                    className="hidden" />
                  <button type="button" onClick={() => kisahInputRef.current?.click()}
                    className="w-full flex items-center justify-center gap-3 px-5 py-3 rounded-2xl border-2 border-dashed border-border hover:border-primary/60 bg-secondary/40 hover:bg-primary/5 transition duration-300 group"
                  >
                    <ImagePlus size={18} className="text-muted-foreground group-hover:text-primary transition" />
                    <div className="text-left">
                      <p className="font-semibold text-sm group-hover:text-primary transition">{kisahPreview ? 'Ganti Foto Kisah' : 'Upload Foto Kisah'}</p>
                      <p className="text-xs text-muted-foreground">JPG, PNG, WebP — Maks. 3 MB</p>
                    </div>
                  </button>
                  {errors.tentang_kisah_image && <p className="text-xs text-destructive">{errors.tentang_kisah_image}</p>}
                  {settings?.tentang_kisah_image && (
                    <button type="button" onClick={() => post(route('admin.pengaturan.reset-kisah'), { onSuccess: () => setKisahPreview(null) })}
                      disabled={processing}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-border text-xs font-bold text-muted-foreground hover:text-destructive hover:border-destructive/40 hover:bg-destructive/5 transition"
                    ><RotateCcw size={13} /> Reset ke Unsplash Default</button>
                  )}
                </div>

                {/* Form teks kisah */}
                <div className="bg-card rounded-3xl border border-border p-5 shadow-xl space-y-5">
                  <h3 className="font-serif text-lg font-bold flex items-center gap-2">
                    <Type size={16} className="text-primary" /> Teks Overlay Foto Kisah
                  </h3>
                  <TextField id="kisah_label" label="Judul Overlay" value={data.tentang_kisah_label} onChange={(v) => setData('tentang_kisah_label', v)} placeholder="Koleksi 36 Varian Pilihan" maxLength={80} error={errors.tentang_kisah_label} />
                  <TextField id="kisah_desc" label="Deskripsi Overlay" value={data.tentang_kisah_desc} onChange={(v) => setData('tentang_kisah_desc', v)} placeholder="Diformulasikan secara ketat..." maxLength={300} error={errors.tentang_kisah_desc} multiline />
                </div>
              </div>
            </div>

          </div>
        )}

        {/* ── Tombol Simpan Global ── */}
        <div className="mt-8 flex justify-end">
          <button
            type="submit"
            disabled={processing}
            className="flex items-center gap-3 px-10 py-4 rounded-2xl bg-primary text-primary-foreground font-bold text-sm uppercase tracking-wider shadow-xl shadow-primary/25 hover:opacity-95 transition transform hover:-translate-y-0.5 disabled:opacity-60 disabled:pointer-events-none"
          >
            <Save size={18} />
            {processing ? 'Menyimpan...' : 'Simpan Semua Perubahan'}
          </button>
        </div>
      </form>
    </AdminLayout>
  );
}
