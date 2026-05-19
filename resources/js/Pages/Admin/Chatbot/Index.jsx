import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router } from '@inertiajs/react';
import { Bot, Search, MessageSquare, CheckCircle2, AlertTriangle, TrendingUp, Terminal, Send, Trash2, Filter, RefreshCw, X, Sparkles, Server, Download } from 'lucide-react';
import Modal from '@/Components/Modal';

export default function ChatbotIndex({ logs = [], stats = {}, topKeywords = {}, filters = {} }) {
  const [searchTerm, setSearchTerm] = useState(filters.search || '');
  const [sourceFilter, setSourceFilter] = useState(filters.source || '');
  const [isSandboxOpen, setIsSandboxOpen] = useState(false);
  const [sandboxInput, setSandboxInput] = useState('');
  const [sandboxMessages, setSandboxMessages] = useState([
    { sender: 'bot', text: 'Halo Administrator. Mode Sandbox AI Sommelier aktif. Uji kueri NLP dan amati respons sistem.', source: 'system', raw: null }
  ]);
  const [isSandboxLoading, setIsSandboxLoading] = useState(false);

  // Handle Search and Filter
  const handleSearch = (e) => {
    e.preventDefault();
    router.get(route('admin.chatbot'), { search: searchTerm, source: sourceFilter }, { preserveState: true });
  };

  const handleSourceChange = (val) => {
    setSourceFilter(val);
    router.get(route('admin.chatbot'), { search: searchTerm, source: val }, { preserveState: true });
  };

  const resetFilters = () => {
    setSearchTerm('');
    setSourceFilter('');
    router.get(route('admin.chatbot'), {}, { preserveState: true });
  };

  // Handle Sandbox Testing
  const handleTestPrompt = async (e) => {
    e.preventDefault();
    if (!sandboxInput.trim()) return;

    const userMsg = sandboxInput;
    setSandboxInput('');
    setSandboxMessages((prev) => [...prev, { sender: 'user', text: userMsg }]);
    setIsSandboxLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg })
      });
      const data = await res.json();
      setSandboxMessages((prev) => [
        ...prev,
        { 
          sender: 'bot', 
          text: data.reply || 'Tidak ada respons.', 
          source: data.source || 'db_fallback', 
          raw: JSON.stringify(data, null, 2)
        }
      ]);
      // Refresh logs list in background
      router.reload({ only: ['logs', 'stats', 'topKeywords'], preserveScroll: true });
    } catch (err) {
      setSandboxMessages((prev) => [
        ...prev,
        { sender: 'bot', text: 'Gagal menghubungi backend AI.', source: 'error', raw: err.message }
      ]);
    } finally {
      setIsSandboxLoading(false);
    }
  };

  const handleDeleteLog = (id) => {
    if (confirm('Apakah Anda yakin ingin menghapus log percakapan ini?')) {
      router.delete(route('admin.chatbot.destroy', id), { preserveScroll: true });
    }
  };

  const handleClearAllLogs = () => {
    if (confirm('PERINGATAN: Apakah Anda yakin ingin menghapus SELURUH riwayat konsultasi chatbot?')) {
      router.delete(route('admin.chatbot.clear'), { preserveScroll: true });
    }
  };

  return (
    <AdminLayout title="Kelola Sommelier AI">
      {/* Header & Sandbox Trigger */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 font-sans">
        <div>
          <h1 className="font-serif text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
            <Bot className="text-primary size-9" />
            <span>Manajemen & Audit Sommelier AI</span>
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Pantau riwayat konsultasi pengguna, analitik topik parfum terbanyak, status engine NLP Rasa REST, serta uji respons AI secara real-time.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <a
            href={route('admin.chatbot.export')}
            className="flex items-center gap-2 bg-secondary text-secondary-foreground border border-border font-bold px-4 py-3 rounded-2xl hover:bg-gold hover:text-forest transition shadow-sm text-sm"
            title="Ekspor Riwayat Percakapan Menjadi Dataset Latih Rasa NLU (YAML)"
          >
            <Download size={18} />
            <span className="hidden sm:inline">Ekspor NLU (YAML)</span>
          </a>

          <button
            onClick={() => setIsSandboxOpen(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-primary to-amber-600 text-primary-foreground font-bold px-5 py-3 rounded-2xl hover:opacity-90 transition shadow-lg text-sm"
          >
            <Terminal size={18} />
            <span>AI Sandbox Tester</span>
          </button>
          
          <button
            onClick={handleClearAllLogs}
            disabled={logs.length === 0}
            className="flex items-center gap-2 bg-destructive/10 text-destructive border border-destructive/20 font-bold px-4 py-3 rounded-2xl hover:bg-destructive hover:text-destructive-foreground transition shadow-sm text-sm disabled:opacity-50"
            title="Bersihkan Semua Log"
          >
            <Trash2 size={18} />
            <span className="hidden sm:inline">Bersihkan Log</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 font-sans">
        <div className="bg-card border border-border p-6 rounded-3xl shadow-sm relative overflow-hidden group">
          <div className="absolute -right-6 -bottom-6 size-24 bg-primary/5 rounded-full pointer-events-none group-hover:scale-125 transition duration-300" />
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Total Konsultasi</span>
            <div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <MessageSquare size={18} />
            </div>
          </div>
          <div className="font-serif text-3xl font-bold text-foreground mt-3">{stats.totalLogs || 0}</div>
          <p className="text-xs text-muted-foreground mt-1 font-sans">Percakapan terekam di database</p>
        </div>

        <div className="bg-card border border-border p-6 rounded-3xl shadow-sm relative overflow-hidden group">
          <div className="absolute -right-6 -bottom-6 size-24 bg-emerald-500/5 rounded-full pointer-events-none group-hover:scale-125 transition duration-300" />
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Rasa REST NLP</span>
            <div className="size-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
              <Server size={18} />
            </div>
          </div>
          <div className="font-serif text-3xl font-bold text-emerald-600 mt-3">{stats.rasaCount || 0}</div>
          <div className="flex items-center gap-1.5 mt-1 text-xs text-emerald-600 font-bold">
            <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Engine NLP Aktif</span>
          </div>
        </div>

        <div className="bg-card border border-border p-6 rounded-3xl shadow-sm relative overflow-hidden group">
          <div className="absolute -right-6 -bottom-6 size-24 bg-amber-500/5 rounded-full pointer-events-none group-hover:scale-125 transition duration-300" />
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Database Fallback</span>
            <div className="size-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
              <AlertTriangle size={18} />
            </div>
          </div>
          <div className="font-serif text-3xl font-bold text-amber-600 mt-3">{stats.fallbackCount || 0}</div>
          <p className="text-xs text-muted-foreground mt-1 font-sans">Kueri dengan pencocokan kata kunci</p>
        </div>

        <div className="bg-card border border-border p-6 rounded-3xl shadow-sm relative overflow-hidden group">
          <div className="absolute -right-6 -bottom-6 size-24 bg-primary/5 rounded-full pointer-events-none group-hover:scale-125 transition duration-300" />
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Resolusi NLP</span>
            <div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <TrendingUp size={18} />
            </div>
          </div>
          <div className="font-serif text-3xl font-bold text-foreground mt-3">{stats.resolutionRate || 100}%</div>
          <p className="text-xs text-muted-foreground mt-1 font-sans">Akurasi model klasifikasi niat (intent)</p>
        </div>
      </div>

      {/* Top Topics Analytics */}
      <div className="bg-card border border-border p-6 rounded-3xl shadow-sm font-sans">
        <h2 className="font-serif text-lg font-bold mb-3 flex items-center gap-2">
          <Sparkles className="text-gold" size={20} />
          <span>Topik & Kata Kunci Parfum Paling Banyak Ditanyakan</span>
        </h2>
        <div className="flex flex-wrap gap-2.5 items-center">
          {Object.keys(topKeywords).length === 0 ? (
            <p className="text-xs text-muted-foreground">Belum ada cukup data untuk dianalisis.</p>
          ) : (
            Object.entries(topKeywords).map(([key, val]) => (
              <div
                key={key}
                onClick={() => { setSearchTerm(key); router.get(route('admin.chatbot'), { search: key, source: sourceFilter }, { preserveState: true }); }}
                className="bg-secondary/60 hover:bg-primary/20 hover:text-primary transition duration-200 cursor-pointer border border-border px-4 py-2 rounded-2xl flex items-center gap-2 text-xs font-bold"
              >
                <span className="uppercase font-mono">{key}</span>
                <span className="size-5 rounded-full bg-primary/10 text-primary font-mono text-[10px] flex items-center justify-center">
                  {val}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className="bg-card border border-border p-6 rounded-3xl shadow-sm font-sans space-y-4">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <input
              type="text"
              placeholder="Cari berdasarkan nama pelanggan, pertanyaan kueri, atau kutipan jawaban bot..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-input text-foreground border border-border pl-11 pr-4 py-3 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 shadow-sm font-medium"
            />
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <select
              value={sourceFilter}
              onChange={(e) => handleSourceChange(e.target.value)}
              className="bg-input text-foreground border border-border px-4 py-3 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 shadow-sm font-medium flex-1 sm:w-48"
            >
              <option value="">Semua Sumber (Engine)</option>
              <option value="rasa">Rasa REST API</option>
              <option value="db_fallback">Database Fallback</option>
            </select>

            <button
              type="submit"
              className="bg-primary text-primary-foreground font-bold px-6 py-3 rounded-2xl hover:opacity-90 transition shadow-sm text-sm whitespace-nowrap"
            >
              Cari
            </button>

            {(searchTerm || sourceFilter) && (
              <button
                type="button"
                onClick={resetFilters}
                className="bg-secondary text-secondary-foreground font-bold px-4 py-3 rounded-2xl hover:bg-secondary/80 transition text-xs flex items-center gap-1.5 whitespace-nowrap"
              >
                <RefreshCw size={14} />
                <span>Reset</span>
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Logs Table / Audit Feed */}
      <div className="bg-card border border-border p-8 rounded-3xl shadow-xl font-sans">
        <div className="flex items-center justify-between border-b border-border/80 pb-6 mb-6">
          <div>
            <h2 className="font-serif text-2xl font-bold">Riwayat & Log Percakapan</h2>
            <p className="text-xs text-muted-foreground mt-1">Catatan mentah interaksi sommelier AI dengan tamu dan pelanggan.</p>
          </div>
          <span className="text-xs font-bold text-primary bg-primary/10 px-3.5 py-1 rounded-full uppercase tracking-widest font-mono">
            {logs.length} Data Ditampilkan
          </span>
        </div>

        {logs.length === 0 ? (
          <div className="text-center py-16">
            <Bot className="mx-auto text-muted-foreground/40 mb-4" size={56} />
            <h3 className="font-serif text-xl font-bold">Tidak Ditemukan Riwayat Percakapan</h3>
            <p className="text-sm text-muted-foreground mt-1">Belum ada konsultasi yang tercatat atau kueri pencarian tidak cocok.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {logs.map((log) => (
              <div key={log.id} className="border border-border/70 rounded-2xl p-6 bg-background/50 hover:border-primary/40 transition duration-300 relative group font-sans">
                <button
                  onClick={() => handleDeleteLog(log.id)}
                  className="absolute right-4 top-4 text-muted-foreground hover:text-destructive transition opacity-0 group-hover:opacity-100 p-2 rounded-lg hover:bg-destructive/10"
                  title="Hapus log"
                >
                  <Trash2 size={16} />
                </button>

                <div className="flex items-center justify-between mb-3 pr-8">
                  <div className="flex items-center gap-3">
                    <div className="size-9 rounded-xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center font-serif font-bold text-sm">
                      {log.name.charAt(0)}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-foreground">{log.name}</div>
                      <div className="text-[11px] text-muted-foreground font-semibold">{log.date}, {log.time}</div>
                    </div>
                  </div>

                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                    log.source === 'rasa' ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/30' : 'bg-amber-500/10 text-amber-600 border border-amber-500/30'
                  }`}>
                    {log.source === 'rasa' ? <CheckCircle2 size={12} /> : <AlertTriangle size={12} />}
                    <span>{log.source === 'rasa' ? 'RASA REST' : 'FALLBACK DB'}</span>
                  </span>
                </div>

                <div className="space-y-3 pl-12 pr-4 font-sans">
                  <div className="bg-card border border-border p-4 rounded-2xl rounded-tl-none">
                    <div className="text-[10px] font-bold text-primary uppercase tracking-wider mb-1">Pertanyaan / Kueri Pengguna:</div>
                    <p className="text-sm font-semibold text-foreground">{log.message}</p>
                  </div>

                  <div className="bg-secondary/60 border border-border p-4 rounded-2xl rounded-tl-none">
                    <div className="text-[10px] font-bold text-gold uppercase tracking-wider mb-1">Respons AI Sommelier:</div>
                    <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-line">{log.reply}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Interactive Sandbox Modal */}
      <Modal show={isSandboxOpen} onClose={() => setIsSandboxOpen(false)} maxWidth="3xl">
        <div className="p-8 font-sans flex flex-col h-[650px]">
          <div className="flex items-center justify-between border-b border-border pb-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-2xl bg-gradient-to-tr from-primary to-amber-500 flex items-center justify-center text-primary-foreground shadow-md">
                <Terminal size={20} />
              </div>
              <div>
                <h2 className="font-serif text-xl font-bold">AI Sommelier Sandbox (Uji Prompt)</h2>
                <p className="text-xs text-muted-foreground">Simulasi interaksi untuk mengevaluasi respons mesin NLP secara langsung.</p>
              </div>
            </div>
            <button onClick={() => setIsSandboxOpen(false)} className="p-2 rounded-xl hover:bg-secondary text-muted-foreground">
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-4 mb-6 pr-2">
            {sandboxMessages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-3xl p-4 font-sans ${
                  msg.sender === 'user'
                    ? 'bg-primary text-primary-foreground rounded-tr-none shadow-md'
                    : msg.source === 'system'
                    ? 'bg-secondary text-secondary-foreground border border-border/80'
                    : 'bg-card border border-border rounded-tl-none shadow-sm'
                }`}>
                  <div className="text-[10px] font-bold uppercase tracking-wider opacity-80 mb-1">
                    {msg.sender === 'user' ? 'Anda (Admin)' : msg.source === 'system' ? 'Sistem' : `AI Bot (${msg.source})`}
                  </div>
                  <p className="text-xs leading-relaxed whitespace-pre-line">{msg.text}</p>
                  
                  {msg.raw && (
                    <details className="mt-2 border-t border-border/80 pt-2 text-[10px] font-mono text-muted-foreground cursor-pointer">
                      <summary className="outline-none hover:text-foreground">Lihat Raw JSON Response</summary>
                      <pre className="bg-background/80 p-2 rounded-xl mt-1 overflow-x-auto max-h-40">{msg.raw}</pre>
                    </details>
                  )}
                </div>
              </div>
            ))}
            {isSandboxLoading && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground animate-pulse pl-4">
                <Bot size={16} className="text-primary" />
                <span>AI Sommelier sedang merumuskan formulasi parfum...</span>
              </div>
            )}
          </div>

          <form onSubmit={handleTestPrompt} className="flex gap-3 items-center mt-auto border-t border-border pt-4">
            <input
              type="text"
              placeholder="Ketik kueri pengujian (misal: 'parfum floral manis untuk pesta')..."
              value={sandboxInput}
              onChange={(e) => setSandboxInput(e.target.value)}
              disabled={isSandboxLoading}
              className="flex-1 bg-input text-foreground border border-border px-5 py-3.5 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary shadow-sm font-medium disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={isSandboxLoading || !sandboxInput.trim()}
              className="bg-primary text-primary-foreground px-6 py-3.5 rounded-2xl font-bold flex items-center gap-2 hover:opacity-90 transition shadow-md text-sm disabled:opacity-50"
            >
              <span>Uji Kueri</span>
              <Send size={16} />
            </button>
          </form>
        </div>
      </Modal>
    </AdminLayout>
  );
}
