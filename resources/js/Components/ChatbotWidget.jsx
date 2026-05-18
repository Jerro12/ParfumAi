import { useState } from 'react';

export function ChatbotWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { sender: 'ai', text: 'Halo! Saya Asisten AI Parfumerie. Ingin mencari rekomendasi parfum untuk acara atau suasana seperti apa?' }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);

    const prompts = [
        'Aroma manis untuk kencan',
        'Parfum segar untuk kerja',
        'Wewangian woody tahan lama'
    ];

    const handleSend = (userQuery) => {
        const query = typeof userQuery === 'string' ? userQuery : input;
        if (!query.trim()) return;

        setMessages(prev => [...prev, { sender: 'user', text: query }]);
        if (typeof userQuery !== 'string') setInput('');
        setIsTyping(true);

        setTimeout(() => {
            let aiReply = "Berdasarkan preferensi tersebut, kami merekomendasikan **Elysian Gold Herb** dengan sentuhan Sandalwood dan Bergamot yang elegan.";
            if (query.toLowerCase().includes('kencan') || query.toLowerCase().includes('malam') || query.toLowerCase().includes('manis')) {
                aiReply = "Untuk suasana romantis dan kencan, **Midnight Velour** dengan kombinasi Amber, Oud, dan Damask Rose akan menciptakan kesan mendalam yang memikat.";
            } else if (query.toLowerCase().includes('kerja') || query.toLowerCase().includes('segar') || query.toLowerCase().includes('pagi')) {
                aiReply = "Untuk aktivitas kerja dan kesegaran pagi, **Verdant Breeze** dengan paduan Green Tea, Jasmine, dan Mint sangat tepat untuk meningkatkan fokus dan energi.";
            }

            setMessages(prev => [...prev, { sender: 'ai', text: aiReply }]);
            setIsTyping(false);
        }, 1200);
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 font-sans">
            {/* Tombol Buka Tutup Chat */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-5 py-3.5 rounded-full bg-forest text-forest-foreground shadow-2xl hover:scale-105 transition-all duration-300 font-medium tracking-wide border border-gold/30"
            >
                <span className="text-gold text-lg animate-pulse">✨</span>
                <span>{isOpen ? 'Tutup Konsultasi AI' : 'Tanya Asisten AI'}</span>
            </button>

            {/* Jendela Chat Popup */}
            {isOpen && (
                <div className="absolute bottom-16 right-0 w-[90vw] sm:w-[380px] bg-card rounded-3xl border border-border shadow-2xl overflow-hidden flex flex-col h-[500px] animate-in fade-in-50 slide-in-from-bottom-5 duration-300">
                    <div className="bg-primary px-6 py-4 flex items-center justify-between text-primary-foreground">
                        <div className="flex items-center gap-2">
                            <span className="text-xl">✨</span>
                            <div>
                                <h3 className="font-serif text-lg font-bold">AI Scent Sommelier</h3>
                                <p className="text-xs text-primary-foreground/80">Online • Siap membantu</p>
                            </div>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="hover:opacity-75 text-xl font-bold">×</button>
                    </div>

                    <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-background/50 text-sm">
                        {messages.map((m, idx) => (
                            <div key={idx} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[85%] rounded-2xl px-4 py-3 leading-relaxed shadow-sm ${
                                    m.sender === 'user' 
                                        ? 'bg-primary text-primary-foreground rounded-br-sm' 
                                        : 'bg-card text-card-foreground border border-border/80 rounded-bl-sm'
                                }`}>
                                    {m.text}
                                </div>
                            </div>
                        ))}
                        {isTyping && (
                            <div className="flex justify-start">
                                <div className="bg-card border border-border px-4 py-3 rounded-2xl rounded-bl-sm text-xs text-muted-foreground flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-primary animate-bounce" />
                                    <span className="w-2 h-2 rounded-full bg-primary animate-bounce delay-100" />
                                    <span className="w-2 h-2 rounded-full bg-primary animate-bounce delay-200" />
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="p-3 bg-card border-t border-border space-y-2">
                        <div className="flex flex-wrap gap-1.5">
                            {prompts.map((p, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => handleSend(p)}
                                    className="text-[11px] px-2.5 py-1 rounded-full bg-secondary text-secondary-foreground border border-border hover:bg-primary hover:text-primary-foreground transition"
                                >
                                    {p}
                                </button>
                            ))}
                        </div>
                        <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex gap-2">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Tulis suasana atau preferensi wangi..."
                                className="flex-1 text-sm bg-input text-foreground border border-border rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50"
                            />
                            <button
                                type="submit"
                                className="px-4 py-2 bg-primary text-primary-foreground rounded-full text-sm font-medium hover:opacity-90 transition"
                            >
                                Kirim
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
