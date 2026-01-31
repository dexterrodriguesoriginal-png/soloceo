import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const WhatsAppChat = () => {
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);

  const conversation = [
    { id: 1, type: 'client', text: "Oi, quanto custa um corte?" },
    { id: 2, type: 'ai', text: "Oi! 👋 Tudo bem? Nossos cortes saem por R$ 45 a R$ 80, dependendo do estilo. Gostaria de ver alguns modelos ou agendar?" },
    { id: 3, type: 'client', text: "Quero um degradê. Qual é o melhor horário?" },
    { id: 4, type: 'ai', text: "Perfeito! 💇 O degradê é nossa especialidade. Temos horários disponíveis hoje às 14h, 15h e 16h. Qual prefere?" },
    { id: 5, type: 'client', text: "15h está ótimo!" },
    { id: 6, type: 'ai', text: "✅ Agendado! Seu degradê está confirmado para hoje às 15h. Até já! 🎉" }
  ];

  useEffect(() => {
    let currentIndex = 0;
    
    const simulateChat = async () => {
      if (currentIndex >= conversation.length) return;

      const msg = conversation[currentIndex];
      
      // Simulate typing delay for AI, instant for client (or slight delay)
      const typingDelay = msg.type === 'ai' ? 1500 : 800;
      const readingDelay = 1000;

      if (msg.type === 'ai') {
        setIsTyping(true);
        await new Promise(r => setTimeout(r, typingDelay));
        setIsTyping(false);
      } else {
        await new Promise(r => setTimeout(r, readingDelay));
      }

      setMessages(prev => [...prev, msg]);
      currentIndex++;
      simulateChat();
    };

    // Start slightly after mount
    setTimeout(simulateChat, 1000);

    return () => {
      // Cleanup if needed, though simple timeout chain is usually fine for this demo
    };
  }, []);

  return (
    <div className="flex flex-col h-full bg-[#E5DDD5] font-sans text-sm relative overflow-hidden">
      {/* WhatsApp Header */}
      <div className="bg-[#075E54] p-3 flex items-center gap-3 text-white shadow-md z-10 shrink-0">
        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center overflow-hidden">
             <div className="w-full h-full bg-gradient-to-br from-[#39FF14] to-green-600 flex items-center justify-center">
                 <span className="text-xs font-bold text-black">SC</span>
             </div>
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-sm leading-tight">SoloCEO Assistant</span>
          <span className="text-[10px] opacity-80 leading-tight">
            {isTyping ? 'digitando...' : 'online'}
          </span>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 relative">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-[0.06] bg-repeat z-0 pointer-events-none"
             style={{ backgroundImage: "url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')" }}>
        </div>

        <div className="relative z-10 flex flex-col space-y-2">
            <div className="text-center text-[10px] text-gray-500 uppercase font-medium my-2 bg-[#E1F3FB] self-center px-2 py-0.5 rounded shadow-sm">Hoje</div>
            
            <AnimatePresence>
            {messages.map((msg) => (
                <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={`max-w-[85%] rounded-lg p-2 px-3 shadow-sm relative ${
                    msg.type === 'ai' 
                    ? 'bg-white self-start rounded-tl-none' 
                    : 'bg-[#DCF8C6] self-end rounded-tr-none'
                }`}
                >
                <p className="text-gray-800 leading-snug">{msg.text}</p>
                <span className="text-[9px] text-gray-500 block text-right mt-1 -mb-1">
                    {new Date().getHours()}:{String(new Date().getMinutes()).padStart(2, '0')}
                    {msg.type === 'client' && <span className="ml-1 text-blue-400">✓✓</span>}
                </span>
                </motion.div>
            ))}
            </AnimatePresence>

            {isTyping && (
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="bg-white self-start rounded-lg rounded-tl-none p-2 px-3 shadow-sm"
                >
                    <div className="flex gap-1">
                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                    </div>
                </motion.div>
            )}
        </div>
      </div>
      
      {/* Input Area Mock */}
      <div className="bg-[#F0F0F0] p-2 flex items-center gap-2 shrink-0 z-10">
          <div className="w-8 h-8 text-gray-400 flex items-center justify-center text-xl">+</div>
          <div className="flex-1 bg-white rounded-full h-9 px-4 text-sm flex items-center text-gray-400">
              Mensagem
          </div>
          <div className="w-8 h-8 rounded-full bg-[#00897B] flex items-center justify-center">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="white">
                  <path d="M1.101 21.757 23.8 12.028 1.101 2.3l.011 7.912 13.623 1.816-13.623 1.817-.011 7.912z"></path>
              </svg>
          </div>
      </div>
    </div>
  );
};

export default WhatsAppChat;
