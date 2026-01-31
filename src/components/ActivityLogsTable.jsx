import React from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Bot, User, Calendar, CheckCircle2, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';

const getTypeConfig = (type) => {
  switch (type) {
    case 'ai_message':
      return { icon: Bot, color: 'text-blue-500 bg-blue-50', label: 'Mensagem IA' };
    case 'user_action':
    case 'manual_chat':
      return { icon: User, color: 'text-green-500 bg-green-50', label: 'Ação Usuário' };
    case 'schedule':
      return { icon: Calendar, color: 'text-purple-500 bg-purple-50', label: 'Agendamento' };
    case 'confirmation':
      return { icon: CheckCircle2, color: 'text-emerald-500 bg-emerald-50', label: 'Confirmação' };
    default:
      return { icon: MoreHorizontal, color: 'text-gray-500 bg-gray-50', label: type };
  }
};

const ActivityLogsTable = ({ logs, onViewDetail }) => {
  if (!logs || logs.length === 0) {
    return (
      <div className="text-center py-10 text-gray-400 bg-white rounded-lg border border-dashed border-gray-200">
        <p>Nenhuma atividade encontrada com os filtros atuais.</p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto rounded-lg border border-gray-200 shadow-sm bg-white">
      <table className="w-full text-sm text-left">
        <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b border-gray-100">
          <tr>
            <th className="px-4 py-3 font-medium">Horário</th>
            <th className="px-4 py-3 font-medium">Cliente</th>
            <th className="px-4 py-3 font-medium">Tipo</th>
            <th className="px-4 py-3 font-medium">Descrição</th>
            <th className="px-4 py-3 font-medium text-center">Executado Por</th>
            <th className="px-4 py-3 font-medium text-right">Ações</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {logs.map((log) => {
            const config = getTypeConfig(log.action_type);
            const Icon = config.icon;

            return (
              <tr key={log.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-4 py-3 whitespace-nowrap text-gray-500">
                  {format(new Date(log.created_at), "dd/MM HH:mm", { locale: ptBR })}
                </td>
                <td className="px-4 py-3 font-medium text-gray-900">
                  {log.leads?.name || '-'}
                </td>
                <td className="px-4 py-3">
                  <div className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
                    <Icon className="w-3 h-3" />
                    {config.label}
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-600 max-w-[300px] truncate" title={log.description}>
                  {log.description}
                </td>
                <td className="px-4 py-3 text-center">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs capitalize ${
                    log.executed_by === 'ai' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-700'
                  }`}>
                    {log.executed_by === 'ai' ? '🤖 IA' : '👤 Usuário'}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 w-8 p-0"
                    onClick={() => onViewDetail(log)}
                  >
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ActivityLogsTable;
