import { AdminSidebar, useSidebarState } from '@/Components/AdminSidebar';
import { Head, Link, usePage } from '@inertiajs/react';

export default function AdminLayout({ title, children }) {
  const { collapsed, toggle } = useSidebarState();
  const { auth } = usePage().props;

  return (
    <div className="min-h-screen bg-background text-foreground flex font-sans antialiased selection:bg-primary selection:text-white">
      {title && <Head title={`${title} - Admin Parfumerie AI`} />}
      
      <AdminSidebar collapsed={collapsed} onToggle={toggle} />
      
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        <header className="h-16 border-b border-border bg-card/80 backdrop-blur-md sticky top-0 z-40 px-8 flex items-center justify-between shadow-sm transition-all duration-300">
          <div className="flex items-center gap-4">
            <h2 className="font-serif text-xl font-bold tracking-tight text-foreground">{title || 'Dasbor Admin'}</h2>
            <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-[11px] font-bold uppercase tracking-wider hidden sm:inline-block">
              AI Sommelier v4.2
            </span>
          </div>
          
          <div className="flex items-center gap-6">
            <Link
              href="/"
              className="text-xs font-semibold text-primary hover:underline px-4 py-2 rounded-full bg-primary/10 border border-primary/20 hover:bg-primary hover:text-primary-foreground transition duration-300 shadow-sm"
            >
              Lihat Situs Utama ➜
            </Link>
            
            <div className="flex items-center gap-3 border-l border-border pl-6">
              <div className="w-8 h-8 rounded-full bg-gold text-forest flex items-center justify-center font-serif font-bold text-sm shadow-inner">
                {auth?.user?.name ? auth.user.name.charAt(0) : 'A'}
              </div>
              <div className="hidden md:block">
                <div className="text-xs font-bold text-foreground leading-tight">{auth?.user?.name || 'Administrator'}</div>
                <div className="text-[10px] text-muted-foreground uppercase font-semibold tracking-wider">{auth?.user?.role || 'Admin'}</div>
              </div>
            </div>
          </div>
        </header>

        <main className="p-6 sm:p-10 max-w-7xl w-full mx-auto flex-1 space-y-8">{children}</main>
      </div>
    </div>
  );
}
