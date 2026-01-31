import React from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Edit2 } from 'lucide-react';

const FinancialTable = ({ schedules, loading }) => {
  const totalValue = schedules.reduce((acc, curr) => acc + (Number(curr.price) || 0), 0);

  if (loading) {
    return (
      <div className="w-full h-48 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (schedules.length === 0) {
    return (
      <div className="text-center py-8 text-slate-500 bg-slate-50 rounded-lg border border-dashed border-slate-200">
        Nenhum serviço confirmado neste mês.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 shadow-sm">
      <table className="w-full text-sm text-left text-slate-600">
        <thead className="text-xs text-slate-700 uppercase bg-slate-50 border-b border-slate-200">
          <tr>
            <th className="px-4 py-3 font-semibold">Cliente</th>
            <th className="px-4 py-3 font-semibold">Serviço / Notas</th>
            <th className="px-4 py-3 font-semibold text-center">Data</th>
            <th className="px-4 py-3 font-semibold text-right">Valor</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 bg-white">
          {schedules.map((schedule) => (
            <tr key={schedule.id} className="hover:bg-slate-50 transition-colors">
              <td className="px-4 py-3 font-medium text-slate-900">
                {schedule.client_name}
                {schedule.client_phone && (
                  <div className="text-xs text-slate-400 font-normal">{schedule.client_phone}</div>
                )}
              </td>
              <td className="px-4 py-3 max-w-[200px] truncate" title={schedule.notes}>
                {schedule.notes || '—'}
              </td>
              <td className="px-4 py-3 text-center">
                {schedule.date ? format(new Date(schedule.date), 'dd/MM', { locale: ptBR }) : '—'}
              </td>
              <td className="px-4 py-3 text-right font-medium text-slate-900">
                {schedule.price ? (
                  `R$ ${Number(schedule.price).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
                ) : (
                  <span className="text-slate-400 inline-flex items-center gap-1 justify-end cursor-not-allowed" title="Sem valor definido">
                    — <Edit2 className="w-3 h-3 opacity-50" />
                  </span>
                )}
              </td>
            </tr>
          ))}
          <tr className="bg-slate-50 font-bold border-t-2 border-slate-100">
            <td className="px-4 py-3 text-slate-800" colSpan={3}>
              Total do Mês
            </td>
            <td className="px-4 py-3 text-right text-blue-600 text-base">
              R$ {totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default FinancialTable;
