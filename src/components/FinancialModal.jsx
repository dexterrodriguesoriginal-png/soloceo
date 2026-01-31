import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Target, Receipt, Save, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import ProgressBar from '@/components/ProgressBar';
import FinancialTable from '@/components/FinancialTable';

const FinancialModal = ({ isOpen, onClose, userId }) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [schedules, setSchedules] = useState([]);
  const [monthlyGoal, setMonthlyGoal] = useState(0);
  const [tempGoal, setTempGoal] = useState('');
  const [isSavingGoal, setIsSavingGoal] = useState(false);

  // Fetch initial data
  useEffect(() => {
    if (isOpen && userId) {
      fetchData();
      
      // Setup realtime subscription for schedules
      const schedulesSubscription = supabase
        .channel('financial-modal-schedules')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'schedules', filter: `user_id=eq.${userId}` },
          () => fetchData() // Re-fetch on any schedule change
        )
        .subscribe();

      return () => {
        supabase.removeChannel(schedulesSubscription);
      };
    }
  }, [isOpen, userId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      const now = new Date();
      const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
      const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];

      // 1. Fetch confirmed schedules for current month
      const { data: schedulesData, error: schedulesError } = await supabase
        .from('schedules')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'confirmed') // Only confirmed for detailed financial view
        .gte('date', firstDay)
        .lte('date', lastDay)
        .order('date', { ascending: true });

      if (schedulesError) throw schedulesError;

      // 2. Fetch user settings for monthly goal
      const { data: settingsData, error: settingsError } = await supabase
        .from('user_settings')
        .select('monthly_goal')
        .eq('user_id', userId)
        .maybeSingle();

      if (settingsError && settingsError.code !== 'PGRST116') throw settingsError;

      setSchedules(schedulesData || []);
      const goal = settingsData?.monthly_goal || 0;
      setMonthlyGoal(goal);
      setTempGoal(goal.toString());

    } catch (error) {
      console.error('Error fetching financial data:', error);
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Não foi possível carregar os dados financeiros.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateGoal = async () => {
    try {
      setIsSavingGoal(true);
      const newGoal = parseFloat(tempGoal);
      
      if (isNaN(newGoal) || newGoal < 0) {
        toast({
          variant: 'destructive',
          title: 'Valor inválido',
          description: 'Por favor, insira um valor numérico positivo.'
        });
        return;
      }

      const { error } = await supabase
        .from('user_settings')
        .upsert({ 
          user_id: userId, 
          monthly_goal: newGoal,
          updated_at: new Date().toISOString()
        }, { onConflict: 'user_id' });

      if (error) throw error;

      setMonthlyGoal(newGoal);
      toast({
        title: 'Meta atualizada!',
        description: 'Sua meta mensal foi salva com sucesso.'
      });
    } catch (error) {
      console.error('Error updating goal:', error);
      toast({
        variant: 'destructive',
        title: 'Erro ao salvar',
        description: 'Não foi possível atualizar a meta.'
      });
    } finally {
      setIsSavingGoal(false);
    }
  };

  const currentRevenue = schedules.reduce((acc, curr) => acc + (Number(curr.price) || 0), 0);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-[#1e293b]/80 backdrop-blur-sm transition-opacity"
        />

        {/* Modal Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                <Target className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-800">Gestão Financeira</h2>
                <p className="text-sm text-slate-500">Acompanhe seus resultados do mês</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-8">
            {/* Section: Monthly Goal */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2">
                  <Target className="w-4 h-4 text-slate-500" /> Meta Mensal
                </h3>
                
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-500 mr-2">Definir Meta:</span>
                  <div className="relative group">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">R$</span>
                    <input
                      type="number"
                      value={tempGoal}
                      onChange={(e) => setTempGoal(e.target.value)}
                      className="w-32 pl-9 pr-3 py-1.5 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                      placeholder="0.00"
                    />
                  </div>
                  <Button 
                    size="sm"
                    onClick={handleUpdateGoal}
                    disabled={isSavingGoal}
                    className="h-8 w-8 p-0 bg-green-600 hover:bg-green-700"
                  >
                    {isSavingGoal ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
                  </Button>
                </div>
              </div>

              <div className="bg-slate-50 p-5 rounded-xl border border-slate-100">
                <ProgressBar currentAmount={currentRevenue} goalAmount={monthlyGoal} />
              </div>
            </div>

            {/* Section: Services List */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2">
                <Receipt className="w-4 h-4 text-slate-500" /> Listagem de Serviços
              </h3>
              
              <FinancialTable schedules={schedules} loading={loading} />
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex justify-end">
            <Button variant="outline" onClick={onClose} className="border-slate-200 hover:bg-slate-100 text-slate-700">
              Fechar
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default FinancialModal;
