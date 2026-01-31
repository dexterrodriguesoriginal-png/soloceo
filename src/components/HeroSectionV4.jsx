import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Check, ArrowRight } from 'lucide-react';

const HeroSectionV4 = () => {
  const { scrollY } = useScroll();
  const yParallax = useTransform(scrollY, [0, 500], [0, 50]);

  return (
    <section className="relative min-h-screen flex items-center bg-[#0f172a] overflow-hidden pt-[120px] pb-20 lg:pt-0 lg:pb-0">
      {/* Background Ambience */}
      <div className="absolute inset-0 z-0 opacity-[0.03]" 
           style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}>
      </div>
      <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-[#39FF14]/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-5 md:px-10 lg:px-12 w-full h-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center h-full">
          
          {/* Left Column: Content */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col items-start text-left"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white leading-[1.1] mb-6 tracking-tight">
              A IA que Vende por Você <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#39FF14] to-emerald-400">
                24h por Dia.
              </span>
            </h1>

            <p className="text-[20px] text-[#cbd5e1] leading-relaxed max-w-xl mb-10 font-normal">
              O SoloCEO captura leads, tira dúvidas e fecha agendamentos enquanto você foca no que realmente importa. Simples, automático e lucartivo.
            </p>

            {/* CTA Group */}
            <div className="w-full sm:w-auto flex flex-col items-start gap-6">
              <Link to="/signup" className="w-full sm:w-auto">
                <motion.button 
                    whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(57, 255, 20, 0.4)" }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full sm:w-[280px] h-[56px] bg-[#39FF14] text-[#0f172a] rounded-xl text-[18px] font-bold flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(57,255,20,0.2)] transition-all"
                >
                  TESTAR GRÁTIS AGORA
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </Link>
              
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[14px] text-[#cbd5e1] font-medium">
                <span className="flex items-center gap-1.5">
                    <Check className="w-4 h-4 text-[#39FF14]" strokeWidth={3} /> 
                    Acesso imediato
                </span>
                <span className="hidden sm:inline text-slate-600">•</span>
                <span className="flex items-center gap-1.5">
                    <Check className="w-4 h-4 text-[#39FF14]" strokeWidth={3} /> 
                    Configuração em 2 min
                </span>
                <span className="hidden sm:inline text-slate-600">•</span>
                <span className="flex items-center gap-1.5">
                    <Check className="w-4 h-4 text-[#39FF14]" strokeWidth={3} /> 
                    Resultados hoje mesmo
                </span>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Image */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            style={{ y: yParallax }}
            className="relative w-full"
          >
             <div className="relative rounded-2xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.5)] border border-white/10 group">
                <div className="absolute inset-0 bg-[#39FF14]/5 mix-blend-overlay group-hover:bg-transparent transition-all duration-500"></div>
                <img 
                    src="https://images.unsplash.com/photo-1608222351212-18fe0ec7b13b?q=80&w=2600&auto=format&fit=crop" 
                    alt="SoloCEO Dashboard Interface" 
                    className="w-full h-auto object-cover transform hover:scale-105 transition-transform duration-700 ease-out"
                />
             </div>
             
             {/* Floating Badge */}
             <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1, duration: 0.5 }}
                className="absolute -bottom-6 -left-6 bg-[#1e293b] p-4 rounded-xl border border-white/10 shadow-xl hidden md:block"
             >
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                        <Check className="w-6 h-6 text-green-500" />
                    </div>
                    <div>
                        <p className="text-white font-bold text-sm">Agendamento Confirmado</p>
                        <p className="text-xs text-slate-400">Há 2 minutos</p>
                    </div>
                </div>
             </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default HeroSectionV4;
