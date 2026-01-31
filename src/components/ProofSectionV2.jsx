import React from 'react';
import { motion } from 'framer-motion';
import { Star, User } from 'lucide-react';

const ProofSectionV2 = () => {
  const stats = [
    { value: "10.000+", label: "Autônomos Livres" },
    { value: "2 Milhões", label: "Leads Atendidos" },
    { value: "R$ 50 Mi", label: "Gerados para nossos clientes" }
  ];

  return (
    <section className="py-20 bg-[#0f172a] border-y border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center mb-20">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <div className="text-4xl md:text-5xl font-extrabold text-[#22c55e] mb-2 drop-shadow-[0_0_10px_rgba(34,197,94,0.3)]">
                {stat.value}
              </div>
              <div className="text-slate-300 font-medium text-lg uppercase tracking-wide">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Featured Testimonial */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <div className="backdrop-blur-md bg-white/5 border border-[#22c55e]/30 rounded-3xl p-8 md:p-12 relative shadow-2xl shadow-[#22c55e]/5">
            {/* Quote decoration */}
            <div className="absolute -top-6 -left-4 text-[#22c55e]/20 text-8xl font-serif leading-none">“</div>
            
            <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
              <div className="w-24 h-24 rounded-full bg-slate-700 flex items-center justify-center border-2 border-[#22c55e] shrink-0">
                <User className="w-12 h-12 text-slate-400" />
              </div>
              
              <div className="text-center md:text-left flex-1">
                <div className="flex justify-center md:justify-start gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-5 h-5 text-[#22c55e] fill-[#22c55e]" />
                  ))}
                </div>
                
                <p className="text-xl md:text-2xl text-white font-light italic mb-6 leading-relaxed">
                  "Antes do SoloCEO, eu perdia metade do meu dia respondendo dúvidas repetitivas. Hoje, eu só abro o WhatsApp para ver os agendamentos confirmados. Mudou meu jogo!"
                </p>
                
                <div>
                  <h4 className="text-lg font-bold text-white">Mariana Silva</h4>
                  <p className="text-[#22c55e]">Esteticista</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ProofSectionV2;
