<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ChatbotLog;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

class ChatbotLogController extends Controller
{
    /**
     * Tampilkan halaman log chatbot dengan filter & statistik.
     */
    public function index(Request $request): InertiaResponse
    {
        $logs = $this->getFilteredLogs($request);
        $stats = $this->buildStats();

        return Inertia::render('Admin/Chatbot/Index', [
            'logs'        => $logs,
            'stats'       => $stats,
            'topKeywords' => $this->buildTopKeywords(),
            'filters'     => [
                'search' => $request->search ?? '',
                'source' => $request->source ?? '',
            ],
        ]);
    }

    /**
     * Hapus satu log berdasarkan ID.
     */
    public function destroy(int $id): RedirectResponse
    {
        ChatbotLog::destroy($id);
        return back()->with('success', 'Log konsultasi berhasil dihapus.');
    }

    /**
     * Hapus seluruh riwayat log.
     */
    public function clear(): RedirectResponse
    {
        ChatbotLog::truncate();
        return back()->with('success', 'Semua riwayat konsultasi chatbot berhasil dibersihkan.');
    }

    /**
     * Export pesan pengguna sebagai file NLU YAML untuk retrain Rasa.
     */
    public function exportNlu(): Response
    {
        $messages = ChatbotLog::select('message')->distinct()->get();

        $yaml  = "# ==========================================\n";
        $yaml .= "# PARFUMERIE AI - AUTO-GENERATED NLU DATASET\n";
        $yaml .= "# Diekspor pada: " . now()->format('Y-m-d H:i:s') . "\n";
        $yaml .= "# ==========================================\n\n";
        $yaml .= "version: \"3.1\"\n\nnlu:\n  - intent: konsultasi_parfum_user_history\n    examples: |\n";

        foreach ($messages as $log) {
            $clean = trim(str_replace(["\r", "\n", '"', '#'], ' ', $log->message));
            if (!empty($clean)) {
                $yaml .= "      - {$clean}\n";
            }
        }

        return response($yaml, 200, [
            'Content-Type'        => 'text/yaml',
            'Content-Disposition' => 'attachment; filename="nlu_user_history_' . date('Ymd_His') . '.yml"',
        ]);
    }

    // ── Private helpers ──────────────────────────────────────

    private function getFilteredLogs(Request $request): array
    {
        $query = ChatbotLog::query();

        if ($search = $request->search) {
            $query->where(fn($q) => $q
                ->where('user_name', 'like', "%{$search}%")
                ->orWhere('message', 'like', "%{$search}%")
                ->orWhere('reply', 'like', "%{$search}%")
            );
        }

        if ($source = $request->source) {
            $query->where('source', $source);
        }

        return $query->latest()
            ->get()
            ->map(fn($log) => [
                'id'         => $log->id,
                'name'       => $log->user_name,
                'message'    => $log->message,
                'reply'      => $log->reply,
                'source'     => $log->source,
                'time'       => $log->created_at->format('H:i'),
                'date'       => $log->created_at->format('d M Y'),
                'created_at' => $log->created_at->toIso8601String(),
            ])
            ->toArray();
    }

    private function buildStats(): array
    {
        $total          = ChatbotLog::count();
        $rasaCount      = ChatbotLog::where('source', 'rasa')->count();
        $fallbackCount  = ChatbotLog::where('source', 'db_fallback')->count();
        $resolutionRate = $total > 0 ? round(($rasaCount / $total) * 100, 1) : 100;

        return [
            'totalLogs'      => $total,
            'rasaCount'      => $rasaCount,
            'fallbackCount'  => $fallbackCount,
            'resolutionRate' => $resolutionRate,
        ];
    }

    private function buildTopKeywords(): array
    {
        $keywords = [
            'tahan lama', 'kopi', 'manis', 'vanilla', 'pria', 'wanita',
            'baccarat', 'segar', 'formal', 'kencan', 'lembut', 'buah',
        ];

        $topKeywords = [];
        foreach ($keywords as $kw) {
            $count = ChatbotLog::where('message', 'like', "%{$kw}%")->count();
            if ($count > 0) {
                $topKeywords[$kw] = $count;
            }
        }

        arsort($topKeywords);
        return array_slice($topKeywords, 0, 6, true);
    }
}
