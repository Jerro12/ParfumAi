import { Head, Link, useForm } from '@inertiajs/react';
import { loginBg } from '@/assets/login-bg';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <div className="min-h-screen relative flex items-center justify-center px-4 py-12 font-sans text-foreground antialiased selection:bg-primary selection:text-white">
            <Head title="Daftar Akun — Parfumerie AI" />

            <img src={loginBg} alt="Parfumerie AI Background" className="absolute inset-0 size-full object-cover" />
            <div className="absolute inset-0 bg-background/50 backdrop-blur-md" />

            <div className="relative w-full max-w-md bg-card/90 backdrop-blur-xl rounded-3xl border border-border/80 shadow-2xl p-8 sm:p-10 space-y-6">
                <div className="text-center space-y-1">
                    <div className="inline-flex items-center justify-center size-12 rounded-full bg-gold/10 text-primary mb-2 font-serif text-2xl font-bold border border-gold/20">
                        ✨
                    </div>
                    <h1 className="font-serif text-3xl font-extrabold tracking-tight">Daftar Parfumerie AI</h1>
                    <p className="text-xs text-muted-foreground">Bergabunglah dan temukan rekomendasi aroma khas Anda.</p>
                </div>

                <form onSubmit={submit} className="space-y-4">
                    <div>
                        <label htmlFor="name" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Nama Lengkap</label>
                        <input
                            id="name"
                            type="text"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            placeholder="Dewi Lestari"
                            autoComplete="name"
                            autoFocus
                            required
                            className="mt-1.5 w-full bg-input/60 text-foreground border border-border/80 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition shadow-sm"
                        />
                        {errors.name && <p className="text-xs text-destructive font-medium mt-1">{errors.name}</p>}
                    </div>

                    <div>
                        <label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Alamat Email</label>
                        <input
                            id="email"
                            type="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            placeholder="email@contoh.com"
                            autoComplete="username"
                            required
                            className="mt-1.5 w-full bg-input/60 text-foreground border border-border/80 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition shadow-sm"
                        />
                        {errors.email && <p className="text-xs text-destructive font-medium mt-1">{errors.email}</p>}
                    </div>

                    <div>
                        <label htmlFor="password" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Kata Sandi</label>
                        <input
                            id="password"
                            type="password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            placeholder="••••••••"
                            autoComplete="new-password"
                            required
                            className="mt-1.5 w-full bg-input/60 text-foreground border border-border/80 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition shadow-sm"
                        />
                        {errors.password && <p className="text-xs text-destructive font-medium mt-1">{errors.password}</p>}
                    </div>

                    <div>
                        <label htmlFor="password_confirmation" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Konfirmasi Kata Sandi</label>
                        <input
                            id="password_confirmation"
                            type="password"
                            value={data.password_confirmation}
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            placeholder="••••••••"
                            autoComplete="new-password"
                            required
                            className="mt-1.5 w-full bg-input/60 text-foreground border border-border/80 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition shadow-sm"
                        />
                        {errors.password_confirmation && <p className="text-xs text-destructive font-medium mt-1">{errors.password_confirmation}</p>}
                    </div>

                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full bg-primary text-primary-foreground py-3.5 rounded-full font-semibold text-sm hover:opacity-90 transition transform active:scale-[0.99] shadow-lg shadow-primary/25 pt-3 mt-4"
                    >
                        {processing ? 'Mendaftarkan Akun...' : 'Daftar Sekarang'}
                    </button>
                </form>

                <div className="text-center pt-2 border-t border-border/60 space-y-3">
                    <p className="text-xs text-muted-foreground">
                        Sudah punya akun?{' '}
                        <Link href={route('login')} className="text-primary font-bold hover:underline">
                            Masuk di sini
                        </Link>
                    </p>
                    <div>
                        <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition">
                            <span>←</span> Kembali ke Halaman Utama
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
