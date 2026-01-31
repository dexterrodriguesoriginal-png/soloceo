import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Bot, User, Gamepad2, PlayCircle, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { calculatePriority } from '@/lib/calculatePriority';

const ManualChatModal = ({ isOpen, onClose, lead }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [branding, setBranding] = useState({ logo_url: null, company_name: null });
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (isOpen && lead) {
      fetchHistory();
      markLeadAsManual();

      if (user?.id) {
        const fetchBranding = async () => {
          const { data } = await supabase
            .from('user_settings')
            .select('logo_url, company_name')
            .eq('user_id', user.id)
            .maybeSingle();
          if (data) setBranding(data);
        };
        fetchBranding();
      }
    }
  }, [isOpen, lead, user]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const markLeadAsManual = async () => {
    if (!lead?.id || lead.manual_mode) return;
    try {
      await supabase
        .from('leads')
        .update({
          manual_mode: true,
          manual_mode_started_at: new Date().toISOString(),
          last_manual_responder: user.email || 'Atendente'
        })
        .eq('id', lead.id);
    } catch (error) {
      console.error('Error marking manual mode:', error);
    }
  };

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('chat_history')
        .select('*')
        .eq('user_id', user.id)
        .eq('lead_id', lead.id)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching history:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    try {
      setIsSending(true);
      const messageText = inputValue.trim();
      
      const { data: newMessage, error } = await supabase
        .from('chat_history')
        .insert({
          user_id: user.id,
          lead_id: lead.id,
          message: messageText,
          sender: 'assistant' 
        })
        .select()
        .single();

      if (error) throw error;

      setMessages(prev => [...prev, newMessage]);
      setInputValue('');
      
      // Calculate new priority
      const newScore = calculatePriority({
        sentimentStatus: 'neutral',
        lastInteractionDate: new Date(),
        messageCount: messages.length + 1
      });

      // Update lead
      await supabase
        .from('leads')
        .update({
          manual_mode: true,
          last_manual_responder: user.email || 'Atendente',
          last_interaction_at: new Date().toISOString(),
          priority_score: newScore
        })
        .eq('id', lead.id);

      // Log activity
      await supabase.functions.invoke('log-activity', {
        body: {
          user_id: user.id,
          lead_id: lead.id,
          action_type: 'manual_chat',
          description: `Mensagem manual enviada: "${messageText.substring(0, 50)}${messageText.length > 50 ? '...' : ''}"`,
          executed_by: 'user',
          details: { message_id: newMessage.id }
        }
      });

    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        variant: 'destructive',
        title: 'Erro ao enviar',
        description: 'Não foi possível enviar a mensagem.'
      });
    } finally {
      setIsSending(false);
    }
  };

  const handleResumeAI = async () => {
    if (confirm('Tem certeza que deseja devolver este atendimento para a IA?')) {
      try {
        await supabase
          .from('leads')
          .update({
            manual_mode: false,
            manual_mode_started_at: null
          })
          .eq('id', lead.id);
        
        // Log activity
        await supabase.functions.invoke('log-activity', {
          body: {
            user_id: user.id,
            lead_id: lead.id,
            action_type: 'user_action',
            description: 'Retomou o atendimento automático da IA',
            executed_by: 'user'
          }
        });

        toast({
          title: 'IA Retomada',
          description: 'O atendimento automático foi reativado para este lead.'
        });
        onClose();
      } catch (error) {
        console.error('Error resuming AI:', error);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-lg bg-white rounded-xl shadow-2xl flex flex-col h-[600px] overflow-hidden"
        >
          {/* Header */}
          <div className="p-4 bg-slate-100 border-b border-slate-200 flex justify-between items-center">
             <div className="flex items-center gap-3">
                {branding.logo_url && (
                    <img src={branding.logo_url} className="h-10 w-10 object-contain rounded-md bg-white border border-slate-200 p-0.5" alt="Logo" />
                )}
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center gap-1">
                      <Gamepad2 className="w-3 h-3" /> Manual
                    </div>
                    <h3 className="font-bold text-slate-800">{lead?.name}</h3>
                  </div>
                  <p className="text-xs text-slate-500 flex items-center gap-1">
                    {branding.company_name && <span>{branding.company_name} • </span>} 
                    {lead?.phone}
                  </p>
                </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button 
                size="sm" 
                variant="outline"
                className="h-8 text-xs border-green-200 bg-green-50 text-green-700 hover:bg-green-100 hover:text-green-800"
                onClick={handleResumeAI}
              >
                <PlayCircle className="w-3 h-3 mr-1" /> Retomar IA
              </Button>
              <button 
                onClick={onClose}
                className="p-1 hover:bg-slate-200 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
            {loading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
              </div>
            ) : messages.length === 0 ? (
              <div className="text-center py-10 text-slate-400">
                <p>Nenhuma mensagem no histórico para este lead.</p>
                <p className="text-xs mt-2">Comece a digitar abaixo para assumir a conversa.</p>
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex items-end space-x-2 ${msg.sender === 'user' ? 'justify-start' : 'justify-end'}`}
                >
                  {msg.sender === 'user' && (
                    <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center shrink-0 mb-1">
                      <User className="w-4 h-4 text-slate-500" />
                    </div>
                  )}
                  
                  <div
                    className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm ${
                      msg.sender === 'user'
                        ? 'bg-white border border-slate-200 text-slate-800 rounded-bl-none'
                        : 'bg-blue-600 text-white rounded-br-none'
                    }`}
                  >
                    {msg.message}
                  </div>

                  {msg.sender !== 'user' && (
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0 mb-1 border border-blue-200 overflow-hidden">
                      {branding.logo_url ? (
                         <img src={branding.logo_url} className="w-full h-full object-contain p-1" alt="Bot" />
                      ) : (
                         <Bot className="w-4 h-4 text-blue-600" />
                      )}
                    </div>
                  )}
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white border-t border-slate-100">
            <div className="relative flex items-center gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Digite sua resposta..."
                className="flex-1 px-4 py-2 bg-slate-100 border-transparent rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm"
              />
              <Button
                onClick={handleSendMessage}
                disabled={isSending || !inputValue.trim()}
                className="bg-blue-600 hover:bg-blue-700 text-white w-10 h-10 p-0 rounded-lg"
              >
                {isSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ManualChatModal;
