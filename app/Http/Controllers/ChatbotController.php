<?php

namespace App\Http\Controllers;

use App\Models\ChatbotLog;
use App\Services\ChatbotService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ChatbotController extends Controller
{
    public function __construct(private readonly ChatbotService $chatbotService) {}

    /**
     * Terima pesan dari widget chat dan kembalikan balasan.
     * Layer 1: Keyword Guard (PHP, zero-latency)
     * Layer 2: Rasa NLU
     */
    public function chat(Request $request): JsonResponse
    {
        $message = trim($request->input('message', ''));

        if (empty($message)) {
            return response()->json(['reply' => 'Mohon tulis pesan atau pertanyaan Anda.']);
        }

        // ── Layer 1: PHP Keyword Guard ──
        if (!$this->chatbotService->isPerfumeRelated($message)) {
            $reply = $this->chatbotService->getRandomRejection();
            $this->logChat($message, $reply, 'keyword_guard');
            return response()->json(['reply' => $reply, 'source' => 'keyword_guard']);
        }

        // ── Layer 2: Rasa NLU ──
        try {
            $senderId = session()->getId() ?? 'user_guest';
            $reply    = $this->chatbotService->sendToRasa($message, $senderId);

            if ($reply) {
                $this->logChat($message, $reply, 'rasa');
                return response()->json(['reply' => $reply, 'source' => 'rasa']);
            }

            throw new \Exception('Response Rasa kosong atau tidak valid.');
        } catch (\Exception) {
            return response()->json([
                'reply'  => '⚠️ Gagal terhubung ke asisten virtual (Scent Sommelier). Mohon periksa apakah server Rasa Anda telah diaktifkan.',
                'source' => 'offline',
            ]);
        }
    }

    /**
     * Simpan log percakapan ke database.
     */
    private function logChat(string $message, string $reply, string $source): void
    {
        ChatbotLog::create([
            'session_id' => session()->getId(),
            'user_name'  => auth()->check() ? auth()->user()->name : 'Tamu (Guest)',
            'message'    => $message,
            'reply'      => $reply,
            'source'     => $source,
        ]);
    }
}
