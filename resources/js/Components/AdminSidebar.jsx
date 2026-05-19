import { Link, usePage } from "@inertiajs/react";
import { LayoutDashboard, Package, MessageSquare, ShoppingBag, Settings, LogOut, ChevronLeft, ChevronDown, SlidersHorizontal } from "lucide-react";
import { useState, useEffect } from "react";

export function AdminSidebar({ collapsed, onToggle }) {
  const { url } = usePage();
  
  // State dropdown untuk menu Kelola Produk
  const isProductSectionActive = url === '/admin/produk' || url.startsWith('/admin/produk/') || url === '/admin/ukuran-botol' || url.startsWith('/admin/ukuran-botol/');
  const [productMenuOpen, setProductMenuOpen] = useState(isProductSectionActive);

  useEffect(() => {
    if (isProductSectionActive) {
      setProductMenuOpen(true);
    }
  }, [url, isProductSectionActive]);

  const isActive = (itemUrl, exact) =>
    exact ? url === itemUrl : url === itemUrl || url.startsWith(itemUrl + "/");

  return (
    <aside
      className={`${collapsed ? "w-20" : "w-64"} bg-forest text-forest-foreground flex flex-col sticky top-0 h-screen transition-[width] duration-300 shrink-0 z-50 border-r border-gold/20 shadow-2xl`}
    >
      {/* Logo */}
      <div className="text-center py-6 border-b border-white/10 relative">
        <Link href="/" className="inline-block">
          <div className="size-12 mx-auto rounded-full border border-gold flex items-center justify-center font-serif text-gold text-xl hover:scale-105 transition shadow-lg bg-forest font-bold">
            P
          </div>
        </Link>
        {!collapsed && (
          <div className="mt-2 font-serif tracking-widest text-xs font-bold text-gold uppercase">
            PARFUMERIE AI
          </div>
        )}
        <button
          onClick={onToggle}
          aria-label="Toggle sidebar"
          className="absolute -right-3 top-8 size-6 rounded-full bg-gold text-forest flex items-center justify-center shadow-md hover:scale-110 transition cursor-pointer"
        >
          <ChevronLeft size={14} className={`transition-transform ${collapsed ? "rotate-180" : ""}`} />
        </button>
      </div>

      {/* Nav */}
      <nav className="mt-6 space-y-1.5 px-3 flex-1 overflow-y-auto font-sans">
        {/* Dasbor */}
        <Link
          href="/admin/dashboard"
          title={collapsed ? "Dasbor" : undefined}
          className={`flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-medium transition ${
            isActive("/admin/dashboard", true) ? "bg-gold text-forest font-bold shadow-md" : "text-white/80 hover:bg-white/10 hover:text-white"
          } ${collapsed ? "justify-center" : ""}`}
        >
          <LayoutDashboard size={18} className="shrink-0" />
          {!collapsed && <span className="truncate font-sans">Dasbor</span>}
        </Link>

        {/* Dropdown Kelola Produk */}
        <div>
          <button
            onClick={() => {
              if (collapsed) onToggle();
              setProductMenuOpen(!productMenuOpen);
            }}
            title={collapsed ? "Kelola Produk" : undefined}
            className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-medium transition ${
              isProductSectionActive && !productMenuOpen ? "bg-gold/20 text-gold font-bold border border-gold/30" : "text-white/80 hover:bg-white/10 hover:text-white"
            } ${collapsed ? "justify-center" : ""}`}
          >
            <div className="flex items-center gap-3">
              <Package size={18} className="shrink-0" />
              {!collapsed && <span className="truncate font-sans">Kelola Produk</span>}
            </div>
            {!collapsed && (
              <ChevronDown size={16} className={`transition-transform duration-300 ${productMenuOpen ? "rotate-180 text-gold" : ""}`} />
            )}
          </button>

          {/* Submenu Dropdown */}
          {(!collapsed && productMenuOpen) && (
            <div className="mt-1.5 ml-4 pl-3 border-l-2 border-gold/30 space-y-1 animate-fade-in">
              <Link
                href="/admin/produk"
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-medium transition ${
                  isActive("/admin/produk", true) ? "bg-gold text-forest font-bold shadow-sm" : "text-white/70 hover:text-white hover:bg-white/5"
                }`}
              >
                <Package size={14} className="shrink-0" />
                <span>Katalog Parfum</span>
              </Link>
              
              <Link
                href="/admin/ukuran-botol"
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-medium transition ${
                  isActive("/admin/ukuran-botol", true) ? "bg-gold text-forest font-bold shadow-sm" : "text-white/70 hover:text-white hover:bg-white/5"
                }`}
              >
                <SlidersHorizontal size={14} className="shrink-0" />
                <span>Ukuran & Harga Botol</span>
              </Link>
            </div>
          )}
        </div>

        {/* Kelola Chatbot */}
        <Link
          href="/admin/chatbot"
          title={collapsed ? "Kelola Chatbot" : undefined}
          className={`flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-medium transition ${
            isActive("/admin/chatbot", true) ? "bg-gold text-forest font-bold shadow-md" : "text-white/80 hover:bg-white/10 hover:text-white"
          } ${collapsed ? "justify-center" : ""}`}
        >
          <MessageSquare size={18} className="shrink-0" />
          {!collapsed && <span className="truncate font-sans">Kelola Chatbot</span>}
        </Link>

        {/* Kelola Pembelian */}
        <Link
          href="/admin/pembelian"
          title={collapsed ? "Kelola Pembelian" : undefined}
          className={`flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-medium transition ${
            isActive("/admin/pembelian", true) ? "bg-gold text-forest font-bold shadow-md" : "text-white/80 hover:bg-white/10 hover:text-white"
          } ${collapsed ? "justify-center" : ""}`}
        >
          <ShoppingBag size={18} className="shrink-0" />
          {!collapsed && <span className="truncate font-sans">Kelola Pembelian</span>}
        </Link>

        {/* Pengaturan */}
        <Link
          href="/admin/pengaturan"
          title={collapsed ? "Pengaturan" : undefined}
          className={`flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-medium transition ${
            isActive("/admin/pengaturan", true) ? "bg-gold text-forest font-bold shadow-md" : "text-white/80 hover:bg-white/10 hover:text-white"
          } ${collapsed ? "justify-center" : ""}`}
        >
          <Settings size={18} className="shrink-0" />
          {!collapsed && <span className="truncate font-sans">Pengaturan</span>}
        </Link>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-white/10 font-sans">
        <Link
          href={route('logout')}
          method="post"
          as="button"
          title={collapsed ? "Keluar" : undefined}
          className={`flex items-center w-full gap-3 text-sm px-3.5 py-3 hover:bg-destructive/80 rounded-xl text-white/90 hover:text-white transition ${collapsed ? "justify-center" : ""}`}
        >
          <LogOut size={18} className="shrink-0" />
          {!collapsed && <span className="font-medium font-sans">Keluar</span>}
        </Link>
      </div>
    </aside>
  );
}

export function useSidebarState() {
  const [collapsed, setCollapsed] = useState(false);
  return { collapsed, toggle: () => setCollapsed((c) => !c) };
}
