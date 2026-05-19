import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { ShoppingBag, Sparkles, User, ChevronDown, LogOut, Settings, Package, Ticket, LayoutDashboard, Menu, X } from 'lucide-react';

export default function AuthenticatedLayout({ header, children }) {
    const { auth, cartCount } = usePage().props;
    const user = auth.user;
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);

    return (
        <div className="min-h-screen bg-background text-foreground antialiased font-sans">
            <header className="sticky top-0 z-50 backdrop-blur-md bg-background/85 border-b border-border/50 px-6 py-4 transition-all duration-300 shadow-sm font-sans">
                <div className="container mx-auto flex items-center justify-between max-w-7xl">
                    <div className="flex items-center gap-8">
                        <Link href="/" className="font-serif text-2xl lg:text-3xl font-bold tracking-tight text-primary flex items-center gap-2.5 group">
                            <span className="p-1.5 bg-primary/10 group-hover:bg-primary group-hover:text-primary-foreground rounded-xl text-primary text-xl transition duration-300 shadow-inner">✧</span>
                            Parfumerie <span className="text-gold">AI</span>
                        </Link>

                        <nav className="hidden lg:flex items-center gap-8 font-semibold text-sm text-foreground/85 font-sans">
                            <Link href="/" className="hover:text-primary transition duration-200">Beranda</Link>
                            <Link href={route('katalog')} className="hover:text-primary transition duration-200 flex items-center gap-1">
                                <span>Katalog Eksklusif</span>
                                <span className="px-1.5 py-0.5 rounded-md bg-gold/10 text-gold text-[10px] uppercase font-bold tracking-wider">New</span>
                            </Link>
                            {!route().current('profile.edit') && (
                                <Link href={route('dashboard')} className={`transition duration-200 flex items-center gap-1.5 ${route().current('dashboard') ? 'text-primary font-bold' : 'hover:text-primary'}`}>
                                    <LayoutDashboard size={16} />
                                    <span>Dashboard</span>
                                </Link>
                            )}
                            <Link href={route('tentang')} className="hover:text-primary transition duration-200">Tentang Kami</Link>
                        </nav>
                    </div>

                    <div className="flex items-center gap-5 font-sans">
                        <Link href={route('keranjang')} className="relative p-2 text-foreground hover:text-primary transition duration-200" title="Keranjang Belanja">
                            <ShoppingBag size={20} />
                            {(cartCount > 0 || user) && (
                                <span className="absolute top-0 right-0 px-1.5 py-0.5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold font-mono">
                                    {cartCount || 0}
                                </span>
                            )}
                        </Link>

                        {user.role === 'admin' && (
                            <Link
                                href={route('admin.dashboard')}
                                className="hidden md:flex px-5 py-2.5 rounded-full bg-forest text-gold border border-gold/40 font-bold text-xs shadow-md hover:bg-forest/90 transition items-center gap-2 uppercase tracking-wider font-sans"
                            >
                                <Sparkles size={14} className="text-gold animate-spin" /> Ruang Admin
                            </Link>
                        )}

                        <div className="hidden sm:block relative font-sans">
                            <button
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                                className="px-4 py-2.5 rounded-full bg-secondary/80 border border-border text-foreground font-semibold text-xs shadow-sm hover:bg-secondary transition flex items-center gap-2 uppercase tracking-wider font-sans"
                            >
                                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                                <span className="max-w-[120px] truncate">{user.name}</span>
                                <ChevronDown size={14} className={`transition-transform duration-200 ${dropdownOpen ? "rotate-180 text-primary" : ""}`} />
                            </button>

                            {dropdownOpen && (
                                <div className="absolute right-0 mt-2 w-64 bg-card border border-border/80 rounded-2xl shadow-xl py-2 z-50 animate-fade-in font-sans">
                                    <div className="px-4 py-3 border-b border-border/60">
                                        <div className="text-xs font-bold text-foreground truncate">{user.name}</div>
                                        <div className="text-[10px] text-muted-foreground truncate font-mono">{user.email}</div>
                                        <div className="mt-1 inline-block px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider font-serif">
                                            {user.role}
                                        </div>
                                    </div>

                                    <Link
                                        href={route('dashboard')}
                                        onClick={() => setDropdownOpen(false)}
                                        className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-medium text-foreground hover:bg-secondary/60 hover:text-primary transition font-sans"
                                    >
                                        <LayoutDashboard size={14} className="text-primary" />
                                        <span>Dashboard Pelanggan</span>
                                    </Link>

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

                        <div className="flex items-center lg:hidden">
                            <button
                                onClick={() => setShowingNavigationDropdown(!showingNavigationDropdown)}
                                className="p-2 rounded-xl text-muted-foreground hover:bg-secondary hover:text-foreground transition"
                            >
                                {showingNavigationDropdown ? <X size={24} /> : <Menu size={24} />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile menu */}
                {showingNavigationDropdown && (
                    <div className="lg:hidden mt-4 pt-4 border-t border-border/80 font-sans animate-fade-in pb-2">
                        <div className="space-y-1">
                            <ResponsiveNavLink href="/" active={route().current('home')}>Beranda</ResponsiveNavLink>
                            <ResponsiveNavLink href={route('katalog')} active={route().current('katalog')}>Katalog Eksklusif</ResponsiveNavLink>
                            {!route().current('profile.edit') && (
                                <ResponsiveNavLink href={route('dashboard')} active={route().current('dashboard')}>Dashboard</ResponsiveNavLink>
                            )}
                            <ResponsiveNavLink href={route('tentang')} active={route().current('tentang')}>Tentang Kami</ResponsiveNavLink>
                            {user.role === 'admin' && (
                                <ResponsiveNavLink href={route('admin.dashboard')} active={route().current('admin.dashboard')}>Ruang Admin</ResponsiveNavLink>
                            )}
                        </div>

                        <div className="mt-4 pt-4 border-t border-border/60">
                            <div className="px-4 py-1">
                                <div className="font-serif font-bold text-base text-foreground">{user.name}</div>
                                <div className="text-xs text-muted-foreground font-mono">{user.email}</div>
                            </div>
                            <div className="space-y-1 mt-2">
                                <ResponsiveNavLink href={route('profile.edit')}>Pengaturan Akun</ResponsiveNavLink>
                                <ResponsiveNavLink href={route('riwayat')}>Riwayat Pesanan</ResponsiveNavLink>
                                <ResponsiveNavLink method="post" href={route('logout')} as="button">Keluar</ResponsiveNavLink>
                            </div>
                        </div>
                    </div>
                )}
            </header>

            {header && (
                <div className="bg-card/60 backdrop-blur-md border-b border-border/50 shadow-sm">
                    <div className="mx-auto max-w-7xl px-6 py-6 lg:px-8">
                        {header}
                    </div>
                </div>
            )}

            <main className="pb-16">{children}</main>
        </div>
    );
}
