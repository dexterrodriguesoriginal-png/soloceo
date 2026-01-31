import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Search, Plus, Users, Clock, Mail, TrendingUp } from 'lucide-react';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import Header from '@/components/Header';
import { useToast } from '@/components/ui/use-toast';
import KanbanBoard from '@/components/KanbanBoard';
import { Button } from '@/components/ui/button';
import ManualChatModal from '@/components/ManualChatModal';

const StatCard = ({ icon: Icon, label, value, colorClass }) => (
  <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center gap-4 hover:bg-white/10 transition-colors">
    <div className={`p-3 rounded-lg ${colorClass}`}>
      <Icon className="w-5 h-5 text-white" />
    </div>
    <div>
      <p className="text-white/60 text-xs uppercase tracking-wider font-semibold">{label}</p>
      <p className="text-2xl font-bold text-white">{value}</p>
    </div>
  </div>
);

const GestaoLeads = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [leads, setLeads] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLead, setSelectedLead] = useState(null);
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    needingFollowup: 0,
    sentToday: 0,
    avgPriority: 0
  });

  useEffect(() => {
    if (user?.id) {
      fetchLeads();
      setupRealtimeSubscription();
      fetchFollowupStats();
    }
  }, [user]);

  const fetchLeads = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setLeads(data || []);
      calculateStats(data || []);
    } catch (error) {
      console.error('Error fetching leads:', error);
      toast({ variant: 'destructive', title: 'Erro', description: 'Falha ao carregar leads.' });
    } finally {
      setLoading(false);
    }
  };

  const fetchFollowupStats = async () => {
    try {
      // Sent Today count
      const today = new Date().toISOString().split('T')[0];
      const { count } = await supabase
        .from('followup_messages')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .gte('sent_at', today);
      
      setStats(prev => ({ ...prev, sentToday: count || 0 }));
    } catch (e) {
      console.error(e);
    }
  };

  const calculateStats = (currentLeads) => {
    const total = currentLeads.length;
    const needingFollowup = currentLeads.filter(l => l.needs_followup).length;
    const totalPriority = currentLeads.reduce((acc, curr) => acc + (curr.priority_score || 0), 0);
    const avgPriority = total > 0 ? (totalPriority / total).toFixed(1) : 0;

    setStats(prev => ({
      ...prev,
      total,
      needingFollowup,
      avgPriority
    }));
  };

  const setupRealtimeSubscription = () => {
    const subscription = supabase
      .channel('leads_changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'leads',
        filter: `user_id=eq.${user.id}`
      }, (payload) => {
        if (payload.eventType === 'INSERT') {
          setLeads(prev => {
            const newList = [payload.new, ...prev];
            calculateStats(newList);
            return newList;
          });
        } else if (payload.eventType === 'UPDATE') {
          setLeads(prev => {
            const newList = prev.map(lead => lead.id === payload.new.id ? payload.new : lead);
            calculateStats(newList);
            return newList;
          });
        } else if (payload.eventType === 'DELETE') {
          setLeads(prev => {
            const newList = prev.filter(lead => lead.id !== payload.old.id);
            calculateStats(newList);
            return newList;
          });
        }
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  };

  const filteredLeads = searchTerm 
    ? leads.filter(lead => 
        lead.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        (lead.phone && lead.phone.includes(searchTerm))
      )
    : leads;

  const handleCreateTestLead = async () => {
    try {
      const { error } = await supabase.from('leads').insert({
        user_id: user.id,
        name: `Cliente Teste ${Math.floor(Math.random() * 100)}`,
        phone: `(11) 9${Math.floor(Math.random() * 10000)}-${Math.floor(Math.random() * 10000)}`,
        status: 'Interessado',
        notes: 'Lead criado para teste do Kanban',
        created_at: new Date().toISOString(),
        priority_score: 5 // Default for test
      });
      if (error) throw error;
      toast({ title: "Lead de teste criado!" });
    } catch (e) {
      console.error(e);
    }
  };

  const handleChatClick = (lead) => {
    setSelectedLead(lead);
    setIsChatModalOpen(true);
  };

  return (
    <>
      <Helmet>
        <title>Gestão de Leads - SoloCEO</title>
      </Helmet>

      <div className="min-h-screen bg-slate-900 flex flex-col">
        <Header />

        <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex flex-col">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6"
          >
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Pipeline de Vendas</h1>
              <p className="text-white/60">Arraste e solte para organizar seus leads</p>
            </div>
            
            <div className="flex items-center gap-3">
               <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Buscar lead..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:ring-2 focus:ring-[#22c55e] focus:border-transparent outline-none w-64 transition-all"
                />
              </div>
              <Button onClick={handleCreateTestLead} variant="outline" size="sm" className="hidden sm:flex border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white">
                <Plus className="w-4 h-4 mr-2" /> Novo Lead
              </Button>
            </div>
          </motion.div>

          {/* Stats Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
          >
            <StatCard 
              icon={Users} 
              label="Total de Leads" 
              value={stats.total} 
              colorClass="bg-blue-500" 
            />
            <StatCard 
              icon={Clock} 
              label="Precisa Follow-up" 
              value={stats.needingFollowup} 
              colorClass="bg-red-500" 
            />
            <StatCard 
              icon={Mail} 
              label="Enviados Hoje" 
              value={stats.sentToday} 
              colorClass="bg-purple-500" 
            />
            <StatCard 
              icon={TrendingUp} 
              label="Média Prioridade" 
              value={stats.avgPriority} 
              colorClass="bg-green-500" 
            />
          </motion.div>

          <div className="flex-1 min-h-[600px]">
            {loading ? (
              <div className="flex gap-6 h-full">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex-1 bg-slate-800/50 rounded-xl animate-pulse h-96"></div>
                ))}
              </div>
            ) : (
              <KanbanBoard 
                leads={filteredLeads} 
                setLeads={setLeads} 
                onChatClick={handleChatClick}
              />
            )}
          </div>
        </main>

        <ManualChatModal 
          isOpen={isChatModalOpen}
          onClose={() => setIsChatModalOpen(false)}
          lead={selectedLead}
        />
      </div>
    </>
  );
};

export default GestaoLeads;
