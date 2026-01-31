import { useState, useEffect } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useToast } from '@/components/ui/use-toast';

export const useAlerts = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;

    fetchAlerts();

    // Subscribe to new alerts
    const channel = supabase
      .channel('alerts-channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'alerts',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            // Only show unread alerts
            if (!payload.new.read) {
              setAlerts((prev) => [payload.new, ...prev]);
            }
          } else if (payload.eventType === 'UPDATE') {
            if (payload.new.read) {
              setAlerts((prev) => prev.filter((a) => a.id !== payload.new.id));
            } else {
              setAlerts((prev) =>
                prev.map((a) => (a.id === payload.new.id ? payload.new : a))
              );
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const fetchAlerts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('alerts')
        .select('*')
        .eq('user_id', user.id)
        .eq('read', false)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAlerts(data || []);
    } catch (error) {
      console.error('Error fetching alerts:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (alertId) => {
    try {
      const { error } = await supabase
        .from('alerts')
        .update({ read: true })
        .eq('id', alertId);

      if (error) throw error;
      setAlerts((prev) => prev.filter((a) => a.id !== alertId));
    } catch (error) {
      console.error('Error marking alert as read:', error);
    }
  };

  const createAlert = async (type, leadId, message) => {
    if (!user?.id) return;

    try {
      // Check user settings first
      const { data: settings } = await supabase
        .from('user_settings')
        .select(`alert_${type}`)
        .eq('user_id', user.id)
        .single();

      // If settings exist and the specific alert type is disabled, don't create it
      if (settings && settings[`alert_${type}`] === false) {
        return;
      }

      const { error } = await supabase.from('alerts').insert({
        user_id: user.id,
        lead_id: leadId,
        type,
        message,
      });

      if (error) throw error;
    } catch (error) {
      console.error('Error creating alert:', error);
    }
  };

  return {
    alerts,
    loading,
    markAsRead,
    createAlert,
    refreshAlerts: fetchAlerts,
  };
};
