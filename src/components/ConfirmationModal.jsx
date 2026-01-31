import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Clock, MessageCircle, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { useConfirmationStatus } from '@/hooks/useConfirmationStatus';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';

const ConfirmationModal = ({ isOpen, onClose, schedule }) => {
  const { user } = useAuth();
  const { status, messages, updateConfirmationStatus } = useConfirmationStatus(schedule?.id);
  const [cancelling, setCancelling] = useState(false);
  const [cancelReason, setCancelReason] = useState('');

  if (!isOpen || !schedule) return null;

  const handleConfirm = async () => {
    await updateConfirmationStatus('confirmed');
    
    // Log activity
    await supabase.functions.invoke('log-activity', {
      body: {
        user_id: user.id,
        action_type: 'confirmation',
        description: `Agendamento confirmado manualmente para ${schedule.client_name}`,
        executed_by: 'user',
        details: { schedule_id: schedule.id }
      }
    });

    onClose();
  };

  const handleCancel = async () => {
    if (!cancelling) {
      setCancelling(true);
      return;
    }
    await updateConfirmationStatus('cancelled', cancelReason);

    // Log activity
    await supabase.functions.invoke('log-activity', {
      body: {
        user_id: user.id,
        action_type: 'confirmation',
        description: `Agendamento cancelado manualmente para ${schedule.client_name}. Motivo: ${cancelReason}`,
        executed_by: 'user',
        details: { schedule_id: schedule.id, reason: cancelReason }
      }
    });

    setCancelling(false);
    setCancelReason('');
    onClose();
  };

  const renderTimeline = () => (
    <div className="space-y-4 relative pl-4 border-l-2 border-slate-100 ml-2">
      {/* Creation */}
      <div className="relative">
        <div className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-slate-300 border-2 border-white" />
        <p className="text-xs text-slate-500">Agendamento criado</p>
        <p className="text-xs font-medium text-slate-700">
          {format(new Date(schedule.created_at), "dd/MM 'às' HH:mm", { locale: ptBR })}
        </p>
      </div>

      {messages.map((msg) => (
        <div key={msg.id} className="relative">
          <div className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-blue-500 border-2 border-white" />
          <p className="text-xs text-slate-500">
            Lembrete {msg.message_type === '24h' ? '24h' : '2h'} enviado
          </p>
          <p className="text-xs font-medium text-slate-700">
            {format(new Date(msg.sent_at), "dd/MM 'às' HH:mm", { locale: ptBR })}
          </p>
          {msg.response && (
            <div className="mt-2 bg-blue-50 p-2 rounded-lg text-xs text-blue-800 border border-blue-100">
              Resposta: "{msg.response}"
            </div>
          )}
        </div>
      ))}
      
      {/* Current Status */}
      <div className="relative">
        <div className={`absolute -left-[21px] top-1 w-3 h-3 rounded-full border-2 border-white ${
          status === 'confirmed' ? 'bg-green-500' :
          status === 'cancelled' ? 'bg-red-500' :
          'bg-yellow-500'
        }`} />
        <p className="text-xs text-slate-500">Status atual</p>
        <p className={`text-sm font-bold ${
          status === 'confirmed' ? 'text-green-600' :
          status === 'cancelled' ? 'text-red-600' :
          'text-yellow-600'
        }`}>
          {status === 'confirmed' ? 'Confirmado' :
           status === 'cancelled' ? 'Cancelado' :
           status === 'no_response' ? 'Sem Resposta' : 'Pendente'}
        </p>
        {status === 'cancelled' && schedule.cancellation_reason && (
          <p className="text-xs text-red-500 mt-1 italic">Motivo: {schedule.cancellation_reason}</p>
        )}
      </div>
    </div>
  );

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
          className="relative w-full max-w-md bg-white rounded-xl shadow-2xl flex flex-col overflow-hidden"
        >
          <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-slate-500" />
              Status do Agendamento
            </h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            <div className="bg-slate-50 rounded-lg p-4 border border-slate-100">
              <p className="text-lg font-bold text-slate-900">{schedule.client_name}</p>
              <p className="text-sm text-slate-600 flex items-center mt-1">
                <Clock className="w-3 h-3 mr-1" />
                {format(new Date(schedule.date), "dd 'de' MMMM", { locale: ptBR })} às {schedule.start_time.substring(0, 5)}
              </p>
              <p className="text-sm text-slate-600 mt-1">
                Serviço: <span className="font-medium">{schedule.notes || 'Consulta'}</span>
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-semibold uppercase text-slate-400 tracking-wider">Histórico de Confirmação</h4>
              {renderTimeline()}
            </div>
            
            {cancelling && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="space-y-2"
              >
                <label className="text-sm font-medium text-slate-700">Motivo do cancelamento:</label>
                <input 
                  type="text" 
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  placeholder="Ex: Cliente desmarcou, imprevisto..."
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                  autoFocus
                />
              </motion.div>
            )}
          </div>

          <div className="p-4 bg-gray-50 border-t border-gray-100 flex gap-3 justify-end">
            {(status === 'pending' || status === 'no_response' || status === 'confirmed') && !cancelling && (
              <Button 
                variant="destructive" 
                onClick={handleCancel}
                className="flex-1"
              >
                Cancelar Agenda
              </Button>
            )}
            
            {cancelling && (
              <>
                <Button variant="ghost" onClick={() => setCancelling(false)}>Voltar</Button>
                <Button variant="destructive" onClick={handleCancel}>Confirmar Cancelamento</Button>
              </>
            )}

            {(status === 'pending' || status === 'no_response' || status === 'cancelled') && !cancelling && (
              <Button 
                className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                onClick={handleConfirm}
              >
                <Check className="w-4 h-4 mr-2" />
                Confirmar Presença
              </Button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ConfirmationModal;
