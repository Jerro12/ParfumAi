import { Link } from '@inertiajs/react';

export function SiteFooter() {
    return (
        <footer id="tentang" className="bg-card border-t border-border py-12 px-6 mt-24 text-sm text-muted-foreground">
            <div className="container mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-2 font-serif text-xl font-bold text-foreground">
                    <span className="text-primary">✧</span> Parfumerie <span className="text-gold">AI</span>
                </div>
                <p>© {new Date().getFullYear()} Parfumerie AI Inc. Wewangian eksklusif dengan kecerdasan buatan.</p>
                <div className="flex gap-6 font-medium">
                    <Link href="/" className="hover:text-foreground transition">Kebijakan Privasi</Link>
                    <Link href="/" className="hover:text-foreground transition">Syarat & Ketentuan</Link>
                </div>
            </div>
        </footer>
    );
}
