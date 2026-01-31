import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Briefcase, Loader2, Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useToast } from '@/components/ui/use-toast';
import { Helmet } from 'react-helmet';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { resetPassword } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      toast({ variant: "destructive", title: "Erro", description: "Digite seu e-mail." });
      return;
    }

    try {
      setLoading(true);
      await resetPassword(email);
      setSubmitted(true);
      toast({
        title: "E-mail enviado",
        description: "Verifique sua caixa de entrada para redefinir a senha."
      });
    } catch (error) {
      console.error('Reset password error:', error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível enviar o link de recuperação."
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-[#22c55e] flex items-center justify-center p-4">
      <Helmet>
        <title>Recuperar Senha - SoloCEO</title>
      </Helmet>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
      >
        <div className="p-8">
          <div className="flex flex-col items-center mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-[#22c55e] to-[#16a34a] rounded-xl flex items-center justify-center shadow-lg mb-4">
              <Briefcase className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">Recuperar Senha</h1>
            <p className="text-slate-500 mt-2 text-center">Digite seu e-mail para receber o link de redefinição</p>
          </div>

          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">E-mail</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all text-slate-900"
                    placeholder="seu@email.com"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white py-6 rounded-xl font-bold shadow-lg shadow-slate-900/20 transition-all hover:scale-[1.02]"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Enviar Link de Recuperação"}
              </Button>
            </form>
          ) : (
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Verifique seu e-mail</h3>
              <p className="text-slate-600 mb-6">
                Enviamos um link de recuperação para <strong>{email}</strong>. O link é válido por 24 horas.
              </p>
              <Button
                variant="outline"
                onClick={() => setSubmitted(false)}
                className="text-slate-600"
              >
                Tentar outro e-mail
              </Button>
            </div>
          )}

          <div className="mt-8 text-center">
            <Link to="/login" className="text-slate-500 hover:text-slate-800 font-medium inline-flex items-center text-sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar para o Login
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPasswordPage;
