import { Link, usePage } from "@inertiajs/react";
import { LayoutDashboard, Package, MessageSquare, ShoppingBag, Settings, LogOut, ChevronLeft } from "lucide-react";
import { useState } from "react";

const items = [
  { title: "Dasbor", url: "/admin/dashboard", icon: LayoutDashboard, exact: true },
  { title: "Kelola Produk", url: "/admin/produk", icon: Package },
  { title: "Kelola Chatbot", url: "/admin/chatbot", icon: MessageSquare },
  { title: "Kelola Pembelian", url: "/admin/pembelian", icon: ShoppingBag },
  { title: "Pengaturan", url: "/admin/pengaturan", icon: Settings },
];

export function AdminSidebar({
  collapsed,
  onToggle,
}) {
  const { url } = usePage();
  const isActive = (itemUrl, exact) =>
    exact ? url === itemUrl : url === itemUrl || url.startsWith(itemUrl + "/");

  return (
    <aside
      className={`${collapsed ? "w-20" : "w-64"} bg-forest text-forest-foreground flex flex-col sticky top-0 h-screen transition-[width] duration-300 shrink-0 z-50 border-r border-gold/20 shadow-2xl`}
    >
      {/* Logo */}
      <div className="text-center py-6 border-b border-white/10 relative">
        <Link href="/" className="inline-block">
          <div className="size-12 mx-auto rounded-full border border-gold flex items-center justify-center font-serif text-gold text-xl hover:scale-105 transition shadow-lg bg-forest">
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
        {items.map((item) => {
          const active = isActive(item.url, item.exact);
          return (
            <Link
              key={item.url}
              href={item.url}
              title={collapsed ? item.title : undefined}
              className={`flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-medium transition ${
                active ? "bg-gold text-forest font-bold shadow-md" : "text-white/80 hover:bg-white/10 hover:text-white"
              } ${collapsed ? "justify-center" : ""}`}
            >
              <item.icon size={18} className="shrink-0" />
              {!collapsed && <span className="truncate">{item.title}</span>}
            </Link>
          );
        })}
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
