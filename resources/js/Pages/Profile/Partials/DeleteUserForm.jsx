import DangerButton from '@/Components/DangerButton';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import { useForm } from '@inertiajs/react';
import { useRef, useState } from 'react';
import { Trash2, AlertTriangle } from 'lucide-react';

export default function DeleteUserForm({ className = '' }) {
    const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
    const passwordInput = useRef();

    const {
        data,
        setData,
        delete: destroy,
        processing,
        reset,
        errors,
        clearErrors,
    } = useForm({
        password: '',
    });

    const confirmUserDeletion = () => {
        setConfirmingUserDeletion(true);
    };

    const deleteUser = (e) => {
        e.preventDefault();

        destroy(route('profile.destroy'), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => passwordInput.current.focus(),
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        setConfirmingUserDeletion(false);

        clearErrors();
        reset();
    };

    return (
        <section className={`space-y-6 ${className}`}>
            <header className="border-b border-border/80 pb-5">
                <div className="flex items-center gap-2 text-destructive mb-1">
                    <Trash2 size={20} />
                    <span className="text-xs font-bold uppercase tracking-widest">Zona Berbahaya</span>
                </div>
                <h2 className="font-serif text-2xl font-bold text-foreground">
                    Hapus Akun Permanen
                </h2>
                <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                    Setelah akun Anda dihapus, semua sumber daya, riwayat pemesanan, dan resep formulasi AI akan dihapus secara permanen. Harap unduh data atau informasi yang ingin Anda simpan sebelum melanjutkan.
                </p>
            </header>

            <DangerButton onClick={confirmUserDeletion}>
                Hapus Akun Saya Permanen
            </DangerButton>

            <Modal show={confirmingUserDeletion} onClose={closeModal}>
                <form onSubmit={deleteUser} className="p-8 space-y-6">
                    <div className="flex items-start gap-4">
                        <div className="p-3 bg-destructive/10 text-destructive rounded-2xl border border-destructive/20 mt-1">
                            <AlertTriangle size={28} />
                        </div>
                        <div>
                            <h2 className="font-serif text-2xl font-bold text-foreground leading-tight">
                                Apakah Anda yakin ingin menghapus akun ini?
                            </h2>
                            <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                                Setelah akun Anda dihapus, semua data olfaktori dan transaksi akan terhapus selamanya dan tidak dapat dipulihkan. Masukan kata sandi Anda untuk mengonfirmasi penghapusan.
                            </p>
                        </div>
                    </div>

                    <div className="mt-6">
                        <InputLabel
                            htmlFor="password"
                            value="Kata Sandi untuk Konfirmasi"
                        />

                        <div className="relative">
                            <TextInput
                                id="password"
                                type="password"
                                name="password"
                                ref={passwordInput}
                                value={data.password}
                                onChange={(e) =>
                                    setData('password', e.target.value)
                                }
                                className="mt-1 block w-full"
                                isFocused
                                placeholder="Masukkan kata sandi Anda"
                            />
                        </div>

                        <InputError
                            message={errors.password}
                            className="mt-2"
                        />
                    </div>

                    <div className="mt-8 pt-4 border-t border-border/80 flex items-center justify-end gap-3">
                        <SecondaryButton onClick={closeModal}>
                            Batal
                        </SecondaryButton>

                        <DangerButton disabled={processing}>
                            Ya, Hapus Permanen
                        </DangerButton>
                    </div>
                </form>
            </Modal>
        </section>
    );
}
