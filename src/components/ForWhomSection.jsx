import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Scale, Wrench } from 'lucide-react';

const ForWhomSection = () => {
  const audiences = [
    {
      icon: Wrench,
      title: "Prestadores de Serviço",
      description: "Se você vende seu tempo ou serviço (técnicos, freelancers, consultores), o SoloCEO é sua secretária digital que nunca dorme. Orçamentos rápidos, agendamentos automáticos e rotas otimizadas."
    },
    {
      icon: Sparkles,
      title: "Profissionais da Saúde e Estética",
      description: "Fim dos furos na agenda com confirmações automáticas. Seus clientes recebem lembretes e confirmam presença, garantindo que você não perca nenhum atendimento."
    },
    {
      icon: Scale,
      title: "Consultores e Advogados",
      description: "Triagem de casos e agendamento de reuniões sem trocas infinitas de mensagens. A IA qualifica leads e agenda apenas os casos que valem seu tempo."
    }
  ];

  return (
    <section className="py-20 lg:py-24 bg-[#0f172a] relative border-t border-white/5">
      <div className="max-w-7xl mx-auto px-5 md:px-10 lg:px-12">
        
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-[44px] font-bold text-white mb-4"
          >
            Para Quem é o SoloCEO?
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-[18px] text-[#cbd5e1]"
          >
            Qualquer profissional autônomo que quer vender mais e trabalhar menos
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {audiences.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ y: -5 }}
              className="p-8 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 hover:border-[#39FF14] transition-all duration-300"
            >
              <div className="w-14 h-14 mb-6 rounded-full bg-gradient-to-br from-white/10 to-transparent flex items-center justify-center border border-white/5 shadow-lg">
                <item.icon className="w-7 h-7 text-[#39FF14]" strokeWidth={2} />
              </div>
              
              <h3 className="text-xl font-bold text-white mb-4">
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

export default ForWhomSection;
