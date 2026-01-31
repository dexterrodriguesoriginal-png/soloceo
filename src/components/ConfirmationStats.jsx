import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, Clock, TrendingUp } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const StatCard = ({ label, value, subtext, icon: Icon, color }) => (
  <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex items-start justify-between">
    <div>
      <p className="text-xs text-slate-500 uppercase font-semibold">{label}</p>
      <p className="text-2xl font-bold text-slate-800 mt-1">{value}</p>
      {subtext && <p className="text-xs text-slate-400 mt-1">{subtext}</p>}
    </div>
    <div className={`p-2 rounded-lg ${color} bg-opacity-10`}>
      <Icon className={`w-5 h-5 ${color.replace('bg-', 'text-')}`} />
    </div>
  </div>
);

const ConfirmationStats = ({ stats }) => {
  // Mock data for chart if not provided
  const chartData = stats?.history || [
    { name: 'Seg', rate: 65 },
    { name: 'Ter', rate: 75 },
    { name: 'Qua', rate: 82 },
    { name: 'Qui', rate: 78 },
    { name: 'Sex', rate: 90 },
    { name: 'Sáb', rate: 85 },
    { name: 'Dom', rate: 60 },
  ];

  const total = stats?.total || 0;
  const rate = total > 0 ? Math.round(((stats?.confirmed || 0) / total) * 100) : 0;
  const noShowRate = total > 0 ? Math.round(((stats?.cancelled || 0) / total) * 100) : 0;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6"
    >
      <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-100 p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-slate-800 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-500" />
            Taxa de Confirmação (7 dias)
          </h3>
          <span className="text-sm font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
            +12% vs semana anterior
          </span>
        </div>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} unit="%" />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                itemStyle={{ color: '#3b82f6', fontWeight: 600 }}
              />
              <Area type="monotone" dataKey="rate" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorRate)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="space-y-4">
        <StatCard 
          label="Taxa de Confirmação" 
          value={`${rate}%`}
          subtext={`${stats?.confirmed || 0} de ${total} agendamentos`}
          icon={CheckCircle2} 
          color="bg-green-500 text-green-600"
        />
        <StatCard 
          label="Pendentes" 
          value={stats?.pending || 0}
          subtext="Aguardando resposta"
          icon={Clock} 
          color="bg-yellow-500 text-yellow-600"
        />
        <StatCard 
          label="Cancelamentos" 
          value={stats?.cancelled || 0}
          subtext={`Taxa de perda: ${noShowRate}%`}
          icon={XCircle} 
          color="bg-red-500 text-red-600"
        />
      </div>
    </motion.div>
  );
};

export default ConfirmationStats;
