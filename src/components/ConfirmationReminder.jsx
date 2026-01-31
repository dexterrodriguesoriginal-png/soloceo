import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, Clock, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { supabase } from '@/lib/customSupabaseClient';

const statusConfig = {
  confirmed: {
    color: 'text-green-600 bg-green-50 border-green-200',
    icon: CheckCircle2,
    label: 'Confirmado'
  },
  cancelled: {
    color: 'text-red-600 bg-red-50 border-red-200',
    icon: XCircle,
    label: 'Cancelado'
  },
  pending: {
    color: 'text-yellow-600 bg-yellow-50 border-yellow-200',
    icon: Clock,
    label: 'Pendente'
  },
  no_response: {
    color: 'text-orange-600 bg-orange-50 border-orange-200',
    icon: AlertCircle,
    label: 'Sem Resposta'
  }
};

const ConfirmationReminder = ({ status = 'pending', onOpenModal }) => {
  const { user } = useAuth();
  const [branding, setBranding] = useState({ logo_url: null, company_name: null });
  const config = statusConfig[status] || statusConfig.pending;
  const Icon = config.icon;

  useEffect(() => {
    if (user?.id) {
      const fetchBranding = async () => {
        const { data } = await supabase
          .from('user_settings')
          .select('logo_url, company_name')
          .eq('user_id', user.id)
          .maybeSingle();
        if (data) setBranding(data);
      };
      fetchBranding();
    }
  }, [user]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn(
        "flex flex-col p-4 rounded-lg border gap-4",
        config.color
      )}
    >
      {/* Branding Header */}
      {branding.logo_url && (
         <div className="flex items-center gap-3 border-b border-black/10 pb-3 mb-1">
            <img 
              src={branding.logo_url} 
              alt="Logo" 
              className="h-[40px] max-h-[60px] object-contain" 
            />
            {branding.company_name && (
              <span className="font-bold text-lg opacity-90">{branding.company_name}</span>
            )}
         </div>
      )}

      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Icon className="w-5 h-5 shrink-0" />
          <div className="flex flex-col">
            <span className="font-semibold text-sm">Status: {config.label}</span>
            {status === 'pending' && <span className="text-xs opacity-80">Aguardando confirmação do cliente</span>}
            {status === 'no_response' && <span className="text-xs opacity-80 font-bold">Atenção requerida</span>}
          </div>
        </div>
        
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onOpenModal}
          className={cn("w-full sm:w-auto text-xs h-8 hover:bg-white/50 border border-transparent hover:border-current", config.color)}
        >
          Ver Detalhes
        </Button>
      </div>
    </motion.div>
  );
};

export default ConfirmationReminder;
