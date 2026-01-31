import React from 'react';
import { motion } from 'framer-motion';
import { XCircle, CheckCircle, MonitorSmartphone as SmartphoneOff, Moon, CalendarX, Zap, Target, Palmtree } from 'lucide-react';

const PainRemedySection = () => {
  return (
    <section className="py-20 bg-[#0f172a] relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 z-0 opacity-[0.03]" 
             style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}>
        </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="text-center mb-16">
            <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                className="text-3xl md:text-4xl font-bold text-white mb-4"
            >
                Veja a Diferença
            </motion.h2>
            <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-[#cbd5e1] text-lg"
            >
                O que muda quando você automatiza suas vendas
            </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {/* The Pain (Before) */}
            <motion.div 
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                whileHover={{ y: -5, filter: "brightness(1.1)" }}
                transition={{ duration: 0.4 }}
                className="backdrop-blur-md bg-red-500/5 border-2 border-red-500/30 rounded-3xl p-8 relative overflow-hidden"
            >
                <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                
                <h3 className="text-2xl font-bold text-red-400 mb-8 flex items-center gap-3">
                    <XCircle className="w-8 h-8" /> Antes do SoloCEO
                </h3>
                
                <ul className="space-y-6">
                    <li className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center shrink-0">
                            <SmartphoneOff className="w-5 h-5 text-red-400" />
                        </div>
                        <div>
                            <h4 className="text-white font-semibold text-lg mb-1">Vendas perdidas no vácuo</h4>
                            <p className="text-slate-400 text-sm">Cliente chama, você demora e ele fecha com outro.</p>
                        </div>
                    </li>
                    <li className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center shrink-0">
                            <Moon className="w-5 h-5 text-red-400" />
                        </div>
                        <div>
                            <h4 className="text-white font-semibold text-lg mb-1">Noites respondendo orçamentos</h4>
                            <p className="text-slate-400 text-sm">Seu descanso vira hora extra não remunerada.</p>
                        </div>
                    </li>
                    <li className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center shrink-0">
                            <CalendarX className="w-5 h-5 text-red-400" />
                        </div>
                        <div>
                            <h4 className="text-white font-semibold text-lg mb-1">Agenda bagunçada e furos</h4>
                            <p className="text-slate-400 text-sm">Esquecimentos e clientes que não aparecem.</p>
                        </div>
                    </li>
                </ul>
            </motion.div>

            {/* The Remedy (After) */}
            <motion.div 
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                whileHover={{ y: -5, filter: "brightness(1.1)" }}
                transition={{ duration: 0.4 }}
                className="backdrop-blur-md bg-[#39FF14]/5 border-2 border-[#39FF14] rounded-3xl p-8 relative overflow-hidden shadow-[0_0_30px_rgba(57,255,20,0.1)]"
            >
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#39FF14]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                
                <h3 className="text-2xl font-bold text-[#39FF14] mb-8 flex items-center gap-3">
                    <CheckCircle className="w-8 h-8" /> Com SoloCEO
                </h3>
                
                <ul className="space-y-6">
                    <li className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-[#39FF14]/10 flex items-center justify-center shrink-0">
                            <Zap className="w-5 h-5 text-[#39FF14]" />
                        </div>
                        <div>
                            <h4 className="text-white font-semibold text-lg mb-1">Clientes respondidos em segundos</h4>
                            <p className="text-slate-300 text-sm">Resposta imediata = Venda garantida.</p>
                        </div>
                    </li>
                    <li className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-[#39FF14]/10 flex items-center justify-center shrink-0">
                            <Target className="w-5 h-5 text-[#39FF14]" />
                        </div>
                        <div>
                            <h4 className="text-white font-semibold text-lg mb-1">Agendamentos automáticos</h4>
                            <p className="text-slate-300 text-sm">Sua agenda enche sozinha, sincronizada com Google.</p>
                        </div>
                    </li>
                    <li className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-[#39FF14]/10 flex items-center justify-center shrink-0">
                            <Palmtree className="w-5 h-5 text-[#39FF14]" />
                        </div>
                        <div>
                            <h4 className="text-white font-semibold text-lg mb-1">Seu tempo de volta</h4>
                            <p className="text-slate-300 text-sm">Trabalhe apenas no que importa. A IA cuida do resto.</p>
                        </div>
                    </li>
                </ul>
            </motion.div>
        </div>
      </div>
    </section>
  );
};

export default PainRemedySection;
