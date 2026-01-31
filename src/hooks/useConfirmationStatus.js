import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';

export const useConfirmationStatus = (scheduleId) => {
  const { user } = useAuth();
  const [status, setStatus] = useState('pending');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStatus = useCallback(async () => {
    if (!scheduleId || !user) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('schedules')
        .select('confirmation_status, confirmed_by_client, cancelled_by_client, cancellation_reason, reminder_24h_sent_at, reminder_2h_sent_at')
        .eq('id', scheduleId)
        .single();
        
      if (error) throw error;
      
      setStatus(data.confirmation_status || 'pending');
      return data;
    } catch (err) {
      setError(err);
      console.error('Error fetching status:', err);
    } finally {
      setLoading(false);
    }
  }, [scheduleId, user]);

  const fetchMessages = useCallback(async () => {
    if (!scheduleId || !user) return;
    
    try {
      const { data, error } = await supabase
        .from('confirmation_messages')
        .select('*')
        .eq('schedule_id', scheduleId)
        .order('sent_at', { ascending: true });
        
      if (error) throw error;
      setMessages(data || []);
    } catch (err) {
      console.error('Error fetching confirmation messages:', err);
    }
  }, [scheduleId, user]);

  useEffect(() => {
    if (scheduleId) {
      fetchStatus();
      fetchMessages();

      const subscription = supabase
        .channel(`confirmation-${scheduleId}`)
        .on('postgres_changes', { 
          event: 'UPDATE', 
          schema: 'public', 
          table: 'schedules', 
          filter: `id=eq.${scheduleId}`
        }, (payload) => {
          setStatus(payload.new.confirmation_status);
        })
        .subscribe();

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [scheduleId, fetchStatus, fetchMessages]);

  const updateConfirmationStatus = async (newStatus, reason = null) => {
    if (!scheduleId || !user) return false;
    
    try {
      const updateData = {
        confirmation_status: newStatus,
        updated_at: new Date().toISOString()
      };
      
      if (newStatus === 'confirmed') {
        updateData.confirmed_by_client = true;
        updateData.confirmation_received_at = new Date().toISOString();
        updateData.cancelled_by_client = false;
        updateData.status = 'confirmed'; // Update main status too
      } else if (newStatus === 'cancelled') {
        updateData.cancelled_by_client = true;
        updateData.cancellation_reason = reason;
        updateData.confirmed_by_client = false;
        updateData.status = 'cancelled'; // Update main status too
      } else if (newStatus === 'pending') {
         updateData.confirmed_by_client = false;
         updateData.cancelled_by_client = false;
         updateData.status = 'scheduled'; // Revert to scheduled
      }

      const { error } = await supabase
        .from('schedules')
        .update(updateData)
        .eq('id', scheduleId);
        
      if (error) throw error;
      
      setStatus(newStatus);
      return true;
    } catch (err) {
      setError(err);
      console.error('Error updating confirmation status:', err);
      return false;
    }
  };

  return {
    status,
    messages,
    loading,
    error,
    updateConfirmationStatus,
    getConfirmationMessages: fetchMessages,
    refreshStatus: fetchStatus
  };
};
