import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, Eye, EyeOff, Bot, Key, Puzzle, BarChart3, Bell, RefreshCw, Activity, Palette } from 'lucide-react';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import TestChat from '@/components/TestChat';
import GoogleCalendarIntegration from '@/components/GoogleCalendarIntegration';
import SentimentAnalysis from '@/components/SentimentAnalysis';
import AlertsSettings from '@/components/AlertsSettings';
import ReminderTemplates from '@/components/ReminderTemplates';
import ActivityLogs from '@/components/ActivityLogs';
import ExportDataButton from '@/components/ExportDataButton';
import BrandingSettings from '@/components/BrandingSettings';

const ConfiguracoesAgente = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('settings');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const [aiInstructions, setAiInstructions] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [internalApiKey, setInternalApiKey] = useState('');

  useEffect(() => {
    if (user?.id) {
      fetchSettings();
    }
  }, [user]);

  const fetchSettings = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('agent_settings')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setAiInstructions(data.ai_instructions || '');
        const rawKey = data.api_key_encrypted || '';
        setInternalApiKey(rawKey);
        setApiKey(rawKey ? '••••••••••••••••' : '');
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApiKeyChange = (e) => {
    const value = e.target.value;
    setApiKey(value);
    setInternalApiKey(value);
  };

  const saveSettings = async () => {
    if (!user?.id) return;

    try {
      setSaving(true);

      const updateData = {
        user_id: user.id,
        ai_instructions: aiInstructions,
        updated_at: new Date().toISOString(),
      };

      if (apiKey && !apiKey.includes('•')) {
        updateData.api_key_encrypted = apiKey;
      }

      const { error } = await supabase
        .from('agent_settings')
        .upsert(updateData, { onConflict: 'user_id' });

      if (error) throw error;

      toast({
        title: 'Sucesso!',
        description: 'Configurações salvas com sucesso',
      });

      if (apiKey && !apiKey.includes('•')) {
        setApiKey('••••••••••••••••');
      }
      
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Falha ao salvar configurações.',
      });
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: 'settings', label: 'Geral & IA', icon: Bot },
    { id: 'branding', label: 'Marca', icon: Palette },
    { id: 'alerts', label: 'Alertas', icon: Bell },
    { id: 'reminders', label: 'Lembretes', icon: RefreshCw },
    { id: 'logs', label: 'Logs de Atividade', icon: Activity },
    { id: 'integrations', label: 'Integrações', icon: Puzzle },
    { id: 'analytics', label: 'Análise de Sentimento', icon: BarChart3 },
  ];

  return (
    <>
      <Helmet>
        <title>Configurações - SoloCEO</title>
      </Helmet>

      <div className="min-h-screen bg-slate-900">
        <Header />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4"
          >
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Configurações</h1>
              <p className="text-white/60">Gerencie sua IA, integrações e análises</p>
            </div>
            <ExportDataButton />
          </motion.div>

          {/* Navigation Tabs */}
          <div className="flex space-x-2 mb-8 overflow-x-auto pb-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-4 py-2.5 rounded-lg font-medium transition-all duration-200 whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-[#22c55e] text-white shadow-lg shadow-green-900/20'
                    : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                <tab.icon className="w-4 h-4 mr-2" />
                {tab.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Main Content Area - changes based on tab */}
            <div className={`${activeTab === 'logs' ? 'lg:col-span-12' : 'lg:col-span-7'} space-y-6 transition-all`}>
              <AnimatePresence mode="wait">
                {activeTab === 'settings' && (
                  <motion.div
                    key="settings"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    {/* AI Instructions */}
                    <div className="bg-white rounded-xl shadow-xl p-6">
                      <div className="flex items-center mb-4">
                        <Bot className="w-6 h-6 mr-3 text-[#22c55e]" />
                        <h2 className="text-xl font-bold text-gray-900">Instruções da IA</h2>
                      </div>
                      <p className="text-gray-600 mb-4 text-sm">
                        Defina a personalidade e regras de negócio da sua assistente virtual.
                      </p>
                      <textarea
                        value={aiInstructions}
                        onChange={(e) => setAiInstructions(e.target.value)}
                        placeholder="Ex: Você é a assistente virtual da Clínica Saúde. Agende apenas consultas. Seja cordial."
                        rows={10}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#22c55e] focus:border-transparent resize-none text-gray-900 text-sm"
                      />
                    </div>

                    {/* API Key */}
                    <div className="bg-white rounded-xl shadow-xl p-6">
                      <div className="flex items-center mb-4">
                        <Key className="w-6 h-6 mr-3 text-[#22c55e]" />
                        <h2 className="text-xl font-bold text-gray-900">Configuração OpenAI</h2>
                      </div>
                      <div className="relative">
                        <input
                          type={showApiKey ? 'text' : 'password'}
                          value={apiKey}
                          onChange={handleApiKeyChange}
                          placeholder="sk-..."
                          className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#22c55e] text-gray-900"
                        />
                        <button
                          type="button"
                          onClick={() => setShowApiKey(!showApiKey)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showApiKey ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>

                    <Button
                      onClick={saveSettings}
                      disabled={saving}
                      className="w-full bg-[#22c55e] hover:bg-[#16a34a] text-white py-6 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all"
                    >
                      <Save className="w-5 h-5 mr-2" />
                      {saving ? 'Salvando...' : 'Salvar Alterações'}
                    </Button>
                  </motion.div>
                )}

                {activeTab === 'branding' && (
                   <motion.div
                    key="branding"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <BrandingSettings />
                  </motion.div>
                )}

                {activeTab === 'alerts' && (
                  <motion.div
                    key="alerts"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <AlertsSettings />
                  </motion.div>
                )}

                {activeTab === 'reminders' && (
                  <motion.div
                    key="reminders"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ReminderTemplates />
                  </motion.div>
                )}
                
                {activeTab === 'logs' && (
                  <motion.div
                    key="logs"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ActivityLogs />
                  </motion.div>
                )}

                {activeTab === 'integrations' && (
                  <motion.div
                    key="integrations"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <GoogleCalendarIntegration />
                  </motion.div>
                )}

                {activeTab === 'analytics' && (
                  <motion.div
                    key="analytics"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <SentimentAnalysis />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Right Column: Always show Chat Test (Simulating the agent) - except on Logs view to give more space */}
            {activeTab !== 'logs' && (
              <div className="lg:col-span-5 h-full min-h-[500px]">
                <div className="sticky top-24 h-[600px] bg-white rounded-xl shadow-xl overflow-hidden border border-slate-700/50">
                  <div className="p-4 bg-slate-100 border-b border-slate-200">
                    <h3 className="font-semibold text-slate-700 flex items-center gap-2">
                      <Bot className="w-4 h-4 text-[#22c55e]" />
                      Simulador em Tempo Real
                    </h3>
                  </div>
                  <div className="h-[calc(100%-60px)]">
                    <TestChat systemPrompt={aiInstructions} apiKey={internalApiKey} />
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
};

export default ConfiguracoesAgente;
