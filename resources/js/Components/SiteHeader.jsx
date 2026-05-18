import { Link, usePage } from '@inertiajs/react';

export function SiteHeader() {
    const { auth } = usePage().props;

    return (
        <header className="sticky top-0 z-50 backdrop-blur-md bg-background/80 border-b border-border/50 px-6 py-4 transition-all duration-300">
            <div className="container mx-auto flex items-center justify-between max-w-7xl">
                <Link href="/" className="font-serif text-2xl lg:text-3xl font-bold tracking-tight text-primary flex items-center gap-2">
                    <span className="p-1.5 bg-primary/10 rounded-lg text-primary text-xl">✧</span>
                    Parfumerie <span className="text-gold">AI</span>
                </Link>

                <nav className="hidden md:flex items-center gap-8 font-medium text-sm text-foreground/80">
                    <Link href="/" className="hover:text-primary transition">Beranda</Link>
                    <a href="#koleksi" className="hover:text-primary transition">Koleksi</a>
                    <a href="#asisten-ai" className="hover:text-primary transition">Asisten AI</a>
                    <a href="#tentang" className="hover:text-primary transition">Tentang Kami</a>
                </nav>

                <div className="flex items-center gap-4">
                    {auth?.user ? (
                        <Link
                            href={route('dashboard')}
                            className="px-5 py-2.5 rounded-full bg-primary text-primary-foreground font-medium text-sm shadow-md shadow-primary/20 hover:opacity-90 transition transform hover:-translate-y-0.5"
                        >
                            Dashboard
                        </Link>
                    ) : (
                        <>
                            <Link href={route('login')} className="text-sm font-medium hover:text-primary px-4 py-2 transition">
                                Masuk
                            </Link>
                            <Link href={route('register')} className="px-5 py-2.5 rounded-full bg-primary text-primary-foreground font-medium text-sm shadow-md shadow-primary/20 hover:bg-primary/90 transition transform hover:-translate-y-0.5">
                                Daftar
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}
