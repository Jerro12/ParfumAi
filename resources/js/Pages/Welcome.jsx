import { Head, Link } from '@inertiajs/react';
import { SiteHeader } from "@/Components/SiteHeader";
import { SiteFooter } from "@/Components/SiteFooter";
import { ChatbotWidget } from "@/Components/ChatbotWidget";
import { products } from "@/lib/products";
import { heroImg } from "@/assets/hero-perfume";
import { Star } from 'lucide-react';

export default function Welcome({ dbFeaturedProducts }) {
  const activeProducts = (dbFeaturedProducts && dbFeaturedProducts.length > 0) ? dbFeaturedProducts : products;

  return (
    <>
      <Head>
        <title>Parfumerie AI — Wewangian Mewah untuk Setiap Momen</title>
        <meta name="description" content="Temukan parfum eksklusif dengan rekomendasi cerdas dari asisten AI kami." />
        <meta property="og:title" content="Parfumerie AI" />
        <meta property="og:description" content="Wewangian eksklusif yang mencerminkan kepribadian Anda." />
      </Head>

      <div className="min-h-screen flex flex-col bg-background text-foreground selection:bg-primary selection:text-white antialiased font-sans">
        <SiteHeader />
        
        <main className="flex-1 font-sans">
          {/* Hero Section */}
          <section className="container mx-auto px-6 pt-12 pb-20 max-w-7xl">
            <div className="grid md:grid-cols-2 gap-10 items-center bg-card rounded-3xl p-8 md:p-14 border border-border/80 shadow-2xl relative overflow-hidden font-sans">
              <div className="absolute -top-24 -right-24 w-72 h-72 bg-gold/15 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-primary/15 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10 space-y-6 text-center md:text-left font-sans">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs md:text-sm font-medium">
                  <span className="animate-pulse">✨</span> Rekomendasi AI Personal
                </div>

                <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold leading-[1.1] text-foreground tracking-tight">
                  Wewangian Mewah<br />
                  <span className="text-primary italic">untuk Setiap Momen</span>
                </h1>

                <p className="text-muted-foreground text-base md:text-lg max-w-md mx-auto md:mx-0 leading-relaxed font-sans">
                  Temukan keharuman eksklusif yang mencerminkan kepribadian Anda. Dipandu oleh asisten AI yang memahami selera dan emosi Anda.
                </p>

                <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center md:justify-start font-sans">
                  <Link
                    href={route('katalog')}
                    className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-primary text-primary-foreground shadow-xl shadow-primary/25 hover:opacity-95 transition transform hover:-translate-y-0.5 font-bold text-xs uppercase tracking-wider"
                  >
                    Jelajahi Koleksi
                  </Link>
                  <Link
                    href={route('tentang')}
                    className="inline-flex items-center justify-center px-8 py-4 rounded-full border border-border bg-card/60 hover:bg-card hover:border-gold/50 text-foreground transition font-bold text-xs uppercase tracking-wider"
                  >
                    Pelajari Lebih
                  </Link>
                </div>
              </div>

              <div className="relative z-10 flex justify-center font-sans">
                <div className="relative w-full p-2 bg-gradient-to-tr from-primary/30 via-gold/30 to-forest/30 rounded-3xl shadow-2xl">
                  <img
                    src={heroImg}
                    alt="Koleksi parfum mewah"
                    width={1600}
                    height={1024}
                    className="rounded-2xl w-full h-[380px] sm:h-[420px] object-cover hover:scale-[1.01] transition duration-500"
                  />
                  <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-background/80 backdrop-blur-md border border-border flex items-center justify-between shadow-lg">
                    <div className="space-y-0.5">
                      <p className="text-xs text-primary font-semibold uppercase">AI Signature Blend</p>
                      <p className="font-serif font-bold text-foreground sm:text-lg">Velour d'Or #99</p>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-gold/20 text-primary text-xs font-bold font-serif">Top 1% Pick</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Featured Collection Section */}
          <section id="koleksi" className="container mx-auto px-6 py-16 max-w-7xl font-sans">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4 border-b border-border/60 pb-6 font-sans">
              <div className="space-y-2">
                <span className="text-xs uppercase tracking-widest text-primary font-bold">Katalog Eksklusif Terpopuler</span>
                <h2 className="font-serif text-3xl md:text-5xl font-bold tracking-tight text-foreground">Koleksi Pilihan Kami</h2>
              </div>
              <Link href={route('katalog')} className="text-sm font-bold text-primary hover:underline flex items-center gap-1 self-start sm:self-auto uppercase tracking-wider">
                Lihat semua 36 parfum ➜
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 font-sans">
              {activeProducts.map((p) => (
                <article
                  key={p.id}
                  className="bg-card rounded-3xl border border-border/80 overflow-hidden group hover:shadow-2xl hover:border-gold/50 transition duration-500 flex flex-col justify-between font-sans relative"
                >
                  <div className="aspect-square overflow-hidden bg-secondary relative font-sans">
                    <img
                      src={p.image || 'https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=800&auto=format&fit=crop'}
                      alt={p.name}
                      loading="lazy"
                      width={800}
                      height={800}
                      className="size-full object-cover group-hover:scale-105 transition duration-700"
                    />
                    <div className="absolute top-4 left-4 bg-background/85 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-primary border border-border shadow-sm">
                      {p.gender || 'Unisex'}
                    </div>
                    {p.is_bestseller && (
                      <div className="absolute top-4 right-4 bg-gold text-background px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-md flex items-center gap-1">
                        <Star size={10} className="fill-current" /> Best Seller
                      </div>
                    )}
                  </div>
                  
                  <div className="p-6 space-y-4 flex-1 flex flex-col justify-between font-sans">
                    <div className="space-y-1">
                      <span className="text-[11px] text-muted-foreground uppercase font-bold tracking-wider">{p.category || 'Wewangian Eksklusif'}</span>
                      <h3 className="font-serif text-2xl font-bold text-foreground group-hover:text-primary transition duration-300">{p.name}</h3>
                      <p className="text-xs text-foreground/80 font-medium pt-1">⏳ Daya Tahan: {p.longevity || p.notes || '4-6 Jam'}</p>
                    </div>

                    <div className="pt-4 border-t border-border/50 flex items-center justify-between font-sans">
                      <span className="font-mono font-extrabold text-base text-foreground">
                        Rp {Number(p.price || 50000).toLocaleString('id-ID')}
                      </span>
                      <Link
                        href={route('katalog.detail', p.id || 1)}
                        className="text-xs font-bold uppercase tracking-wider px-4 py-2.5 rounded-full bg-primary text-primary-foreground hover:opacity-90 transition shadow-md shadow-primary/20"
                      >
                        Beli Sekarang
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>

          {/* AI Banner Section */}
          <section id="asisten-ai" className="container mx-auto px-6 py-20 max-w-7xl font-sans">
            <div className="bg-forest text-forest-foreground rounded-3xl p-10 md:p-16 grid md:grid-cols-2 gap-12 items-center relative overflow-hidden shadow-2xl border border-gold/20 font-sans">
              <div className="absolute -top-32 -right-32 w-96 h-96 bg-gold/10 rounded-full blur-3xl pointer-events-none" />

              <div className="space-y-6 relative z-10 font-sans">
                <span className="inline-block text-xs uppercase tracking-[0.3em] font-bold text-gold bg-gold/10 px-4 py-1.5 rounded-full border border-gold/20">
                  ASISTEN KECERDASAN BUATAN
                </span>
                
                <h2 className="font-serif text-4xl sm:text-5xl font-extrabold leading-[1.1] tracking-tight text-gold">
                  Temukan Parfum Sempurna Anda
                </h2>
                
                <p className="text-forest-foreground/80 max-w-md leading-relaxed text-base md:text-lg font-sans">
                  Chatbot cerdas kami memahami preferensi aroma, memori olfaktori, dan gaya hidup Anda untuk merekomendasikan wewangian yang paling cocok secara presisi.
                </p>

                <div className="pt-2 font-sans">
                  <Link
                    href={route('tentang')}
                    className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gold text-forest font-bold text-xs uppercase tracking-wider shadow-xl hover:bg-white hover:scale-105 transition duration-300"
                  >
                    <span>Mulai Konsultasi Gratis</span> ➜
                  </Link>
                </div>
              </div>

              <div className="relative z-10 flex flex-col gap-4 font-sans">
                <div className="bg-card/95 text-foreground rounded-2xl p-6 shadow-2xl border border-border/80 transform -rotate-1 hover:rotate-0 transition duration-300 space-y-3 backdrop-blur-md font-sans">
                  <div className="flex items-center gap-3 border-b border-border/50 pb-3 font-sans">
                    <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">U</span>
                    <div className="text-xs font-semibold text-muted-foreground font-sans">Pertanyaan Pengguna</div>
                  </div>
                  <p className="text-sm italic font-medium font-sans">"Saya cari parfum untuk acara makan malam romantis..."</p>
                </div>

                <div className="bg-card text-foreground rounded-2xl p-6 shadow-2xl border border-border/80 transform rotate-1 hover:rotate-0 transition duration-300 space-y-3 self-end w-11/12 border-l-4 border-l-gold backdrop-blur-md font-sans">
                  <div className="flex items-center gap-3 border-b border-border/50 pb-3 font-sans">
                    <span className="w-8 h-8 rounded-full bg-gold/20 text-gold flex items-center justify-center font-bold text-sm">✨</span>
                    <div className="text-xs font-semibold text-primary font-sans">Jawaban AI Scent Sommelier</div>
                  </div>
                  <p className="text-sm leading-relaxed font-sans">
                    ➜ <span className="text-primary font-bold">Midnight Velour</span> akan sangat cocok. Perpaduan Amber eksotis dan Damask Rose menciptakan kesan elegan, romantis, dan misterius.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </main>

        <SiteFooter />
        <ChatbotWidget />
      </div>
    </>
  );
}
