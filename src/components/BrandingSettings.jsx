import React, { useState, useEffect } from 'react';
import { Store, Building2, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import LogoUpload from '@/components/LogoUpload';
import { useLogoUpload } from '@/hooks/useLogoUpload';

const BrandingSettings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { handleLogoUpload, removeLogo, isUploading } = useLogoUpload();
  
  const [companyName, setCompanyName] = useState('');
  const [currentLogo, setCurrentLogo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

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
        .select('company_name, logo_url')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;
      
      if (data) {
        setCompanyName(data.company_name || '');
        setCurrentLogo(data.logo_url);
      }
    } catch (error) {
      console.error('Error fetching branding settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      const { error } = await supabase
        .from('user_settings')
        .upsert({
          user_id: user.id,
          company_name: companyName,
          updated_at: new Date().toISOString()
        }, { onConflict: 'user_id' });

      if (error) throw error;

      toast({
        title: "Configurações salvas!",
        description: "Nome da empresa atualizado com sucesso."
      });
    } catch (error) {
      console.error('Error saving company name:', error);
      toast({
        variant: "destructive",
        title: "Erro ao salvar",
        description: "Tente novamente mais tarde."
      });
    } finally {
      setSaving(false);
    }
  };

  const onLogoUpload = async (file) => {
    const url = await handleLogoUpload(file);
    if (url) setCurrentLogo(url);
  };

  const onLogoRemove = async () => {
    const success = await removeLogo();
    if (success) setCurrentLogo(null);
  };

  if (loading) {
    return <div className="p-8 text-center text-slate-500">Carregando configurações...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-xl p-6">
        <div className="flex items-center mb-6">
          <Store className="w-6 h-6 mr-3 text-[#22c55e]" />
          <div>
            <h2 className="text-xl font-bold text-gray-900">Marca da Empresa</h2>
            <p className="text-sm text-gray-500">Personalize como sua marca aparece para os clientes</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Company Name Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Building2 className="w-4 h-4" /> Nome da Empresa
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Ex: Clínica Sorriso, Consultório Dr. Silva..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#22c55e] focus:border-transparent outline-none"
              />
              <Button 
                onClick={handleSave} 
                disabled={saving}
                className="bg-[#22c55e] hover:bg-[#16a34a] text-white"
              >
                <Save className="w-4 h-4 mr-2" />
                {saving ? 'Salvando...' : 'Salvar'}
              </Button>
            </div>
          </div>

          <div className="border-t border-gray-100 my-6"></div>

          {/* Logo Upload Section */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 block mb-2">Logotipo</label>
            <LogoUpload 
              currentLogo={currentLogo}
              onUpload={onLogoUpload}
              onRemove={onLogoRemove}
              isUploading={isUploading}
            />
            <p className="text-xs text-gray-500 mt-2">
              Este logo será exibido nos lembretes, confirmações e mensagens automáticas.
            </p>
          </div>
        </div>
      </div>
      
      {/* Preview Section */}
      <div className="bg-slate-50 rounded-xl border border-slate-200 p-6">
        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Pré-visualização</h3>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-100 max-w-md mx-auto">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-3 mb-3">
            {currentLogo ? (
              <img src={currentLogo} alt="Logo" className="h-10 object-contain" />
            ) : (
              <div className="h-10 w-10 bg-slate-100 rounded-full flex items-center justify-center">
                <Store className="w-5 h-5 text-slate-400" />
              </div>
            )}
            <div>
              <p className="font-bold text-slate-800 text-sm">{companyName || 'Sua Empresa'}</p>
              <p className="text-xs text-slate-500">Confirmar Agendamento</p>
            </div>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed">
            Olá! Este é um exemplo de como suas mensagens aparecerão para seus clientes com sua marca personalizada.
          </p>
        </div>
      </div>
    </div>
  );
};

export default BrandingSettings;
