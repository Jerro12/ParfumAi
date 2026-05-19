import { Head, Link, useForm } from '@inertiajs/react';
import Checkbox from '@/Components/Checkbox';
import { loginBg } from '@/assets/login-bg';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <div className="min-h-screen relative flex items-center justify-center px-4 font-sans text-foreground antialiased selection:bg-primary selection:text-white">
            <Head title="Masuk — Parfumerie AI" />

            <img src={loginBg} alt="Parfumerie AI Background" className="absolute inset-0 size-full object-cover" />
            <div className="absolute inset-0 bg-background/50 backdrop-blur-md" />

            <div className="relative w-full max-w-md bg-card/90 backdrop-blur-xl rounded-3xl border border-border/80 shadow-2xl p-8 sm:p-10 space-y-6">
                <div className="text-center space-y-1">
                    <div className="inline-flex items-center justify-center size-12 rounded-full bg-primary/10 text-primary mb-2 font-serif text-2xl font-bold border border-primary/20">
                        P
                    </div>
                    <h1 className="font-serif text-3xl font-extrabold tracking-tight">Masuk ke Parfumerie AI</h1>
                    <p className="text-xs text-muted-foreground">Selamat datang kembali! Lanjutkan perjalanan olfaktori Anda.</p>
                </div>

                {status && (
                    <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 rounded-xl text-xs font-medium text-center">
                        {status}
                    </div>
                )}

                <form onSubmit={submit} className="space-y-4">
                    <div>
                        <label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Email</label>
                        <input
                            id="email"
                            type="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            placeholder="email@contoh.com"
                            autoComplete="username"
                            autoFocus
                            className="mt-1.5 w-full bg-input/60 text-foreground border border-border/80 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition shadow-sm"
                        />
                        {errors.email && <p className="text-xs text-destructive font-medium mt-1">{errors.email}</p>}
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-1.5">
                            <label htmlFor="password" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Kata Sandi</label>
                            {canResetPassword && (
                                <Link
                                    href={route('password.request')}
                                    className="text-xs font-semibold text-primary hover:underline transition"
                                >
                                    Lupa sandi?
                                </Link>
                            )}
                        </div>
                        <input
                            id="password"
                            type="password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            placeholder="••••••••"
                            autoComplete="current-password"
                            className="w-full bg-input/60 text-foreground border border-border/80 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition shadow-sm"
                        />
                        {errors.password && <p className="text-xs text-destructive font-medium mt-1">{errors.password}</p>}
                    </div>

                    <div className="flex items-center pt-1">
                        <label className="flex items-center cursor-pointer group">
                            <Checkbox
                                name="remember"
                                checked={data.remember}
                                onChange={(e) => setData('remember', e.target.checked)}
                            />
                            <span className="ms-2.5 text-xs text-muted-foreground group-hover:text-foreground transition font-medium">
                                Ingat saya
                            </span>
                        </label>
                    </div>

                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full bg-primary text-primary-foreground py-3.5 rounded-full font-semibold text-sm hover:opacity-90 transition transform active:scale-[0.99] shadow-lg shadow-primary/25 pt-3 mt-2"
                    >
                        {processing ? 'Memverifikasi...' : 'Masuk Sekarang'}
                    </button>
                </form>

                <div className="text-center pt-2 border-t border-border/60 space-y-3">
                    <p className="text-xs text-muted-foreground">
                        Belum punya akun?{' '}
                        <Link href={route('register')} className="text-primary font-bold hover:underline">
                            Daftar di sini
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
