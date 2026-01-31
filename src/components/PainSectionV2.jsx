import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Clock, Frown } from 'lucide-react';

const PainSectionV2 = () => {
  const pains = [
    {
      icon: Clock,
      title: "A Perda",
      description: "Você visualiza a mensagem 3 horas depois e o cliente já fechou com o concorrente.",
      color: "text-red-500",
      bg: "bg-red-500/10",
      border: "border-red-500/20"
    },
    {
      icon: Frown,
      title: "O Esgotamento",
      description: "Sua janta é interrompida por orçamentos que não dão em nada.",
      color: "text-orange-500",
      bg: "bg-orange-500/10",
      border: "border-orange-500/20"
    },
    {
      icon: AlertTriangle,
      title: "O Caos",
      description: "Esquecer agendamentos ou anotar em papéis que somem é o fim do seu profissionalismo.",
      color: "text-yellow-500",
      bg: "bg-yellow-500/10",
      border: "border-yellow-500/20"
    }
  ];

  return (
    <section className="py-20 bg-[#0f172a] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pains.map((pain, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15, duration: 0.5 }}
              className={`group backdrop-blur-md bg-white/5 border ${pain.border} p-8 rounded-2xl hover:-translate-y-2 hover:bg-white/10 transition-all duration-300 shadow-xl`}
            >
              <div className={`w-14 h-14 ${pain.bg} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <pain.icon className={`w-8 h-8 ${pain.color}`} />
              </div>
              <h3 className={`text-2xl font-bold mb-4 ${pain.color}`}>
                {pain.title}
              </h3>
              <p className="text-slate-300 text-lg leading-relaxed">
                {pain.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PainSectionV2;
