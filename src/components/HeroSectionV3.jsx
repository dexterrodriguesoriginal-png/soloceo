import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Check, ArrowRight } from 'lucide-react';
import iPhoneMockup from './iPhoneMockup';

const HeroSectionV3 = () => {
  return (
    <section className="relative min-h-screen flex flex-col justify-start pt-[80px] pb-20 bg-[#0f172a] overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-[#39FF14]/5 rounded-full blur-[120px] pointer-events-none -z-0"></div>
      <div className="absolute bottom-[-100px] left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-600/5 rounded-full blur-[100px] pointer-events-none -z-0"></div>

      <div className="relative z-10 max-w-[1200px] mx-auto px-5 w-full flex flex-col items-center">
        
        {/* Text Content */}
        <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-[800px] mx-auto flex flex-col items-center"
        >
            {/* Badge */}
             <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#39FF14]/10 border border-[#39FF14]/20 text-[#39FF14] text-xs font-bold uppercase tracking-wider mb-8">
              <span className="w-2 h-2 rounded-full bg-[#39FF14] animate-pulse"></span>
              Nova Tecnologia 2026
            </div>

            <h1 className="text-[32px] sm:text-[40px] md:text-[56px] font-bold text-white leading-[1.2] mb-6 tracking-tight text-center">
              Recupere sua Liberdade: A IA que Vende e Agenda enquanto Você Descansa.
            </h1>

            <p className="text-[16px] md:text-[20px] text-[#cbd5e1] font-normal leading-relaxed max-w-[700px] mx-auto mb-8 text-center">
              Não perca mais nenhum cliente por demora no atendimento. O SoloCEO captura leads, tira dúvidas e fecha agendamentos 24/7 com inteligência humana. Inteligente, simples e focado no seu lucro.
            </p>

            <Link to="/signup" className="w-full sm:w-auto">
                <motion.button 
                    whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(57, 255, 20, 0.4)" }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full sm:w-[280px] h-[56px] bg-[#39FF14] text-[#0f172a] rounded-xl text-[18px] font-bold flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(57,255,20,0.2)] transition-all mb-4 mx-auto"
                >
                  TESTAR GRÁTIS AGORA
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
            </Link>

             <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-2 text-[14px] text-[#cbd5e1] font-medium mb-12">
                <span className="flex items-center gap-1.5">
                    <Check className="w-4 h-4 text-[#39FF14]" strokeWidth={3} /> 
                    Acesso imediato
                </span>
                <span className="hidden sm:inline text-slate-600">•</span>
                <span className="flex items-center gap-1.5">
                    <Check className="w-4 h-4 text-[#39FF14]" strokeWidth={3} /> 
                    Sem cartão de crédito
                </span>
                <span className="hidden sm:inline text-slate-600">•</span>
                <span className="flex items-center gap-1.5">
                    <Check className="w-4 h-4 text-[#39FF14]" strokeWidth={3} /> 
                    Configuração em 2 min
                </span>
              </div>
        </motion.div>

        {/* Mockup */}
        <motion.div
            initial={{ opacity: 0, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-full flex justify-center relative z-20"
        >
             <iPhoneMockup />
        </motion.div>

      </div>
    </section>
  );
};

export default HeroSectionV3;
