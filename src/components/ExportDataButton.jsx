import React, { useState } from 'react';
import { Download, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { exportToCSV } from '@/lib/exportToCSV';

const ExportDataButton = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleExport = async () => {
    if (!user) return;

    try {
      setLoading(true);

      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;

      if (!data || data.length === 0) {
        toast({
          title: "Sem dados",
          description: "Não há clientes para exportar.",
          variant: "warning"
        });
        return;
      }

      exportToCSV(data, 'soloceo_clientes_[DATE].csv');

      toast({
        title: "✅ Dados exportados com sucesso!",
        description: `${data.length} registros foram baixados.`,
      });

    } catch (error) {
      console.error('Error exporting data:', error);
      toast({
        variant: "destructive",
        title: "Erro na exportação",
        description: "Não foi possível exportar os dados. Tente novamente."
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button 
      onClick={handleExport} 
      disabled={loading}
      variant="outline"
      className="bg-white hover:bg-slate-50 text-slate-700 border-slate-200"
    >
      {loading ? (
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
      ) : (
        <Download className="w-4 h-4 mr-2" />
      )}
      {loading ? 'Exportando...' : 'Exportar Dados (CSV)'}
    </Button>
  );
};

export default ExportDataButton;
