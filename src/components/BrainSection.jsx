import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Target, RefreshCw, Mail } from 'lucide-react';

const BrainSection = () => {
  const features = [
    {
      icon: BookOpen,
      title: "Aprendizado Personalizado",
      description: "Você carrega seus preços e serviços. A IA não inventa, ela estuda seu negócio.",
      number: "01"
    },
    {
      icon: Target,
      title: "Filtro de Curiosos",
      description: "Ela identifica quem quer comprar agora e quem está apenas pesquisando, priorizando seu tempo.",
      number: "02"
    },
    {
      icon: RefreshCw,
      title: "Sincronização Viva",
      description: "Se você marcar um compromisso pessoal no seu celular, a IA bloqueia esse horário automaticamente na agenda de vendas.",
      number: "03"
    },
    {
      icon: Mail,
      title: "Follow-up Automático",
      description: "O cliente não agendou? A IA envia uma mensagem de lembrete gentil horas depois para recuperar a venda.",
      number: "04"
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
            O Cérebro por Trás da Sua IA
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-[20px] text-[#cbd5e1]"
          >
            Entenda como o SoloCEO funciona na prática
          </motion.p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              whileHover={{ y: -10 }}
              className="group relative p-8 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 hover:border-[#39FF14] transition-all duration-300 h-full flex flex-col"
            >
              <div className="absolute top-6 right-6 text-4xl font-bold text-white/5 group-hover:text-white/10 transition-colors">
                {item.number}
              </div>

              <div className="w-12 h-12 mb-6 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-[#39FF14]/10 transition-colors border border-white/5 group-hover:border-[#39FF14]/30">
                <item.icon className="w-6 h-6 text-[#39FF14]" strokeWidth={2} />
              </div>

              <h3 className="text-[22px] font-bold text-white mb-4 group-hover:text-[#39FF14] transition-colors">
                {item.title}
              </h3>
              
              <p className="text-[#cbd5e1] leading-[1.6] text-[16px]">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default BrainSection;
