import React, { useState } from 'react';
import { Search, Filter, RefreshCw } from 'lucide-react';
import { useActivityLogs } from '@/hooks/useActivityLogs';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import ActivityLogsTable from '@/components/ActivityLogsTable';
import ActivityLogDetail from '@/components/ActivityLogDetail';
import { Button } from '@/components/ui/button';

const ActivityLogs = () => {
  const { user } = useAuth();
  const [filters, setFilters] = useState({
    actionType: 'all',
    dateRange: '24h',
    search: ''
  });
  const [selectedLog, setSelectedLog] = useState(null);

  const { logs, loading, refetch } = useActivityLogs({
    userId: user?.id,
    actionType: filters.actionType,
    dateRange: filters.dateRange
  });

  const filteredLogs = logs.filter(log => {
    if (!filters.search) return true;
    const searchLower = filters.search.toLowerCase();
    return (
      log.description?.toLowerCase().includes(searchLower) ||
      log.leads?.name?.toLowerCase().includes(searchLower) ||
      log.action_type?.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-4 border border-slate-100">
        <div className="flex flex-col md:flex-row gap-4 justify-between">
          
          <div className="flex flex-1 gap-2 items-center">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Buscar em logs..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2 items-center">
            <div className="flex items-center gap-2 bg-slate-50 p-1 rounded-lg border border-slate-200">
              <Filter className="w-4 h-4 text-slate-400 ml-2" />
              <select
                value={filters.actionType}
                onChange={(e) => setFilters(prev => ({ ...prev, actionType: e.target.value }))}
                className="bg-transparent border-none text-sm text-slate-700 focus:ring-0 cursor-pointer py-1"
              >
                <option value="all">Todas as Ações</option>
                <option value="ai_message">Mensagens IA</option>
                <option value="user_action">Ações do Usuário</option>
                <option value="manual_chat">Chat Manual</option>
                <option value="schedule">Agendamentos</option>
                <option value="confirmation">Confirmações</option>
              </select>
            </div>

            <div className="flex bg-slate-50 p-1 rounded-lg border border-slate-200">
              {['24h', '48h', '7d'].map((range) => (
                <button
                  key={range}
                  onClick={() => setFilters(prev => ({ ...prev, dateRange: range }))}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                    filters.dateRange === range
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {range === '7d' ? '7 Dias' : range}
                </button>
              ))}
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={refetch}
              className="text-slate-500 hover:text-slate-700"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 min-h-[400px]">
        {loading && logs.length === 0 ? (
          <div className="flex items-center justify-center h-64">
            <RefreshCw className="w-6 h-6 animate-spin text-blue-500" />
          </div>
        ) : (
          <ActivityLogsTable 
            logs={filteredLogs} 
            onViewDetail={setSelectedLog} 
          />
        )}
      </div>

      <ActivityLogDetail 
        isOpen={!!selectedLog} 
        onClose={() => setSelectedLog(null)} 
        log={selectedLog} 
      />
    </div>
  );
};

export default ActivityLogs;
