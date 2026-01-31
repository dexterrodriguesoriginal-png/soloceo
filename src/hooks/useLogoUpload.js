import { useState } from 'react';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { supabase } from '@/lib/customSupabaseClient';
import { uploadLogo } from '@/lib/uploadLogo';
import { useToast } from '@/components/ui/use-toast';

export const useLogoUpload = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);

  const handleLogoUpload = async (file) => {
    if (!user) return null;
    
    setIsUploading(true);
    setError(null);

    try {
      // Use utility for validation and upload
      const publicUrl = await uploadLogo(file, user.id);

      // Update user_settings
      const { error: dbError } = await supabase
        .from('user_settings')
        .upsert({ 
          user_id: user.id,
          logo_url: publicUrl,
          logo_uploaded_at: new Date().toISOString()
        }, { onConflict: 'user_id' });

      if (dbError) throw dbError;

      toast({
        title: "Logo atualizado!",
        description: "Sua marca foi salva com sucesso."
      });

      return publicUrl;

    } catch (err) {
      console.error('Logo upload error:', err);
      setError(err.message);
      toast({
        variant: "destructive",
        title: "Erro no upload",
        description: err.message
      });
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const removeLogo = async () => {
    if (!user) return;
    
    setIsUploading(true);
    try {
      // Optionally delete from storage here if needed, or just clear the URL reference
      // For now, we just clear the reference in the DB
      
      const { error } = await supabase
        .from('user_settings')
        .update({ 
          logo_url: null,
          logo_uploaded_at: null 
        })
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: "Logo removido",
        description: "A marca foi removida das suas configurações."
      });
      return true;
    } catch (err) {
      console.error('Error removing logo:', err);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível remover o logo."
      });
      return false;
    } finally {
      setIsUploading(false);
    }
  };

  return {
    handleLogoUpload,
    removeLogo,
    isUploading,
    error
  };
};
