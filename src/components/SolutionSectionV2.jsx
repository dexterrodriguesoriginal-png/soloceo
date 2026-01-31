import React from 'react';
import { motion } from 'framer-motion';
import { Bot, ShieldCheck, LineChart } from 'lucide-react';

const SolutionSectionV2 = () => {
  const features = [
    {
      icon: Bot,
      title: "IA Persuasiva",
      description: "Identifica intenção de compra e fecha a venda automaticamente.",
    },
    {
      icon: ShieldCheck,
      title: "Agenda Blindada",
      description: "Sincronização automática com Google Calendar para evitar furos.",
    },
    {
      icon: LineChart,
      title: "Dashboard CEO",
      description: "Veja seu faturamento previsto crescer em tempo real.",
    }
  ];

  return (
    <section className="py-24 bg-[#0f172a] relative overflow-hidden">
      {/* Geometric background pattern */}
      <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(#22c55e 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            A Solução Definitiva para <span className="text-[#22c55e]">Autônomos Ocupados</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15, duration: 0.5 }}
              className="group backdrop-blur-md bg-white/5 border border-white/10 p-8 rounded-2xl hover:bg-white/10 hover:border-[#22c55e]/30 transition-all duration-300 shadow-lg hover:shadow-[#22c55e]/10"
            >
              <div className="w-16 h-16 bg-[#22c55e]/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 border border-[#22c55e]/20">
                <feature.icon className="w-8 h-8 text-[#22c55e]" />
              </div>
              
              <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-[#22c55e] transition-colors">
                {feature.title}
              </h3>
              
              <p className="text-slate-300 text-base leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SolutionSectionV2;
