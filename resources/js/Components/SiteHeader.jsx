import { Link, usePage } from '@inertiajs/react';
import { ShoppingBag, Sparkles, User, ChevronDown, LogOut, Settings, Package, Ticket } from 'lucide-react';
import { useState } from 'react';

export function SiteHeader() {
    const { auth, cartCount } = usePage().props;
    const [dropdownOpen, setDropdownOpen] = useState(false);

    return (
        <header className="sticky top-0 z-50 backdrop-blur-md bg-background/85 border-b border-border/50 px-6 py-4 transition-all duration-300 shadow-sm font-sans">
            <div className="container mx-auto flex items-center justify-between max-w-7xl">
                <Link href="/" className="font-serif text-2xl lg:text-3xl font-bold tracking-tight text-primary flex items-center gap-2.5 group">
                    <span className="p-1.5 bg-primary/10 group-hover:bg-primary group-hover:text-primary-foreground rounded-xl text-primary text-xl transition duration-300 shadow-inner">✧</span>
                    Parfumerie <span className="text-gold">AI</span>
                </Link>

                <nav className="hidden md:flex items-center gap-8 font-semibold text-sm text-foreground/85 font-sans">
                    <Link href="/" className="hover:text-primary transition duration-200">Beranda</Link>
                    <Link href={route('katalog')} className="hover:text-primary transition duration-200 flex items-center gap-1">
                        <span>Katalog Eksklusif</span>
                        <span className="px-1.5 py-0.5 rounded-md bg-gold/10 text-gold text-[10px] uppercase font-bold tracking-wider">New</span>
                    </Link>
                    <Link href={route('tentang')} className="hover:text-primary transition duration-200">Tentang Kami</Link>
                </nav>

                <div className="flex items-center gap-5 font-sans">
                    <Link href={route('keranjang')} className="relative p-2 text-foreground hover:text-primary transition duration-200" title="Keranjang Belanja">
                        <ShoppingBag size={20} />
                        {(cartCount > 0 || auth?.user) && (
                            <span className="absolute top-0 right-0 px-1.5 py-0.5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold font-mono">
                                {cartCount || 0}
                            </span>
                        )}
                    </Link>

                    {auth?.user ? (
                        auth.user.role === 'admin' ? (
                            <Link
                                href={route('admin.dashboard')}
                                className="px-5 py-2.5 rounded-full bg-forest text-gold border border-gold/40 font-bold text-xs shadow-md hover:bg-forest/90 transition flex items-center gap-2 uppercase tracking-wider font-sans"
                            >
                                <Sparkles size={14} className="text-gold animate-spin" /> Ruang Admin
                            </Link>
                        ) : (
                            <div className="relative font-sans">
                                <button
                                    onClick={() => setDropdownOpen(!dropdownOpen)}
                                    className="px-4 py-2.5 rounded-full bg-secondary/80 border border-border text-foreground font-semibold text-xs shadow-sm hover:bg-secondary transition flex items-center gap-2 uppercase tracking-wider font-sans"
                                >
                                    <User size={14} className="text-primary" />
                                    <span className="max-w-[120px] truncate">{auth.user.name}</span>
                                    <ChevronDown size={14} className={`transition-transform duration-200 ${dropdownOpen ? "rotate-180 text-primary" : ""}`} />
                                </button>

                                {dropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-56 bg-card border border-border/80 rounded-2xl shadow-xl py-2 z-50 animate-fade-in font-sans">
                                        <div className="px-4 py-2 border-b border-border/60">
                                            <div className="text-xs font-bold text-foreground truncate">{auth.user.name}</div>
                                            <div className="text-[10px] text-muted-foreground truncate font-mono">{auth.user.email}</div>
                                        </div>

                                        <Link
                                            href={route('katalog')}
                                            onClick={() => setDropdownOpen(false)}
                                            className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-medium text-foreground hover:bg-secondary/60 hover:text-primary transition font-sans"
                                        >
                                            <Package size={14} className="text-primary" />
                                            <span>Belanja Parfum</span>
                                        </Link>

                                        <Link
                                            href={route('riwayat')}
                                            onClick={() => setDropdownOpen(false)}
                                            className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-medium text-foreground hover:bg-secondary/60 hover:text-primary transition font-sans"
                                        >
                                            <Ticket size={14} className="text-primary" />
                                            <span>Riwayat & Tiket Toko</span>
                                        </Link>

                                        <Link
                                            href={route('profile.edit')}
                                            onClick={() => setDropdownOpen(false)}
                                            className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-medium text-foreground hover:bg-secondary/60 hover:text-primary transition font-sans"
                                        >
                                            <Settings size={14} className="text-muted-foreground" />
                                            <span>Pengaturan Akun</span>
                                        </Link>

                                        <div className="border-t border-border/60 my-1"></div>

                                        <Link
                                            href={route('logout')}
                                            method="post"
                                            as="button"
                                            onClick={() => setDropdownOpen(false)}
                                            className="flex items-center w-full gap-2.5 px-4 py-2.5 text-xs font-medium text-rose-500 hover:bg-rose-500/10 transition text-left font-sans"
                                        >
                                            <LogOut size={14} />
                                            <span>Keluar Akun</span>
                                        </Link>
                                    </div>
                                )}
                            </div>
                        )
                    ) : (
                        <div className="flex items-center gap-3 font-sans">
                            <Link href={route('login')} className="text-xs font-bold uppercase tracking-wider hover:text-primary px-3 py-2 transition font-sans">
                                Masuk
                            </Link>
                            <Link href={route('register')} className="px-5 py-2.5 rounded-full bg-primary text-primary-foreground font-semibold text-xs shadow-md shadow-primary/20 hover:bg-primary/90 transition transform hover:-translate-y-0.5 uppercase tracking-wider font-sans">
                                Daftar
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
