import React, { useState, useCallback } from 'react';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const LogoUpload = ({ currentLogo, onUpload, onRemove, isUploading }) => {
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState(currentLogo);

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const validateFile = (file) => {
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml', 'image/webp'];
    if (!validTypes.includes(file.type)) return false;
    if (file.size > 5 * 1024 * 1024) return false; // 5MB
    return true;
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (validateFile(file)) {
        const url = URL.createObjectURL(file);
        setPreview(url);
        onUpload(file);
      } else {
        alert("Arquivo inválido. Use PNG, JPG, SVG ou WEBP até 5MB.");
      }
    }
  }, [onUpload]);

  const handleChange = useCallback((e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (validateFile(file)) {
        const url = URL.createObjectURL(file);
        setPreview(url);
        onUpload(file);
      } else {
        alert("Arquivo inválido. Use PNG, JPG, SVG ou WEBP até 5MB.");
      }
    }
  }, [onUpload]);

  const handleRemove = () => {
    setPreview(null);
    onRemove();
  };

  return (
    <div className="space-y-4">
      <div 
        className={cn(
          "relative flex flex-col items-center justify-center w-full min-h-[200px] border-2 border-dashed rounded-xl transition-colors",
          dragActive ? "border-blue-500 bg-blue-50" : "border-slate-200 bg-slate-50",
          (preview || currentLogo) && "bg-white border-solid"
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        {(preview || currentLogo) ? (
          <div className="relative w-full h-full p-8 flex flex-col items-center justify-center">
            <img 
              src={preview || currentLogo} 
              alt="Logo Preview" 
              className="max-h-32 object-contain mb-4" 
            />
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => document.getElementById('logo-upload').click()}
                disabled={isUploading}
              >
                Trocar Logo
              </Button>
              <Button 
                variant="destructive" 
                size="sm"
                onClick={handleRemove}
                disabled={isUploading}
              >
                <X className="w-4 h-4 mr-2" />
                Remover
              </Button>
            </div>
            {isUploading && (
              <div className="absolute inset-0 bg-white/80 flex items-center justify-center rounded-xl">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
              </div>
            )}
          </div>
        ) : (
          <label 
            htmlFor="logo-upload" 
            className="flex flex-col items-center justify-center w-full h-full cursor-pointer p-8"
          >
            <div className="p-4 bg-white rounded-full shadow-sm mb-3">
              <Upload className="w-6 h-6 text-slate-400" />
            </div>
            <p className="mb-2 text-sm text-slate-700 font-semibold">Clique para enviar ou arraste aqui</p>
            <p className="text-xs text-slate-500">PNG, JPG, WEBP ou SVG (max. 5MB)</p>
            {isUploading && (
              <div className="absolute inset-0 bg-white/80 flex items-center justify-center rounded-xl cursor-default">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
              </div>
            )}
          </label>
        )}
        <input 
          id="logo-upload" 
          type="file" 
          className="hidden" 
          accept="image/png,image/jpeg,image/svg+xml,image/webp"
          onChange={handleChange}
          disabled={isUploading}
        />
      </div>
    </div>
  );
};

export default LogoUpload;
