import React from 'react';
import { motion } from 'framer-motion';
import { Stethoscope, Scale, Palette, Briefcase, Scissors } from 'lucide-react';

const ProofBarSection = () => {
  const segments = [
    { icon: Stethoscope, label: "Clínicas" },
    { icon: Scale, label: "Advogados" },
    { icon: Palette, label: "Tatuadores" },
    { icon: Briefcase, label: "Consultores" },
    { icon: Scissors, label: "Estéticas" },
  ];

  return (
    <section className="bg-[#0f172a] pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative -mt-8 z-20">
        <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl shadow-2xl p-6 md:p-10 flex flex-col lg:flex-row gap-10 items-center justify-between"
        >
          
          {/* Part 1: Trusted Segments */}
          <div className="flex-1 w-full">
            <h3 className="text-[#cbd5e1] text-sm font-semibold uppercase tracking-widest mb-6 text-center lg:text-left">
              Confiado por profissionais de:
            </h3>
            <div className="flex flex-wrap justify-center lg:justify-start gap-4 md:gap-8">
                {segments.map((item, idx) => (
                    <div key={idx} className="group flex flex-col items-center gap-2 cursor-pointer">
                        <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-[#39FF14] group-hover:bg-[#39FF14]/10 transition-all duration-300">
                            <item.icon className="w-5 h-5 md:w-6 md:h-6 text-slate-300 group-hover:text-[#39FF14] transition-colors" />
                        </div>
                        <span className="text-xs text-slate-400 group-hover:text-white transition-colors">{item.label}</span>
                    </div>
                ))}
            </div>
          </div>

          {/* Separator (Desktop) */}
          <div className="hidden lg:block w-px h-24 bg-gradient-to-b from-transparent via-white/20 to-transparent"></div>

          {/* Part 2: Impact Stats */}
          <div className="flex flex-col sm:flex-row gap-8 sm:gap-12 lg:gap-16 items-center text-center">
            <div>
                <div className="text-3xl md:text-4xl font-bold text-[#39FF14] mb-1">10.000+</div>
                <div className="text-sm font-medium text-[#cbd5e1]">Usuários Ativos</div>
            </div>
            <div>
                <div className="text-3xl md:text-4xl font-bold text-[#39FF14] mb-1">2M+</div>
                <div className="text-sm font-medium text-[#cbd5e1]">Leads Respondidos</div>
            </div>
            <div>
                <div className="text-3xl md:text-4xl font-bold text-[#39FF14] mb-1">R$ 50M</div>
                <div className="text-sm font-medium text-[#cbd5e1]">Gerados para Clientes</div>
            </div>
          </div>

        </motion.div>
      </div>
    </section>
  );
};

export default ProofBarSection;
