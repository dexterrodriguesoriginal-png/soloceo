import React from 'react';
import { motion } from 'framer-motion';
import { Brain, CheckCircle, Globe, Zap } from 'lucide-react';

const WhySection = () => {
  const cards = [
    {
      icon: Brain,
      title: "IA Humana",
      description: "Respostas naturais que ninguém percebe que é robô. Nossa IA entende contexto, humor e urgência."
    },
    {
      icon: CheckCircle,
      title: "Zero No-Show",
      description: "Lembretes automáticos que garantem a presença. Reduza suas faltas em até 80% na primeira semana."
    },
    {
      icon: Globe,
      title: "Multicanal",
      description: "Integração fluida onde seu cliente estiver. WhatsApp, Instagram e Site trabalhando em sintonia."
    },
    {
      icon: Zap,
      title: "Treinamento Rápido",
      description: "Ela aprende sobre seu negócio em segundos. Basta descrever seus serviços e preços uma única vez."
    }
  ];

  return (
    <section className="py-20 lg:py-24 bg-[#1a2332] relative border-t border-white/5">
      <div className="max-w-7xl mx-auto px-5 md:px-10 lg:px-12">
        
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-white mb-4"
          >
            Por Que o SoloCEO?
          </motion.h2>
          <p className="text-[20px] text-[#cbd5e1] mt-4">
             A escolha inteligente para quem quer escalar.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {cards.map((card, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ y: -10 }}
              className="p-8 rounded-2xl bg-white/5 backdrop-blur-md border border-white/5 hover:border-[#39FF14] transition-colors duration-300 group"
            >
              <div className="w-12 h-12 mb-6 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-[#39FF14]/10 transition-colors">
                <card.icon className="w-6 h-6 text-[#39FF14] group-hover:scale-110 transition-transform" />
              </div>
              <h3 className="text-[22px] font-bold text-white mb-3 group-hover:text-[#39FF14] transition-colors">
                {card.title}
              </h3>
              <p className="text-[#cbd5e1] leading-relaxed text-[16px]">
                {card.description}
              </p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default WhySection;
