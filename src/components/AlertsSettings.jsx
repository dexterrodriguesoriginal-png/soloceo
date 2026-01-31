import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bell, Save, Loader2, AlertTriangle, MessageSquare as MessageSquareX, CalendarX2 } from 'lucide-react';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

const AlertsSettings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    alert_frustrated: true,
    alert_unconfident: true,
    alert_conflict: true
  });

  useEffect(() => {
    if (user?.id) {
      fetchSettings();
    }
  }, [user]);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('user_settings')
        .select('alert_frustrated, alert_unconfident, alert_conflict')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setSettings({
          alert_frustrated: data.alert_frustrated ?? true,
          alert_unconfident: data.alert_unconfident ?? true,
          alert_conflict: data.alert_conflict ?? true
        });
      }
    } catch (error) {
      console.error('Error fetching alert settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user?.id) return;
    try {
      setSaving(true);
      const { error } = await supabase
        .from('user_settings')
        .upsert({
          user_id: user.id,
          ...settings,
          updated_at: new Date().toISOString()
        }, { onConflict: 'user_id' });

      if (error) throw error;

      toast({
        title: 'Preferências salvas',
        description: 'Suas configurações de alerta foram atualizadas.',
      });
    } catch (error) {
      console.error('Error saving alert settings:', error);
      toast({
        variant: 'destructive',
        title: 'Erro ao salvar',
        description: 'Não foi possível atualizar as configurações.',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = (key) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  if (loading) {
    return <div className="p-8 text-center text-slate-500">Carregando configurações...</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg p-6 border border-slate-100"
    >
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center">
          <Bell className="w-6 h-6 text-red-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-800">Alertas Críticos</h2>
          <p className="text-sm text-slate-500">Escolha quando você quer ser notificado imediatamente</p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex items-start space-x-4 p-4 rounded-lg bg-slate-50 border border-slate-100 transition-colors hover:bg-slate-100">
          <div className="pt-1">
             <AlertTriangle className="w-5 h-5 text-orange-500" />
          </div>
          <div className="flex-1 space-y-1">
            <Label htmlFor="alert_frustrated" className="font-semibold text-slate-700 cursor-pointer">
              Cliente Frustrado
            </Label>
            <p className="text-sm text-slate-500">
              Notificar quando a análise de sentimento detectar raiva ou insatisfação nas mensagens.
            </p>
          </div>
          <Checkbox 
            id="alert_frustrated" 
            checked={settings.alert_frustrated}
            onCheckedChange={() => handleToggle('alert_frustrated')}
            className="data-[state=checked]:bg-red-500 data-[state=checked]:border-red-500"
          />
        </div>

        <div className="flex items-start space-x-4 p-4 rounded-lg bg-slate-50 border border-slate-100 transition-colors hover:bg-slate-100">
          <div className="pt-1">
             <MessageSquareX className="w-5 h-5 text-yellow-500" />
          </div>
          <div className="flex-1 space-y-1">
            <Label htmlFor="alert_unconfident" className="font-semibold text-slate-700 cursor-pointer">
              IA Insegura
            </Label>
            <p className="text-sm text-slate-500">
              Notificar quando a IA não tiver certeza sobre como responder a uma pergunta do cliente.
            </p>
          </div>
          <Checkbox 
            id="alert_unconfident" 
            checked={settings.alert_unconfident}
            onCheckedChange={() => handleToggle('alert_unconfident')}
            className="data-[state=checked]:bg-yellow-500 data-[state=checked]:border-yellow-500"
          />
        </div>

        <div className="flex items-start space-x-4 p-4 rounded-lg bg-slate-50 border border-slate-100 transition-colors hover:bg-slate-100">
          <div className="pt-1">
             <CalendarX2 className="w-5 h-5 text-red-500" />
          </div>
          <div className="flex-1 space-y-1">
            <Label htmlFor="alert_conflict" className="font-semibold text-slate-700 cursor-pointer">
              Conflito de Agenda
            </Label>
            <p className="text-sm text-slate-500">
              Notificar quando houver tentativa de agendamento em horário já ocupado ou indisponível.
            </p>
          </div>
          <Checkbox 
            id="alert_conflict" 
            checked={settings.alert_conflict}
            onCheckedChange={() => handleToggle('alert_conflict')}
            className="data-[state=checked]:bg-red-500 data-[state=checked]:border-red-500"
          />
        </div>
      </div>

      <div className="pt-6 mt-6 border-t border-slate-100">
        <Button 
          onClick={handleSave} 
          disabled={saving}
          className="w-full sm:w-auto bg-slate-800 hover:bg-slate-900 text-white"
        >
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Salvando...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" /> Salvar Preferências
            </>
          )}
        </Button>
      </div>
    </motion.div>
  );
};

export default AlertsSettings;
