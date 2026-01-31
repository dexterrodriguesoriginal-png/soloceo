import React from 'react';
import { motion } from 'framer-motion';
import { Filter, X, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

const FilterBar = ({ 
  filters, 
  setFilters, 
  totalLeads, 
  filteredCount 
}) => {
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      priority: 'all',
      date: 'all',
      followup: 'all'
    });
  };

  const hasActiveFilters = filters.priority !== 'all' || filters.date !== 'all' || filters.followup !== 'all';

  return (
    <motion.div 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/5 border border-white/10 rounded-xl p-4 mb-6 backdrop-blur-sm"
    >
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex flex-wrap gap-3 items-center w-full md:w-auto">
          <div className="flex items-center gap-2 text-white/70 mr-2">
            <Filter className="w-4 h-4" />
            <span className="text-sm font-medium">Filtros:</span>
          </div>

          {/* Priority Filter */}
          <div className="relative group">
            <select
              value={filters.priority}
              onChange={(e) => handleFilterChange('priority', e.target.value)}
              className="appearance-none bg-slate-800 text-white text-sm px-4 py-2 pr-8 rounded-lg border border-slate-700 focus:outline-none focus:ring-2 focus:ring-[#22c55e] cursor-pointer hover:bg-slate-700 transition-colors"
            >
              <option value="all">Prioridade: Todas</option>
              <option value="high">🔴 Alta Prioridade</option>
              <option value="medium">🟡 Média Prioridade</option>
              <option value="low">🟢 Baixa Prioridade</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>

          {/* Date Filter */}
          <div className="relative group">
            <select
              value={filters.date}
              onChange={(e) => handleFilterChange('date', e.target.value)}
              className="appearance-none bg-slate-800 text-white text-sm px-4 py-2 pr-8 rounded-lg border border-slate-700 focus:outline-none focus:ring-2 focus:ring-[#22c55e] cursor-pointer hover:bg-slate-700 transition-colors"
            >
              <option value="all">Período: Todos</option>
              <option value="24h">Últimas 24h</option>
              <option value="7d">Últimos 7 dias</option>
              <option value="30d">Últimos 30 dias</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>

          {/* Follow-up Filter */}
          <div className="relative group">
            <select
              value={filters.followup}
              onChange={(e) => handleFilterChange('followup', e.target.value)}
              className="appearance-none bg-slate-800 text-white text-sm px-4 py-2 pr-8 rounded-lg border border-slate-700 focus:outline-none focus:ring-2 focus:ring-[#22c55e] cursor-pointer hover:bg-slate-700 transition-colors"
            >
              <option value="all">Status: Todos</option>
              <option value="needs">⏰ Precisa Follow-up</option>
              <option value="sent">📧 Follow-up Enviado</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>

          {hasActiveFilters && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={clearFilters}
              className="text-white/60 hover:text-white hover:bg-white/10"
            >
              <X className="w-3 h-3 mr-1" /> Limpar
            </Button>
          )}
        </div>

        <div className="text-white/60 text-sm font-medium whitespace-nowrap">
          Mostrando <span className="text-[#22c55e] font-bold">{filteredCount}</span> de {totalLeads} leads
        </div>
      </div>
    </motion.div>
  );
};

export default FilterBar;
