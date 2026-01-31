import React from 'react';
import { motion } from 'framer-motion';

const ProgressBar = ({ currentAmount, goalAmount }) => {
  const percentage = goalAmount > 0 ? Math.min((currentAmount / goalAmount) * 100, 100) : 0;
  const rawPercentage = goalAmount > 0 ? (currentAmount / goalAmount) * 100 : 0;
  const remaining = Math.max(goalAmount - currentAmount, 0);

  let colorClass = 'bg-red-500';
  if (rawPercentage >= 100) colorClass = 'bg-green-500';
  else if (rawPercentage >= 80) colorClass = 'bg-yellow-500';

  return (
    <div className="w-full space-y-2">
      <div className="flex justify-between text-sm font-medium text-slate-600">
        <span>Progresso da Meta</span>
        <span className={rawPercentage >= 100 ? 'text-green-600' : 'text-slate-600'}>
          {rawPercentage.toFixed(1)}%
        </span>
      </div>
      
      <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden shadow-inner">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={`h-full ${colorClass} rounded-full relative`}
        >
          <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
        </motion.div>
      </div>

      <div className="flex justify-between items-center text-xs">
        <div className="text-slate-500">
          Atual: <span className="font-bold text-slate-700">R$ {currentAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
        </div>
        {remaining > 0 ? (
          <div className="text-slate-500">
            Falta: <span className="font-bold text-slate-700">R$ {remaining.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
          </div>
        ) : (
          <div className="text-green-600 font-bold flex items-center gap-1">
            Meta Atingida! 🎉
          </div>
        )}
      </div>
    </div>
  );
};

export default ProgressBar;
