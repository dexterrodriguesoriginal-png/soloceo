import { useState, useCallback } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';

export const useFollowup = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchLeadsNeedingFollowup = useCallback(async () => {
    if (!user?.id) return [];
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .eq('user_id', user.id)
        .eq('needs_followup', true);

      if (error) throw error;
      return data;
    } catch (err) {
      setError(err);
      console.error('Error fetching leads needing followup:', err);
      return [];
    } finally {
      setLoading(false);
    }
  }, [user]);

  const sendFollowupMessage = async (leadId, message) => {
    if (!user?.id) return false;

    setLoading(true);
    try {
      // 1. Insert message record
      const { error: msgError } = await supabase
        .from('followup_messages')
        .insert({
          lead_id: leadId,
          user_id: user.id,
          message: message,
          sent_at: new Date().toISOString()
        });

      if (msgError) throw msgError;

      // 2. Update lead status
      const { error: leadError } = await supabase
        .from('leads')
        .update({
          needs_followup: false,
          followup_sent: true,
          last_followup_at: new Date().toISOString(),
          last_interaction_at: new Date().toISOString() // sending a msg counts as interaction
        })
        .eq('id', leadId);

      if (leadError) throw leadError;

      return true;
    } catch (err) {
      setError(err);
      console.error('Error sending followup:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const getFollowupHistory = useCallback(async (leadId) => {
    if (!user?.id) return [];

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('followup_messages')
        .select('*')
        .eq('lead_id', leadId)
        .order('sent_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (err) {
      setError(err);
      console.error('Error fetching followup history:', err);
      return [];
    } finally {
      setLoading(false);
    }
  }, [user]);

  return {
    loading,
    error,
    fetchLeadsNeedingFollowup,
    sendFollowupMessage,
    getFollowupHistory
  };
};
