import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, CheckCircle2, XCircle, RefreshCw, ExternalLink } from 'lucide-react';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const GoogleCalendarIntegration = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [lastSync, setLastSync] = useState(null);

  useEffect(() => {
    if (user?.id) {
      checkConnectionStatus();
    }
  }, [user]);

  const checkConnectionStatus = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') throw error;

      if (data && data.google_calendar_token) {
        setIsConnected(true);
        setLastSync(data.last_sync);
      } else {
        setIsConnected(false);
      }
    } catch (error) {
      console.error('Error checking calendar status:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async () => {
    setConnecting(true);
    
    // Simulate OAuth flow for this demo environment
    // In production, this would redirect to Google's OAuth URL
    try {
      // 1. Simulate getting auth code from Google (popup or redirect)
      await new Promise(resolve => setTimeout(resolve, 1500)); // Fake delay
      const mockAuthCode = "mock_auth_code_12345";

      // 2. Call Edge Function to exchange code for tokens
      const { data: result, error } = await supabase.functions.invoke('sync-google-calendar', {
        body: { 
          action: 'exchange_token',
          authCode: mockAuthCode, 
          userId: user.id 
        }
      });

      if (error) throw error;

      // 3. Store the mock tokens in user_settings
      const { error: dbError } = await supabase
        .from('user_settings')
        .upsert({
          user_id: user.id,
          google_calendar_id: 'primary',
          google_calendar_token: result.tokens.access_token,
          google_calendar_refresh_token: result.tokens.refresh_token,
          last_sync: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }, { onConflict: 'user_id' });

      if (dbError) throw dbError;

      setIsConnected(true);
      setLastSync(new Date().toISOString());
      toast({
        title: "Conectado!",
        description: "Google Calendar sincronizado com sucesso.",
      });

    } catch (error) {
      console.error("Connection error:", error);
      toast({
        variant: "destructive",
        title: "Erro na conexão",
        description: "Falha ao conectar com Google Calendar.",
      });
    } finally {
      setConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      setConnecting(true);
      const { error } = await supabase
        .from('user_settings')
        .delete()
        .eq('user_id', user.id);

      if (error) throw error;

      setIsConnected(false);
      setLastSync(null);
      toast({
        title: "Desconectado",
        description: "A integração foi removida.",
      });
    } catch (error) {
      console.error("Disconnect error:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Falha ao desconectar.",
      });
    } finally {
      setConnecting(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg p-6 border border-slate-100"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
            <Calendar className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">Google Calendar</h2>
            <p className="text-sm text-slate-500">Sincronize seus agendamentos automaticamente</p>
          </div>
        </div>
        {loading ? (
          <div className="w-24 h-8 bg-slate-100 animate-pulse rounded-full" />
        ) : (
          <div className={`px-4 py-1.5 rounded-full text-sm font-medium flex items-center gap-2 ${
            isConnected ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'
          }`}>
            {isConnected ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                Conectado
              </>
            ) : (
              <>
                <XCircle className="w-4 h-4" />
                Desconectado
              </>
            )}
          </div>
        )}
      </div>

      <div className="bg-slate-50 rounded-lg p-4 mb-6">
        <h3 className="text-sm font-semibold text-slate-700 mb-2">Como funciona:</h3>
        <ul className="space-y-2 text-sm text-slate-600">
          <li className="flex items-start gap-2">
            <span className="mt-1 w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
            A IA verifica sua disponibilidade antes de agendar.
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1 w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
            Novos agendamentos são adicionados automaticamente ao seu calendário.
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1 w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
            Cancelamentos no sistema removem o evento do Google Calendar.
          </li>
        </ul>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-slate-100">
        <div className="text-xs text-slate-400">
          {isConnected && lastSync && (
            <span className="flex items-center gap-1">
              <RefreshCw className="w-3 h-3" />
              Última sincronização: {new Date(lastSync).toLocaleString()}
            </span>
          )}
        </div>
        
        {isConnected ? (
          <Button 
            variant="destructive" 
            onClick={handleDisconnect}
            disabled={connecting}
            className="bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 border-none shadow-none"
          >
            {connecting ? 'Processando...' : 'Desconectar Conta'}
          </Button>
        ) : (
          <Button 
            onClick={handleConnect}
            disabled={connecting}
            className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200"
          >
            {connecting ? 'Conectando...' : 'Conectar Google Calendar'}
            {!connecting && <ExternalLink className="w-4 h-4 ml-2" />}
          </Button>
        )}
      </div>
    </motion.div>
  );
};

export default GoogleCalendarIntegration;
