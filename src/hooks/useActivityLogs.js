import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/customSupabaseClient';

export const useActivityLogs = ({ userId, leadId, actionType, dateRange } = {}) => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLogs = useCallback(async () => {
    if (!userId) return;

    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('activity_logs')
        .select(`
          *,
          leads (
            name,
            phone
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (leadId) {
        query = query.eq('lead_id', leadId);
      }

      if (actionType && actionType !== 'all') {
        query = query.eq('action_type', actionType);
      }

      if (dateRange) {
        const now = new Date();
        let startDate = new Date();
        
        if (dateRange === '24h') {
          startDate.setHours(now.getHours() - 24);
        } else if (dateRange === '48h') {
          startDate.setHours(now.getHours() - 48);
        } else if (dateRange === '7d') {
          startDate.setDate(now.getDate() - 7);
        }
        
        query = query.gte('created_at', startDate.toISOString());
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;
      setLogs(data || []);

    } catch (err) {
      console.error('Error fetching activity logs:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [userId, leadId, actionType, dateRange]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  return { logs, loading, error, refetch: fetchLogs };
};
