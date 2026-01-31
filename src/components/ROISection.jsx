import React from 'react';
import { motion } from 'framer-motion';
import { Timer } from 'lucide-react';

const ROISection = () => {
  return (
    <section className="py-10 md:py-[60px] bg-[#0f172a]">
      <div className="max-w-[900px] mx-auto px-5 md:px-10">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center text-center"
        >
          <h2 className="text-[20px] font-bold text-white mb-6 leading-[1.6]">
            Este sistema se paga sozinho: com apenas 1 novo agendamento convertido por mês, seu investimento no SoloCEO já deu lucro.
          </h2>
          
          <div className="flex items-center justify-center gap-2 text-[#39FF14]">
            <Timer className="w-6 h-6" />
            <p className="text-[18px] font-medium">
              Recupere até 15 horas da sua semana automatizando o que hoje você faz manualmente
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ROISection;
