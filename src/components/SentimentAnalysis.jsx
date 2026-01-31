import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Brain, Search, MessageSquare, TrendingUp, AlertCircle } from 'lucide-react';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useAlerts } from '@/hooks/useAlerts';

const COLORS = ['#22c55e', '#64748b', '#ef4444']; // Green, Slate, Red

const SentimentAnalysis = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { createAlert } = useAlerts();
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState(null);

  useEffect(() => {
    if (user?.id) {
      fetchLatestAnalysis();
    }
  }, [user]);

  const fetchLatestAnalysis = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('sentiment_analysis')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      setAnalysis(data);
    } catch (error) {
      console.error('Error fetching analysis:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyze = async () => {
    try {
      setAnalyzing(true);
      
      const { data: messages, error: msgError } = await supabase
        .from('chat_history')
        .select('message')
        .eq('user_id', user.id)
        .eq('sender', 'user')
        .order('created_at', { ascending: false })
        .limit(50);

      if (msgError) throw msgError;

      if (!messages || messages.length === 0) {
        toast({
          title: "Sem dados",
          description: "Não há conversas suficientes para analisar.",
          variant: "destructive"
        });
        return;
      }

      const { data: result, error: funcError } = await supabase.functions.invoke('analyze-sentiment', {
        body: { messages }
      });

      if (funcError) throw funcError;

      const { data: savedData, error: saveError } = await supabase
        .from('sentiment_analysis')
        .insert({
          user_id: user.id,
          positive_count: result.positive_count,
          neutral_count: result.neutral_count,
          negative_count: result.negative_count,
          key_phrases: result.key_phrases,
          summary: result.summary,
        })
        .select()
        .single();

      if (saveError) throw saveError;

      // Check for alert conditions (High Negative Count)
      if (result.negative_count > 0) {
        // Find recent messages with negative keywords for context (mock logic)
        // In real app, AI would identify the specific frustrated lead/message
        const frustratedMessage = messages.find(m => 
          m.message.toLowerCase().includes('ruim') || 
          m.message.toLowerCase().includes('não') ||
          m.message.toLowerCase().includes('caro')
        );

        if (frustratedMessage) {
           await createAlert(
             'frustrated', 
             null, // No specific lead ID linked in this aggregate view, or pass if available
             `Análise detectou frustração recente: "${frustratedMessage.message.substring(0, 50)}..."`
           );
        }
      }

      setAnalysis(savedData);
      toast({
        title: "Análise concluída",
        description: "Novos insights gerados com sucesso!",
      });

    } catch (error) {
      console.error("Analysis failed:", error);
      toast({
        variant: "destructive",
        title: "Erro na análise",
        description: "Não foi possível processar os dados.",
      });
    } finally {
      setAnalyzing(false);
    }
  };

  const chartData = analysis ? [
    { name: 'Positivo', value: analysis.positive_count },
    { name: 'Neutro', value: analysis.neutral_count },
    { name: 'Negativo', value: analysis.negative_count },
  ] : [];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg p-6 border border-slate-100"
    >
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center">
            <Brain className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">Análise de Sentimento</h2>
            <p className="text-sm text-slate-500">Entenda o comportamento dos seus leads com IA</p>
          </div>
        </div>
        <Button 
          onClick={handleAnalyze} 
          disabled={analyzing}
          className="bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-200"
        >
          {analyzing ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
              Analisando...
            </>
          ) : (
            <>
              <Search className="w-4 h-4 mr-2" />
              Analisar Agora
            </>
          )}
        </Button>
      </div>

      {!analysis && !loading ? (
        <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-200">
          <MessageSquare className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 font-medium">Nenhuma análise realizada ainda</p>
          <p className="text-sm text-slate-400">Clique em "Analisar Agora" para processar suas conversas</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-slate-50 rounded-xl p-6 flex flex-col items-center justify-center h-64">
             <h3 className="text-sm font-semibold text-slate-700 mb-4 w-full text-left">Distribuição de Sentimento</h3>
             <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" height={36}/>
                </PieChart>
             </ResponsiveContainer>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-purple-600" />
                Resumo da IA
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed bg-purple-50 p-4 rounded-lg border border-purple-100">
                {analysis?.summary || "Análise indisponível."}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-blue-600" />
                Palavras-chave Identificadas
              </h3>
              <div className="flex flex-wrap gap-2">
                {analysis?.key_phrases?.map((phrase, idx) => (
                  <span key={idx} className="px-3 py-1 bg-white border border-slate-200 rounded-full text-xs font-medium text-slate-600">
                    {phrase}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="text-xs text-slate-400 text-right pt-4">
              Análise realizada em: {analysis?.created_at ? new Date(analysis.created_at).toLocaleString() : '-'}
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default SentimentAnalysis;
