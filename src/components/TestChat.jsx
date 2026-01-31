import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Trash2, Loader2, Server, Key } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useAlerts } from '@/hooks/useAlerts';

const TestChat = ({ systemPrompt, apiKey }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { createAlert } = useAlerts();
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isHistoryLoading, setIsHistoryLoading] = useState(true);
  const [clientName, setClientName] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const fetchHistory = async () => {
      if (!user) return;
      try {
        setIsHistoryLoading(true);
        const { data, error } = await supabase
          .from('chat_history')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: true });

        if (error) throw error;

        if (data && data.length > 0) {
          const formattedMessages = data.map(msg => ({
            id: msg.id,
            sender: msg.sender === 'assistant' ? 'solo' : 'user',
            text: msg.message
          }));
          setMessages(formattedMessages);
        } else {
          setMessages([
            { id: 'welcome', sender: 'solo', text: 'Olá! Eu sou a sua versão de teste do agente. Configure minhas instruções ao lado e vamos conversar!' }
          ]);
        }
      } catch (error) {
        console.error('Error fetching chat history:', error);
      } finally {
        setIsHistoryLoading(false);
      }
    };
    fetchHistory();
  }, [user]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isHistoryLoading]);

  const hasProvidedKey = !!apiKey && apiKey.trim().length > 0;

  const saveMessageToHistory = async (text, sender) => {
    if (!user) return;
    try {
      const dbSender = sender === 'solo' ? 'assistant' : 'user';
      const { error } = await supabase
        .from('chat_history')
        .insert({
          user_id: user.id,
          message: text,
          sender: dbSender
        });
      if (error) throw error;
    } catch (err) {
      console.error('Error saving message:', err);
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;
    
    const messageText = inputValue.trim();
    const userMessage = { id: Date.now().toString(), sender: 'user', text: messageText };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    saveMessageToHistory(messageText, 'user');

    try {
      const chatHistory = messages
        .filter(m => m.id !== 'welcome')
        .map(m => ({ sender: m.sender === 'solo' ? 'assistant' : 'user', text: m.text }));
      
      chatHistory.push({ sender: 'user', text: userMessage.text });

      let enhancedSystemPrompt = systemPrompt;
      if (clientName) {
        enhancedSystemPrompt += `\n\nCONTEXTO DO SISTEMA: O nome do cliente com quem você está falando é ${clientName}. Use o nome dele naturalmente na conversa.`;
      }

      const { data, error } = await supabase.functions.invoke('chat-with-openai', {
        body: {
          messages: chatHistory,
          systemPrompt: enhancedSystemPrompt,
          apiKey: hasProvidedKey ? apiKey.trim() : undefined 
        }
      });

      if (error || !data || !data.success) {
        throw new Error(data?.error || error?.message || 'Erro na IA');
      }

      const botMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'solo',
        text: data.response
      };

      setMessages(prev => [...prev, botMessage]);
      saveMessageToHistory(data.response, 'solo');

      // Check for low confidence alerts
      const lowConfidenceKeywords = ["não entendi", "pode repetir", "desculpe", "não tenho certeza", "não sei"];
      const isUnconfident = lowConfidenceKeywords.some(k => data.response.toLowerCase().includes(k));
      if (isUnconfident) {
        await createAlert(
          'unconfident',
          null,
          `IA insegura no chat de teste: "${data.response.substring(0, 50)}..."`
        );
      }

      // NOTE: In TestChat we usually don't have a lead context, so we don't update leads table directly here.
      // If TestChat was used with a real lead context, we would call supabase.from('leads').update(...) here too.

    } catch (error) {
      console.error('Chat Error:', error);
      toast({
        variant: 'destructive',
        title: 'Erro no Chat',
        description: error.message || 'Falha ao comunicar com a IA.',
      });
      setMessages(prev => [...prev, { id: Date.now().toString(), sender: 'solo', text: `⚠️ Erro: ${error.message}` }]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = async () => {
    if (!user) return;
    try {
      const { error } = await supabase.from('chat_history').delete().eq('user_id', user.id);
      if (error) throw error;
      setMessages([{ id: 'welcome', sender: 'solo', text: 'Histórico apagado. Podemos recomeçar!' }]);
      setClientName('');
      toast({ title: "Histórico limpo com sucesso." });
    } catch (err) {
      toast({ variant: 'destructive', title: "Erro ao limpar histórico", description: err.message });
    }
  };

  return (
    <div className="flex flex-col h-[600px] bg-white rounded-xl shadow-xl overflow-hidden border border-gray-100">
      <div className="bg-[#1e293b] p-4 flex justify-between items-center shrink-0">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-[#22c55e] to-[#16a34a] rounded-lg flex items-center justify-center">
            <Bot className="text-white w-6 h-6" />
          </div>
          <div>
            <h3 className="text-white font-bold text-lg">Teste em Tempo Real</h3>
            <div className="flex items-center space-x-2">
              {hasProvidedKey ? (
                <span className="text-xs text-white/70 flex items-center gap-1">
                   <Key className="w-3 h-3" /> Chave Personalizada
                </span>
              ) : (
                <span className="text-xs text-white/70 flex items-center gap-1">
                   <Server className="w-3 h-3" /> Chave do Servidor
                </span>
              )}
            </div>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={clearChat} className="text-white/60 hover:text-white hover:bg-white/10">
          <Trash2 className="w-5 h-5" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
        {isHistoryLoading ? (
           <div className="flex justify-center p-4"><Loader2 className="animate-spin text-slate-400"/></div>
        ) : (
          <AnimatePresence initial={false}>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex items-end space-x-2 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.sender === 'solo' && (
                  <div className="w-8 h-8 rounded-full bg-[#1e293b] flex items-center justify-center shrink-0 mb-1">
                    <Bot className="w-4 h-4 text-[#22c55e]" />
                  </div>
                )}
                <div className={`max-w-[80%] px-4 py-3 rounded-2xl shadow-sm text-sm leading-relaxed ${
                    message.sender === 'user' ? 'bg-[#22c55e] text-white rounded-br-none' : 'bg-white text-gray-800 border border-gray-100 rounded-bl-none'
                  }`}>
                  {message.text}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
        {isLoading && (
          <div className="flex items-center space-x-2">
             <div className="w-8 h-8 rounded-full bg-[#1e293b] flex items-center justify-center"><Bot className="w-4 h-4 text-[#22c55e]"/></div>
             <div className="bg-white px-4 py-2 rounded-2xl border shadow-sm"><div className="flex gap-1"><div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce"/><div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce delay-75"/><div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce delay-150"/></div></div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-white border-t border-gray-100 shrink-0">
        <div className="relative flex items-center">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Digite sua mensagem..."
            disabled={isLoading}
            className="w-full pl-4 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#22c55e] focus:border-transparent outline-none transition-all"
          />
          <Button
            onClick={handleSendMessage}
            disabled={isLoading || !inputValue.trim()}
            size="icon"
            className="absolute right-2 bg-[#22c55e] hover:bg-[#16a34a] text-white rounded-lg h-8 w-8"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TestChat;
