import React from 'react';
import { motion } from 'framer-motion';
import { Zap, DollarSign, Clock } from 'lucide-react';

const BenefitsSection = () => {
  const benefits = [
    {
      icon: Zap,
      title: "Agilidade Máxima",
      description: "Respostas instantâneas para seus clientes 24/7. Nenhum lead fica sem resposta.",
      accentColor: "text-blue-500",
      bgColor: "bg-blue-500/10",
      borderColor: "hover:border-blue-500/30",
      shadowColor: "hover:shadow-blue-500/10"
    },
    {
      icon: DollarSign,
      title: "Aumente Seus Lucros",
      description: "Feche mais vendas com menos esforço. Automação inteligente = mais conversões.",
      accentColor: "text-green-500",
      bgColor: "bg-green-500/10",
      borderColor: "hover:border-green-500/30",
      shadowColor: "hover:shadow-green-500/10"
    },
    {
      icon: Clock,
      title: "Tempo Livre de Verdade",
      description: "Trabalhe menos, ganhe mais. Seu negócio roda sozinho enquanto você descansa.",
      accentColor: "text-purple-500",
      bgColor: "bg-purple-500/10",
      borderColor: "hover:border-purple-500/30",
      shadowColor: "hover:shadow-purple-500/10"
    }
  ];

  return (
    <section className="py-20 bg-[#1e293b] relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-white mb-4"
          >
            Tudo o que você ganha ao automatizar seu negócio
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-slate-400 text-lg max-w-2xl mx-auto"
          >
            Descubra como a IA transforma seu negócio
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15, duration: 0.5 }}
              className={`group bg-[#0f172a] p-8 rounded-2xl border border-white/5 ${benefit.borderColor} shadow-lg ${benefit.shadowColor} hover:-translate-y-2 transition-all duration-300`}
            >
              <div className={`w-16 h-16 ${benefit.bgColor} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <benefit.icon className={`w-8 h-8 ${benefit.accentColor}`} />
              </div>
              
              <h3 className="text-xl md:text-2xl font-bold text-white mb-3">
                {benefit.title}
              </h3>
              
              <p className="text-slate-400 text-base leading-relaxed">
                {benefit.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
