<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ChatbotLog;
use App\Models\Order;
use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/Dashboard', [
            'kpi'            => $this->buildKpi(),
            'recentOrders'   => $this->buildRecentOrders(),
            'totalOrderCount'=> Order::count(),
            'salesChart'     => $this->buildSalesChart(),
            'chatbotLogs'    => $this->buildChatbotLogs(),
        ]);
    }

    // ── Private helpers ──────────────────────────────────────

    private function buildKpi(): array
    {
        $totalSales     = Order::where('payment_status', 'Terverifikasi')->sum('total_amount');
        $totalOrders    = Order::count();
        $totalCustomers = User::where('role', 'user')->count();
        $conversionRate = $totalCustomers > 0
            ? min(100, round(($totalOrders / ($totalCustomers * 3)) * 100, 2))
            : 0;

        return [
            'totalSales'     => 'Rp ' . number_format($totalSales, 0, ',', '.'),
            'totalOrders'    => $totalOrders,
            'totalCustomers' => $totalCustomers,
            'conversionRate' => $conversionRate . '%',
        ];
    }

    private function buildRecentOrders(): array
    {
        return Order::with('items')
            ->latest()
            ->limit(5)
            ->get()
            ->map(function (Order $order) {
                $productNames = $order->items
                    ->map(fn($item) => "{$item->product_name} ({$item->bottle_size})")
                    ->implode(', ');

                return [
                    'id'     => '#' . $order->invoice_number,
                    'cust'   => $order->customer_name,
                    'prod'   => $productNames ?: 'Parfum Formulasi AI',
                    'total'  => 'Rp ' . number_format($order->total_amount, 0, ',', '.'),
                    'status' => $order->order_status,
                ];
            })
            ->toArray();
    }

    private function buildSalesChart(): array
    {
        $labels = [];
        $data   = [];

        for ($i = 6; $i >= 0; $i--) {
            $date     = now()->subDays($i);
            $labels[] = $date->translatedFormat('d M');
            $data[]   = round(
                Order::whereDate('created_at', $date->toDateString())
                    ->where('payment_status', 'Terverifikasi')
                    ->sum('total_amount') / 1000
            );
        }

        return compact('labels', 'data');
    }

    private function buildChatbotLogs(): array
    {
        return ChatbotLog::latest()
            ->limit(5)
            ->get()
            ->map(fn($log) => [
                'name'   => $log->user_name,
                'msg'    => $log->message,
                'reply'  => $log->reply,
                'source' => $log->source,
                'time'   => $log->created_at->format('H:i'),
                'date'   => $log->created_at->format('d M'),
            ])
            ->toArray();
    }
}
