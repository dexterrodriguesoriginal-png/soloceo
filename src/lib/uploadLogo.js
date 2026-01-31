
import { supabase } from '@/lib/customSupabaseClient';

export const uploadLogo = async (file, userId) => {
  if (!file || !userId) {
    throw new Error('Arquivo e ID do usuário são obrigatórios');
  }

  // 1. Validate MIME type
  const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    throw new Error('Tipo de arquivo inválido. Use PNG, JPG, SVG ou WEBP.');
  }

  // 2. Validate Size (5MB)
  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    throw new Error('O arquivo deve ter no máximo 5MB.');
  }

  // 3. Validate Dimensions (Min 100x100) - for images other than SVG
  if (file.type !== 'image/svg+xml') {
    await new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        if (img.width < 100 || img.height < 100) {
          reject(new Error('A imagem deve ter no mínimo 100x100px.'));
        }
        resolve();
      };
      img.onerror = () => reject(new Error('Erro ao ler a imagem.'));
      img.src = URL.createObjectURL(file);
    });
  }

  try {
    // 4. Generate Filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}/logo-${Date.now()}.${fileExt}`;

    // 5. Upload to Supabase
    const { error: uploadError } = await supabase.storage
      .from('logos')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: true
      });

    if (uploadError) throw uploadError;

    // 6. Get Public URL
    const { data } = supabase.storage
      .from('logos')
      .getPublicUrl(fileName);

    return data.publicUrl;

  } catch (error) {
    console.error('Erro no upload do logo:', error);
    throw new Error('Falha ao enviar o logo para o servidor.');
  }
};
