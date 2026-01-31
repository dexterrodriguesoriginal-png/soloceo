import React, { useState, useEffect } from 'react';
import { Save, AlertCircle, Eye, RefreshCw } from 'lucide-react';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox'; 
import { Label } from '@/components/ui/label';

const ReminderTemplates = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [enabled, setEnabled] = useState(true);
  const [template24h, setTemplate24h] = useState('');
  const [template2h, setTemplate2h] = useState('');

  useEffect(() => {
    if (user) fetchSettings();
  }, [user]);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('agent_settings')
        .select('reminder_24h_template, reminder_2h_template, automatic_reminders_enabled')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setTemplate24h(data.reminder_24h_template || 'Olá [NOME], confirmando seu horário de [SERVIÇO] para amanhã às [HORA].');
        setTemplate2h(data.reminder_2h_template || 'Oi [NOME]! Seu horário de [SERVIÇO] é daqui a pouco, às [HORA].');
        setEnabled(data.automatic_reminders_enabled ?? true);
      } else {
        // Defaults if no settings exist
        setTemplate24h('Olá [NOME], confirmando seu horário de [SERVIÇO] para amanhã às [HORA].');
        setTemplate2h('Oi [NOME]! Seu horário de [SERVIÇO] é daqui a pouco, às [HORA].');
        setEnabled(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const { error } = await supabase
        .from('agent_settings')
        .upsert({
          user_id: user.id,
          reminder_24h_template: template24h,
          reminder_2h_template: template2h,
          automatic_reminders_enabled: enabled,
          updated_at: new Date().toISOString()
        }, { onConflict: 'user_id' });

      if (error) throw error;
      toast({ title: "Configurações salvas com sucesso!" });
    } catch (err) {
      toast({ variant: "destructive", title: "Erro ao salvar", description: err.message });
    } finally {
      setSaving(false);
    }
  };

  const getPreview = (text) => {
    return text
      .replace('[NOME]', 'Maria Silva')
      .replace('[DATA]', '30/01/2026')
      .replace('[HORA]', '14:30')
      .replace('[SERVIÇO]', 'Limpeza de Pele');
  };

  return (
    <div className="bg-white rounded-xl shadow-xl p-6 space-y-6">
      <div className="flex justify-between items-center border-b border-gray-100 pb-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 flex items-center">
            <RefreshCw className="w-5 h-5 mr-2 text-[#22c55e]" />
            Lembretes Automáticos
          </h2>
          <p className="text-sm text-gray-500">Configure as mensagens de confirmação enviadas aos clientes.</p>
        </div>
        <div className="flex items-center space-x-2">
           <Checkbox 
             id="auto-reminders"
             checked={enabled}
             onCheckedChange={setEnabled}
           />
           <label htmlFor="auto-reminders" className="text-sm font-medium text-gray-700">Ativar Envios</label>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 flex gap-2 text-sm text-blue-800">
        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
        <p>Use os códigos: <strong>[NOME]</strong>, <strong>[DATA]</strong>, <strong>[HORA]</strong>, <strong>[SERVIÇO]</strong> para personalizar.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 24h Template */}
        <div className="space-y-3">
          <Label className="font-semibold text-gray-700">Lembrete de 24 Horas (Véspera)</Label>
          <textarea
            value={template24h}
            onChange={(e) => setTemplate24h(e.target.value)}
            rows={4}
            disabled={!enabled}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#22c55e] text-sm"
          />
          <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
            <p className="text-xs text-gray-500 uppercase font-bold mb-1 flex items-center"><Eye className="w-3 h-3 mr-1"/> Pré-visualização:</p>
            <p className="text-sm text-gray-700 italic">"{getPreview(template24h)}"</p>
          </div>
        </div>

        {/* 2h Template */}
        <div className="space-y-3">
          <Label className="font-semibold text-gray-700">Lembrete de 2 Horas (Urgente)</Label>
          <textarea
            value={template2h}
            onChange={(e) => setTemplate2h(e.target.value)}
            rows={4}
            disabled={!enabled}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#22c55e] text-sm"
          />
          <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
            <p className="text-xs text-gray-500 uppercase font-bold mb-1 flex items-center"><Eye className="w-3 h-3 mr-1"/> Pré-visualização:</p>
            <p className="text-sm text-gray-700 italic">"{getPreview(template2h)}"</p>
          </div>
        </div>
      </div>

      <Button 
        onClick={handleSave} 
        disabled={saving || loading}
        className="w-full bg-[#22c55e] hover:bg-[#16a34a] text-white"
      >
        <Save className="w-4 h-4 mr-2" />
        {saving ? 'Salvando...' : 'Salvar Modelos'}
      </Button>
    </div>
  );
};

export default ReminderTemplates;
