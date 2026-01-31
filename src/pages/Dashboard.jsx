import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Users, DollarSign, TrendingUp, Store } from 'lucide-react';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import Header from '@/components/Header';
import FinancialModal from '@/components/FinancialModal';
import AlertBanner from '@/components/AlertBanner';
import { useAlerts } from '@/hooks/useAlerts';
import ConfirmationStats from '@/components/ConfirmationStats';

// Animated Number Component
const AnimatedNumber = ({ value, prefix = '', suffix = '' }) => {
  return (
    <motion.span
      key={value}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="inline-block"
    >
      {prefix}{value}{suffix}
    </motion.span>
  );
};

const Dashboard = () => {
  const { user, profile } = useAuth();
  const { alerts, markAsRead } = useAlerts();
  const [loading, setLoading] = useState(true);
  const [isFinancialModalOpen, setIsFinancialModalOpen] = useState(false);
  const [stats, setStats] = useState({
    todaySchedules: 0,
    weekLeads: 0,
    expectedRevenue: 0,
  });
  const [confirmationStats, setConfirmationStats] = useState({
    total: 0,
    confirmed: 0,
    pending: 0,
    cancelled: 0,
    history: []
  });
  const [companySettings, setCompanySettings] = useState(null);

  const fetchStats = async () => {
    if (!user?.id) return;

    try {
      // Fetch company name if not in profile (fallback to settings)
      const { data: settings } = await supabase
        .from('user_settings')
        .select('company_name')
        .eq('user_id', user.id)
        .maybeSingle();
      
      setCompanySettings(settings);

      // 1. Agendamentos Hoje (Count)
      const today = new Date().toISOString().split('T')[0];
      const { count: schedulesCount, error: schedulesError } = await supabase
        .from('schedules')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('date', today);

      if (schedulesError) throw schedulesError;

      // 2. Novos Leads (Count, last 7 days)
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      const { count: leadsCount, error: leadsError } = await supabase
        .from('leads')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('status', 'Interessado')
        .gte('created_at', weekAgo.toISOString());

      if (leadsError) throw leadsError;

      // 3. Faturamento Previsto (Sum, current month, confirmed/scheduled)
      const now = new Date();
      const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
      const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];

      const { data: revenueData, error: revenueError } = await supabase
        .from('schedules')
        .select('price')
        .eq('user_id', user.id)
        .in('status', ['confirmed', 'scheduled'])
        .gte('date', firstDay)
        .lte('date', lastDay);

      if (revenueError) throw revenueError;

      const revenue = (revenueData || []).reduce((sum, item) => sum + (parseFloat(item.price) || 0), 0);

      setStats({
        todaySchedules: schedulesCount || 0,
        weekLeads: leadsCount || 0,
        expectedRevenue: revenue,
      });

      // 4. Confirmation Stats (Month)
      const { data: monthSchedules, error: monthError } = await supabase
        .from('schedules')
        .select('confirmation_status, date')
        .eq('user_id', user.id)
        .gte('date', firstDay)
        .lte('date', lastDay);

      if (!monthError && monthSchedules) {
        setConfirmationStats({
          total: monthSchedules.length,
          confirmed: monthSchedules.filter(s => s.confirmation_status === 'confirmed').length,
          pending: monthSchedules.filter(s => ['pending', 'no_response'].includes(s.confirmation_status || 'pending')).length,
          cancelled: monthSchedules.filter(s => s.confirmation_status === 'cancelled').length,
          history: [] // Populate with real historical data if needed
        });
      }

    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchStats();

      // Realtime Subscriptions
      const channels = supabase.channel('dashboard-realtime')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'schedules', filter: `user_id=eq.${user.id}` },
          () => {
            fetchStats();
          }
        )
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'leads', filter: `user_id=eq.${user.id}` },
          () => {
            fetchStats();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channels);
      };
    }
  }, [user]);

  const cards = [
    {
      id: 'schedules',
      title: 'Agendamentos Hoje',
      value: stats.todaySchedules,
      isCurrency: false,
      icon: Calendar,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-500/10',
      onClick: null
    },
    {
      id: 'leads',
      title: 'Novos Leads (7 dias)',
      value: stats.weekLeads,
      isCurrency: false,
      icon: Users,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-500/10',
      onClick: null
    },
    {
      id: 'revenue',
      title: 'Faturamento Previsto',
      value: stats.expectedRevenue.toFixed(2),
      isCurrency: true,
      icon: DollarSign,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-500/10',
      onClick: () => setIsFinancialModalOpen(true),
      isClickable: true
    },
  ];

  // Safe access to display name with fallbacks
  const displayName = profile?.full_name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Empreendedor';
  const companyName = profile?.company_name || companySettings?.company_name;

  return (
    <>
      <Helmet>
        <title>Dashboard - SoloCEO</title>
        <meta name="description" content="Painel de controle do SoloCEO" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <Header />
        
        <AlertBanner alerts={alerts} onDismiss={markAsRead} />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8"
          >
            <div>
              <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-2">
                Olá, {displayName}! 👋
              </h1>
              <div className="flex items-center gap-2 text-white/60">
                 {companyName && (
                   <>
                    <Store className="w-4 h-4" />
                    <span className="font-medium">{companyName}</span>
                    <span>•</span>
                   </>
                 )}
                 <span>Visão geral do seu negócio em tempo real</span>
              </div>
            </div>
            
            {user?.email && (
              <div className="bg-white/5 rounded-lg px-4 py-2 border border-white/10 text-sm text-white/80">
                Logado como: <span className="font-mono text-[#22c55e]">{user.email}</span>
              </div>
            )}
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <AnimatePresence>
              {loading ? (
                [1, 2, 3].map((i) => (
                  <motion.div
                    key={`skeleton-${i}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="bg-white/5 rounded-xl p-6 animate-pulse"
                  >
                    <div className="flex justify-between items-start mb-4">
                       <div className="w-10 h-10 bg-white/10 rounded-xl"></div>
                       <div className="w-5 h-5 bg-white/10 rounded-full"></div>
                    </div>
                    <div className="h-4 w-1/2 bg-white/10 rounded mb-2"></div>
                    <div className="h-8 w-3/4 bg-white/10 rounded"></div>
                  </motion.div>
                ))
              ) : (
                cards.map((card, index) => (
                  <motion.div
                    key={card.id}
                    onClick={card.onClick}
                    initial={{ opacity: 0, y: 20, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    whileHover={{ 
                      scale: 1.02, 
                      translateY: -4,
                      boxShadow: card.isClickable ? "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)" : undefined
                    }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className={`bg-white rounded-xl shadow-xl p-6 border border-white/5 relative overflow-hidden group ${
                      card.isClickable ? 'cursor-pointer ring-offset-2 hover:ring-2 ring-purple-500/50' : ''
                    }`}
                  >
                    {/* Background decoration */}
                    <div className={`absolute -right-4 -top-4 w-24 h-24 rounded-full ${card.bgColor} blur-2xl group-hover:blur-3xl transition-all duration-500 opacity-50`}></div>

                    <div className="flex items-center justify-between mb-4 relative z-10">
                      <div className={`p-3 rounded-xl ${card.bgColor} transition-colors duration-300 group-hover:bg-opacity-80`}>
                        <card.icon className={`w-6 h-6 bg-gradient-to-br ${card.color} bg-clip-text text-transparent`} />
                      </div>
                      <TrendingUp className={`w-5 h-5 text-gray-400 transition-colors ${card.isClickable ? 'group-hover:text-purple-500' : 'group-hover:text-green-500'}`} />
                    </div>
                    
                    <div className="flex items-center justify-between relative z-10">
                      <h3 className="text-gray-500 text-sm font-semibold uppercase tracking-wider mb-1">{card.title}</h3>
                      {card.isClickable && (
                        <span className="text-xs text-purple-600 font-medium bg-purple-50 px-2 py-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                          Ver detalhes
                        </span>
                      )}
                    </div>
                    
                    <div className="text-3xl font-bold text-gray-900 relative z-10 flex items-baseline mt-1">
                      <AnimatedNumber 
                        value={card.value} 
                        prefix={card.isCurrency ? 'R$ ' : ''} 
                      />
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>

          <ConfirmationStats stats={confirmationStats} />
        </main>

        <FinancialModal 
          isOpen={isFinancialModalOpen}
          onClose={() => setIsFinancialModalOpen(false)}
          userId={user?.id}
        />
      </div>
    </>
  );
};

export default Dashboard;
