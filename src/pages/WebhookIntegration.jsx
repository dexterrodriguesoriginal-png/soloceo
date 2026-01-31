import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Copy, CheckCircle, AlertCircle, Webhook, Activity } from 'lucide-react';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const WebhookIntegration = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [webhookEvents, setWebhookEvents] = useState([]);
  
  const webhookUrl = `${import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co'}/functions/v1/whatsapp-webhook`;

  useEffect(() => {
    if (user?.id) {
      fetchWebhookEvents();
    }
  }, [user]);

  const fetchWebhookEvents = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('webhooks')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setWebhookEvents(data || []);
    } catch (error) {
      console.error('Error fetching webhook events:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(webhookUrl);
    setCopied(true);
    toast({
      title: 'Copiado!',
      description: 'URL do webhook copiada para a área de transferência',
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <Helmet>
        <title>Integração Webhook - SoloCEO</title>
        <meta name="description" content="Configure a integração com WhatsApp" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <Header />

        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl font-bold text-white mb-2">Integração Webhook</h1>
            <p className="text-white/60 mb-8">Configure a conexão com seu bot do WhatsApp</p>
          </motion.div>

          <div className="space-y-6">
            {/* Webhook URL */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white rounded-xl shadow-xl p-6"
            >
              <div className="flex items-center mb-4">
                <Webhook className="w-6 h-6 mr-3 text-[#22c55e]" />
                <h2 className="text-xl font-bold text-gray-900">URL do Webhook</h2>
              </div>
              <p className="text-gray-600 mb-4">
                Use esta URL para conectar sua API de WhatsApp ao SoloCEO
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={webhookUrl}
                  readOnly
                  className="flex-1 px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 font-mono text-sm"
                />
                <Button
                  onClick={copyToClipboard}
                  className="bg-[#22c55e] hover:bg-[#16a34a] text-white px-6 rounded-xl"
                >
                  {copied ? <CheckCircle className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                </Button>
              </div>
            </motion.div>

            {/* Integration Instructions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white rounded-xl shadow-xl p-6"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-4">Como Integrar</h2>
              <ol className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="flex-shrink-0 w-6 h-6 bg-[#22c55e] text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
                    1
                  </span>
                  <span>Copie a URL do webhook acima</span>
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 w-6 h-6 bg-[#22c55e] text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
                    2
                  </span>
                  <span>Acesse as configurações do seu serviço de bot do WhatsApp</span>
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 w-6 h-6 bg-[#22c55e] text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
                    3
                  </span>
                  <span>Cole a URL no campo de webhook de mensagens recebidas</span>
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 w-6 h-6 bg-[#22c55e] text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
                    4
                  </span>
                  <span>Configure o método como POST e salve as alterações</span>
                </li>
              </ol>
            </motion.div>

            {/* Webhook Status */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-white rounded-xl shadow-xl p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <Activity className="w-6 h-6 mr-3 text-[#22c55e]" />
                  <h2 className="text-xl font-bold text-gray-900">Status do Webhook</h2>
                </div>
                <div className="flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Ativo
                </div>
              </div>
            </motion.div>

            {/* Recent Events */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-white rounded-xl shadow-xl p-6"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-4">Eventos Recentes</h2>
              {loading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-16 bg-gray-200 rounded-lg animate-pulse"></div>
                  ))}
                </div>
              ) : webhookEvents.length > 0 ? (
                <div className="space-y-3">
                  {webhookEvents.map((event) => (
                    <div
                      key={event.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div>
                        <p className="font-medium text-gray-900">{event.event_type}</p>
                        <p className="text-sm text-gray-600">
                          {new Date(event.created_at).toLocaleString('pt-BR')}
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          event.status === 'received'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {event.status}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <AlertCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>Nenhum evento registrado ainda</p>
                  <p className="text-sm mt-1">Os eventos aparecerão aqui quando mensagens forem recebidas</p>
                </div>
              )}
            </motion.div>
          </div>
        </main>
      </div>
    </>
  );
};

export default WebhookIntegration;
