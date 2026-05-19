import { SiteHeader } from '@/Components/SiteHeader';
import { SiteFooter } from '@/Components/SiteFooter';
import { ChatbotWidget } from '@/Components/ChatbotWidget';
import { Head, Link } from '@inertiajs/react';
import { Sparkles, ShieldCheck, Heart, Bot, Store, MapPin, Clock, Phone, Award, Compass, ArrowRight } from 'lucide-react';

export default function TentangKami() {
    return (
        <div className="min-h-screen flex flex-col bg-background text-foreground antialiased font-sans">
            <Head title="Tentang Kami — Parfumerie AI" />
            <SiteHeader />

            <main className="flex-1 pb-24 font-sans">
                
                {/* Hero Banner */}
                <section className="relative overflow-hidden py-24 sm:py-32 bg-forest text-gold border-b border-gold/20">
                    <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gold/15 rounded-full blur-3xl pointer-events-none" />

                    <div className="container mx-auto px-6 max-w-5xl text-center relative z-10 space-y-6">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold/20 border border-gold/40 text-gold text-xs font-bold uppercase tracking-widest mx-auto">
                            <Sparkles size={14} className="animate-spin text-gold" /> Filosofi & Mahakarya Olfaktori
                        </div>

                        <h1 className="font-serif text-5xl sm:text-7xl font-extrabold tracking-tight text-gold leading-tight">
                            Menjembatani Tradisi Wewangian & Kecerdasan Buatan
                        </h1>

                        <p className="text-white/80 text-base sm:text-lg max-w-3xl mx-auto font-sans leading-relaxed">
                            Parfumerie AI lahir dari keyakinan bahwa setiap individu memiliki jejak aroma (*scent signature*) yang unik. Kami memadukan kehalusan seni meracik parfum eksklusif dengan presisi teknologi NLP Artificial Intelligence untuk merekomendasikan keharuman paling sempurna bagi Anda.
                        </p>
                    </div>
                </section>

                {/* Kisah Kami Section */}
                <section className="container mx-auto px-6 pt-20 max-w-7xl font-sans">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div className="relative h-[450px] sm:h-[550px] rounded-3xl overflow-hidden shadow-2xl border border-border">
                            <img
                                src="https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=800&auto=format&fit=crop"
                                alt="Seni Meracik Parfum"
                                className="w-full h-full object-cover hover:scale-105 transition duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent" />
                            <div className="absolute bottom-8 left-8 right-8 p-6 bg-background/85 backdrop-blur-md rounded-2xl border border-border/80">
                                <div className="font-serif font-bold text-xl text-foreground">Koleksi 36 Varian Pilihan</div>
                                <p className="text-xs text-muted-foreground mt-1">Diformulasikan secara ketat berdasarkan dataset olfaktori teruji untuk menjamin ketahanan dan proyeksi aroma terbaik.</p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="inline-flex items-center gap-2 text-xs font-bold text-primary uppercase tracking-widest">
                                <Compass size={16} /> Latar Belakang Inovasi
                            </div>
                            
                            <h2 className="font-serif text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
                                Merevolusi Pemilihan Parfum Melalui Scent Sommelier AI
                            </h2>

                            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                                Memilih parfum seringkali menjadi perjalanan yang membingungkan dengan ribuan kombinasi wangi yang ada di pasaran. Melalui penelitian intensif dan integrasi *Rasa Natural Language Processing (NLP)*, kami mengembangkan asisten virtual yang mampu menganalisis preferensi aktivitas, gaya hidup, dan suasana hati Anda.
                            </p>

                            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                                Seluruh 36 varian parfum kami—mulai dari kesegaran *Sauvage Louis* hingga kemewahan *Baccarat Dubai*—telah dikurasi tanpa kompromi menggunakan bahan baku berkualitas tinggi yang memberikan daya tahan ekstrem hingga 12 jam.
                            </p>

                            <div className="pt-4">
                                <Link
                                    href={route('katalog')}
                                    className="inline-flex items-center gap-2 px-8 py-3.5 bg-primary text-primary-foreground rounded-full text-xs font-bold uppercase tracking-wider shadow-lg shadow-primary/25 hover:opacity-90 transition transform hover:-translate-y-0.5"
                                >
                                    <span>Eksplorasi Katalog Kami</span>
                                    <ArrowRight size={16} />
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Nilai Utama Kami */}
                <section className="container mx-auto px-6 pt-24 max-w-7xl font-sans">
                    <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
                        <div className="text-xs font-bold text-primary uppercase tracking-widest">Pilar Kualitas Toko</div>
                        <h2 className="font-serif text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">4 Nilai Utama Parfumerie AI</h2>
                        <p className="text-xs text-muted-foreground">Komitmen tak tergoyahkan kami untuk memberikan kepuasan dan pengalaman berbelanja nomor satu.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <div className="bg-card border border-border/80 rounded-3xl p-8 space-y-4 shadow-sm hover:shadow-xl transition group hover:border-gold/50">
                            <div className="size-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20 group-hover:scale-110 transition duration-300">
                                <ShieldCheck size={28} />
                            </div>
                            <h3 className="font-serif text-xl font-bold text-foreground">100% Ekstrak Murni</h3>
                            <p className="text-xs text-muted-foreground leading-relaxed">Menggunakan konsentrat minyak wangi murni bebas alkohol berlebih, menjamin wangi yang tidak menyengat dan aman bagi kulit sensitif.</p>
                        </div>

                        <div className="bg-card border border-border/80 rounded-3xl p-8 space-y-4 shadow-sm hover:shadow-xl transition group hover:border-gold/50">
                            <div className="size-14 rounded-2xl bg-gold/10 text-gold flex items-center justify-center border border-gold/20 group-hover:scale-110 transition duration-300">
                                <Bot size={28} />
                            </div>
                            <h3 className="font-serif text-xl font-bold text-foreground">Scent Sommelier AI</h3>
                            <p className="text-xs text-muted-foreground leading-relaxed">Asisten virtual cerdas yang mendampingi Anda 24/7 untuk merekomendasikan parfum sesuai dengan kepribadian dan acara spesifik Anda.</p>
                        </div>

                        <div className="bg-card border border-border/80 rounded-3xl p-8 space-y-4 shadow-sm hover:shadow-xl transition group hover:border-gold/50">
                            <div className="size-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20 group-hover:scale-110 transition duration-300">
                                <Award size={28} />
                            </div>
                            <h3 className="font-serif text-xl font-bold text-foreground">Fleksibilitas Ukuran</h3>
                            <p className="text-xs text-muted-foreground leading-relaxed">Tersedia dalam kemasan dinamis mulai dari 10ml seharga Rp 8.000 hingga botol mewah 100ml seharga Rp 50.000 untuk segala kebutuhan.</p>
                        </div>

                        <div className="bg-card border border-border/80 rounded-3xl p-8 space-y-4 shadow-sm hover:shadow-xl transition group hover:border-gold/50">
                            <div className="size-14 rounded-2xl bg-gold/10 text-gold flex items-center justify-center border border-gold/20 group-hover:scale-110 transition duration-300">
                                <Heart size={28} />
                            </div>
                            <h3 className="font-serif text-xl font-bold text-foreground">Garansi Pengiriman</h3>
                            <p className="text-xs text-muted-foreground leading-relaxed">Setiap botol dikemas berlapis perlindungan ekstra. Kami memberikan garansi penggantian baru tanpa biaya jika terjadi kerusakan selama ekspedisi.</p>
                        </div>
                    </div>
                </section>

                {/* Butik Fisik & Jam Operasional */}
                <section className="container mx-auto px-6 pt-24 max-w-5xl font-sans">
                    <div className="bg-card border border-border rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        <div className="absolute top-0 right-0 w-80 h-80 bg-gold/5 rounded-full blur-3xl pointer-events-none" />

                        <div className="space-y-6 relative z-10">
                            <div className="inline-flex items-center gap-2 text-xs font-bold text-gold uppercase tracking-widest">
                                <Store size={16} /> Kunjungan Langsung
                            </div>

                            <h2 className="font-serif text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
                                Kunjungi Butik Eksklusif Kami
                            </h2>

                            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed font-sans">
                                Ingin merasakan langsung sensasi penciuman dari ke-36 mahakarya aroma kami? Butik fisik Parfumerie AI siap menyambut kedatangan Anda dengan suasana elegan dan hangat. Anda juga dapat memilih metode **Ambil di Toko (*In-Store Pickup*)** saat melakukan pemesanan daring.
                            </p>

                            <div className="space-y-3 pt-2 text-xs font-sans">
                                <div className="flex items-start gap-3">
                                    <MapPin size={18} className="text-primary shrink-0 mt-0.5" />
                                    <div>
                                        <div className="font-bold text-foreground">Alamat Lokasi:</div>
                                        <div className="text-muted-foreground mt-0.5">Jl. Scent Boulevard No. 88, Kawasan Elit Sudirman, Jakarta Selatan, 12190</div>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <Clock size={18} className="text-gold shrink-0 mt-0.5" />
                                    <div>
                                        <div className="font-bold text-foreground">Jam Operasional Butik:</div>
                                        <div className="text-muted-foreground mt-0.5">Senin – Minggu : 09.00 – 21.00 WIB (Buka Setiap Hari)</div>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <Phone size={18} className="text-primary shrink-0 mt-0.5" />
                                    <div>
                                        <div className="font-bold text-foreground">Layanan Sommelier / Reservasi:</div>
                                        <div className="text-muted-foreground mt-0.5 font-mono">+62 811-9999-8888 (WhatsApp & Telepon)</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Map Illustration Box */}
                        <div className="h-80 rounded-2xl bg-secondary/80 border border-border/80 flex flex-col items-center justify-center p-6 text-center relative overflow-hidden group shadow-inner">
                            <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] opacity-5 [background-size:16px_16px]" />
                            <Store size={64} className="text-gold mb-4 group-hover:scale-110 transition duration-500" />
                            <div className="font-serif font-bold text-xl text-foreground">Butik Pusat Parfumerie AI</div>
                            <p className="text-xs text-muted-foreground max-w-xs mt-2">Pusat pencampuran wewangian premium dan titik pengambilan in-store terverifikasi.</p>
                            <a
                                href="https://maps.google.com"
                                target="_blank"
                                rel="noreferrer"
                                className="mt-6 px-6 py-2.5 bg-primary text-primary-foreground rounded-full text-xs font-bold uppercase tracking-wider shadow-md hover:opacity-90 transition inline-flex items-center gap-1.5"
                            >
                                <MapPin size={14} /> Buka di Google Maps
                            </a>
                        </div>
                    </div>
                </section>

            </main>

            <ChatbotWidget />
            <SiteFooter />
        </div>
    );
}
