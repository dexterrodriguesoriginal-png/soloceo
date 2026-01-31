import React from 'react';
import { motion } from 'framer-motion';

const PainExpansionSection = () => {
  return (
    <section className="py-10 md:py-20 bg-[#0f172a] border-t border-white/5 relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-b from-[#0f172a] via-[#111827] to-[#0f172a] opacity-50 -z-10"></div>
      
      <div className="max-w-7xl mx-auto px-5 md:px-10 lg:px-12">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center text-center"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-8 leading-tight max-w-4xl">
            O que o silêncio no seu WhatsApp está custando para você?
          </h2>
          
          <p className="text-[20px] text-[#cbd5e1] leading-[1.6] max-w-[900px] font-normal">
            Cada minuto sem resposta é uma venda que vai para o concorrente. O autônomo moderno não tem tempo para gerenciar agenda e atender clientes simultaneamente. Você está trocando sua saúde e seu descanso por processos manuais que uma IA faz melhor, mais rápido e 24h por dia.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default PainExpansionSection;
