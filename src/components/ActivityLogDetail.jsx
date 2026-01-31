import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, User, Bot, Activity, FileJson } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const ActivityLogDetail = ({ isOpen, onClose, log }) => {
  if (!isOpen || !log) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
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
          className="relative w-full max-w-lg bg-white rounded-xl shadow-2xl flex flex-col overflow-hidden max-h-[80vh]"
        >
          <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-500" />
              Detalhes da Atividade
            </h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-6 overflow-y-auto">
            {/* Header Info */}
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500">Cliente</p>
                <p className="font-semibold text-gray-900 text-lg">
                  {log.leads?.name || 'Sistema / Desconhecido'}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Data e Hora</p>
                <p className="font-medium text-gray-900 flex items-center justify-end gap-1">
                  <Clock className="w-3 h-3" />
                  {format(new Date(log.created_at), "dd/MM/yyyy HH:mm:ss", { locale: ptBR })}
                </p>
              </div>
            </div>

            {/* Main Action Info */}
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Tipo de Ação</p>
                  <p className="font-medium capitalize text-slate-800 mt-1">{log.action_type?.replace('_', ' ')}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Executado Por</p>
                  <div className="flex items-center gap-2 mt-1">
                    {log.executed_by === 'ai' ? (
                      <Bot className="w-4 h-4 text-blue-500" />
                    ) : (
                      <User className="w-4 h-4 text-green-500" />
                    )}
                    <span className="font-medium capitalize text-slate-800">{log.executed_by}</span>
                  </div>
                </div>
              </div>

              {log.confidence_score != null && (
                 <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Score de Confiança</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="h-2 w-24 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-blue-500" 
                          style={{ width: `${log.confidence_score * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium">{(log.confidence_score * 100).toFixed(0)}%</span>
                    </div>
                 </div>
              )}
            </div>

            {/* Description */}
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Descrição</p>
              <div className="bg-white border border-gray-200 p-3 rounded-lg text-gray-600 text-sm leading-relaxed">
                {log.description}
              </div>
            </div>

            {/* JSON Details */}
            {log.details && Object.keys(log.details).length > 0 && (
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <FileJson className="w-4 h-4 text-gray-400" />
                  Dados Técnicos
                </p>
                <div className="bg-slate-900 rounded-lg p-3 overflow-x-auto">
                  <pre className="text-xs text-green-400 font-mono">
                    {JSON.stringify(log.details, null, 2)}
                  </pre>
                </div>
              </div>
            )}
          </div>

          <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end">
            <Button onClick={onClose} variant="secondary">
              Fechar
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ActivityLogDetail;
