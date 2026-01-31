import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Calendar as CalendarIcon, Clock, User, Save, CheckCircle2, XCircle, AlertCircle, HelpCircle } from 'lucide-react';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import ConfirmationModal from '@/components/ConfirmationModal';

const AgendaInteligente = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [schedules, setSchedules] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [workingHours, setWorkingHours] = useState({
    monday: { start: '09:00', end: '18:00', enabled: true },
    tuesday: { start: '09:00', end: '18:00', enabled: true },
    wednesday: { start: '09:00', end: '18:00', enabled: true },
    thursday: { start: '09:00', end: '18:00', enabled: true },
    friday: { start: '09:00', end: '18:00', enabled: true },
    saturday: { start: '09:00', end: '13:00', enabled: false },
    sunday: { start: '09:00', end: '13:00', enabled: false },
  });

  useEffect(() => {
    if (user?.id) {
      fetchSchedules();
      fetchWorkingHours();

      const sub = supabase.channel('agenda-realtime')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'schedules' }, () => {
          fetchSchedules();
        }).subscribe();

      return () => {
        sub.unsubscribe();
      }
    }
  }, [user]);

  const fetchSchedules = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('schedules')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: true });

      if (error) throw error;
      setSchedules(data || []);
    } catch (error) {
      console.error('Error fetching schedules:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchWorkingHours = async () => {
    if (!user?.id) return;

    try {
      const { data, error } = await supabase
        .from('agent_settings')
        .select('working_hours')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;

      if (data?.working_hours) {
        setWorkingHours(data.working_hours);
      }
    } catch (error) {
      console.error('Error fetching working hours:', error);
    }
  };

  const saveWorkingHours = async () => {
    if (!user?.id) return;

    try {
      const { error } = await supabase
        .from('agent_settings')
        .upsert({
          user_id: user.id,
          working_hours: workingHours,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'user_id' });

      if (error) throw error;

      // Log activity
      await supabase.functions.invoke('log-activity', {
        body: {
          user_id: user.id,
          action_type: 'schedule',
          description: 'Horários de trabalho atualizados',
          executed_by: 'user',
          details: { updated_hours: workingHours }
        }
      });

      toast({
        title: 'Sucesso!',
        description: 'Horários de trabalho salvos com sucesso',
      });
    } catch (error) {
      console.error('Error saving working hours:', error);
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Falha ao salvar horários de trabalho',
      });
    }
  };

  const getEventStyle = (status) => {
    switch(status) {
      case 'confirmed': return 'bg-green-100 border-green-500 text-green-900';
      case 'cancelled': return 'bg-red-100 border-red-500 text-red-900';
      case 'no_response': return 'bg-orange-100 border-orange-500 text-orange-900';
      default: return 'bg-yellow-100 border-yellow-500 text-yellow-900'; // pending
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'confirmed': return <CheckCircle2 className="w-4 h-4 text-green-600" />;
      case 'cancelled': return <XCircle className="w-4 h-4 text-red-600" />;
      case 'no_response': return <AlertCircle className="w-4 h-4 text-orange-600" />;
      default: return <HelpCircle className="w-4 h-4 text-yellow-600" />;
    }
  };

  const selectedDateSchedules = schedules.filter(
    (schedule) => schedule.date === selectedDate.toISOString().split('T')[0]
  );

  const daysOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const dayNames = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

  return (
    <>
      <Helmet>
        <title>Agenda Inteligente - SoloCEO</title>
        <meta name="description" content="Gerencie seus agendamentos" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <Header />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl font-bold text-white mb-2">Agenda Inteligente</h1>
            <p className="text-white/60 mb-8">Visualize e gerencie seus agendamentos e confirmações</p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Calendar Section */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white rounded-xl shadow-xl p-6"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <CalendarIcon className="w-5 h-5 mr-2 text-[#22c55e]" />
                Calendário
              </h2>

              <div className="space-y-4">
                <input
                  type="date"
                  value={selectedDate.toISOString().split('T')[0]}
                  onChange={(e) => setSelectedDate(new Date(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#22c55e] focus:border-transparent text-gray-900"
                />

                {loading ? (
                  <div className="animate-pulse space-y-2">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-20 bg-gray-200 rounded-lg"></div>
                    ))}
                  </div>
                ) : selectedDateSchedules.length > 0 ? (
                  <div className="space-y-3">
                    {selectedDateSchedules.map((schedule) => (
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        key={schedule.id}
                        onClick={() => setSelectedSchedule(schedule)}
                        className={`border-l-4 p-4 rounded-lg cursor-pointer transition-all shadow-sm ${getEventStyle(schedule.confirmation_status || 'pending')}`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <User className="w-5 h-5 opacity-70" />
                            <div>
                              <p className="font-semibold">{schedule.client_name}</p>
                              <p className="text-sm opacity-80 flex items-center">
                                <Clock className="w-3 h-3 mr-1" />
                                {schedule.start_time.substring(0, 5)} - {schedule.end_time.substring(0, 5)}
                              </p>
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-1">
                            <span className="px-2 py-0.5 bg-white/50 text-xs font-bold rounded-full">
                              {schedule.duration} min
                            </span>
                            <div className="flex items-center gap-1 text-xs font-medium" title={`Status: ${schedule.confirmation_status}`}>
                              {getStatusIcon(schedule.confirmation_status || 'pending')}
                              <span className="capitalize">{schedule.confirmation_status === 'no_response' ? 'Sem Resp.' : schedule.confirmation_status || 'Pendente'}</span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <CalendarIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>Nenhum agendamento para esta data</p>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Working Hours Section */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white rounded-xl shadow-xl p-6"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <Clock className="w-5 h-5 mr-2 text-[#22c55e]" />
                Horários de Trabalho
              </h2>

              <div className="space-y-3">
                {daysOfWeek.map((day, index) => (
                  <div key={day} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <input
                      type="checkbox"
                      checked={workingHours[day]?.enabled}
                      onChange={(e) =>
                        setWorkingHours({
                          ...workingHours,
                          [day]: { ...workingHours[day], enabled: e.target.checked },
                        })
                      }
                      className="w-5 h-5 text-[#22c55e] rounded focus:ring-[#22c55e]"
                    />
                    <span className="w-24 text-sm font-medium text-gray-700">{dayNames[index]}</span>
                    <input
                      type="time"
                      value={workingHours[day]?.start}
                      onChange={(e) =>
                        setWorkingHours({
                          ...workingHours,
                          [day]: { ...workingHours[day], start: e.target.value },
                        })
                      }
                      disabled={!workingHours[day]?.enabled}
                      className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#22c55e] text-gray-900"
                    />
                    <span className="text-gray-500">às</span>
                    <input
                      type="time"
                      value={workingHours[day]?.end}
                      onChange={(e) =>
                        setWorkingHours({
                          ...workingHours,
                          [day]: { ...workingHours[day], end: e.target.value },
                        })
                      }
                      disabled={!workingHours[day]?.enabled}
                      className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#22c55e] text-gray-900"
                    />
                  </div>
                ))}
              </div>

              <Button
                onClick={saveWorkingHours}
                className="w-full mt-6 bg-[#22c55e] hover:bg-[#16a34a] text-white py-6 rounded-xl font-semibold transition-all duration-300"
              >
                <Save className="w-5 h-5 mr-2" />
                Salvar Horários
              </Button>
            </motion.div>
          </div>
        </main>
        
        <ConfirmationModal 
          isOpen={!!selectedSchedule} 
          onClose={() => setSelectedSchedule(null)}
          schedule={selectedSchedule}
        />
      </div>
    </>
  );
};

export default AgendaInteligente;
