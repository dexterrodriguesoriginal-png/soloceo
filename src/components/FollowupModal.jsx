import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Sparkles, Loader2, Store } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useFollowup } from '@/hooks/useFollowup';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';

const FollowupModal = ({ isOpen, onClose, lead }) => {
  const { user } = useAuth();
  const { sendFollowupMessage, loading } = useFollowup();
  const { toast } = useToast();
  const [message, setMessage] = useState('');
  const [branding, setBranding] = useState({ logo_url: null, company_name: null });

  useEffect(() => {
    if (isOpen && lead) {
      // Generate a basic personalized template
      const templates = [
        `Olá ${lead.name}, tudo bem? Notei que conversamos sobre nossos serviços recentemente. Gostaria de saber se ficou alguma dúvida ou se podemos agendar um horário para conversarmos melhor?`,
        `Oi ${lead.name}! Aqui é da equipe. Estamos com algumas novidades essa semana e lembrei do seu interesse. Podemos retomar nossa conversa?`,
        `Olá ${lead.name}, espero que esteja bem! Ainda tem interesse em agendar? Tenho alguns horários livres essa semana.`
      ];
      setMessage(templates[0]);

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

  const handleSend = async () => {
    if (!message.trim() || !lead) return;

    const success = await sendFollowupMessage(lead.id, message);
    
    if (success) {
      // Log activity
      await supabase.functions.invoke('log-activity', {
        body: {
          user_id: user.id,
          lead_id: lead.id,
          action_type: 'user_action',
          description: 'Usuário enviou follow-up manual',
          executed_by: 'user',
          details: { message_content: message }
        }
      });

      toast({
        title: "Follow-up enviado!",
        description: `Mensagem registrada para ${lead.name}.`,
      });
      onClose();
    } else {
      toast({
        variant: "destructive",
        title: "Erro ao enviar",
        description: "Tente novamente mais tarde.",
      });
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
          className="relative w-full max-w-lg bg-white rounded-xl shadow-2xl flex flex-col overflow-hidden"
        >
          <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
            <div>
              <h3 className="font-bold text-lg text-gray-900">Enviar Follow-up</h3>
              <p className="text-sm text-gray-500">Para: <span className="font-medium text-gray-700">{lead?.name}</span></p>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-4">
            {/* Branding Preview */}
            <div className="bg-slate-50 border border-slate-100 rounded-lg p-3 flex items-center justify-between">
               <div className="flex items-center gap-3">
                  {branding.logo_url ? (
                    <img 
                      src={branding.logo_url} 
                      alt="Logo" 
                      className="h-10 object-contain" 
                    />
                  ) : (
                    <div className="h-10 w-10 bg-white rounded-full flex items-center justify-center border border-slate-200">
                       <Store className="w-5 h-5 text-slate-400" />
                    </div>
                  )}
                  <div>
                    <span className="text-xs text-slate-500 block uppercase tracking-wider">Assinatura</span>
                    <span className="text-sm font-bold text-slate-800">{branding.company_name || 'SoloCEO (Padrão)'}</span>
                  </div>
               </div>
               <span className="text-[10px] text-slate-400">Pré-visualização</span>
            </div>

            <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 flex gap-2">
              <Sparkles className="w-5 h-5 text-blue-600 shrink-0" />
              <p className="text-sm text-blue-800">
                Esta mensagem foi gerada automaticamente com base no perfil do lead. Sinta-se à vontade para personalizá-la.
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Mensagem</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={6}
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-gray-800 text-sm leading-relaxed"
                placeholder="Digite sua mensagem de acompanhamento..."
              />
            </div>
          </div>

          <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
            <Button variant="outline" onClick={onClose} disabled={loading}>
              Cancelar
            </Button>
            <Button onClick={handleSend} disabled={loading || !message.trim()} className="bg-blue-600 hover:bg-blue-700">
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Enviando...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" /> Enviar Mensagem
                </>
              )}
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default FollowupModal;
