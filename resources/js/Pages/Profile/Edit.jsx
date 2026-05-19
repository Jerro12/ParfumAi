import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import { Sparkles, Shield, UserCheck } from 'lucide-react';

export default function Edit({ mustVerifyEmail, status }) {
    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-primary/10 text-primary border border-primary/20 rounded-2xl shadow-inner">
                        <Sparkles size={24} />
                    </div>
                    <div>
                        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground tracking-tight leading-tight">
                            Pengaturan Akun & Keamanan
                        </h2>
                        <p className="text-xs text-muted-foreground mt-0.5">Kelola informasi identitas, kata sandi, dan preferensi privasi Anda.</p>
                    </div>
                </div>
            }
        >
            <Head title="Pengaturan Akun - Parfumerie AI" />

            <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-8 font-sans">
                {/* Profile Information Card */}
                <div className="bg-card border border-border rounded-3xl p-6 sm:p-10 shadow-xl relative overflow-hidden transition-all hover:shadow-2xl">
                    <div className="absolute top-0 right-0 w-80 h-80 bg-primary/5 rounded-bl-full pointer-events-none blur-3xl" />
                    <UpdateProfileInformationForm
                        mustVerifyEmail={mustVerifyEmail}
                        status={status}
                        className="max-w-xl relative z-10"
                    />
                </div>

                {/* Password Update Card */}
                <div className="bg-card border border-border rounded-3xl p-6 sm:p-10 shadow-xl relative overflow-hidden transition-all hover:shadow-2xl">
                    <div className="absolute top-0 right-0 w-80 h-80 bg-gold/5 rounded-bl-full pointer-events-none blur-3xl" />
                    <UpdatePasswordForm className="max-w-xl relative z-10" />
                </div>

                {/* Delete Account Card */}
                <div className="bg-card border border-destructive/20 rounded-3xl p-6 sm:p-10 shadow-xl relative overflow-hidden transition-all hover:shadow-2xl hover:border-destructive/40">
                    <div className="absolute top-0 right-0 w-80 h-80 bg-destructive/5 rounded-bl-full pointer-events-none blur-3xl" />
                    <DeleteUserForm className="max-w-xl relative z-10" />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
