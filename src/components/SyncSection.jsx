import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, MessageCircle } from 'lucide-react';

const SyncSection = () => {
  return (
    <section className="py-10 md:py-20 bg-[#1a2332] border-t border-white/5">
      <div className="max-w-7xl mx-auto px-5 md:px-10 lg:px-12">
        <div className="text-center mb-10 md:mb-[60px]">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-[48px] font-bold text-white mb-6"
          >
            Sincronização e Inteligência
          </motion.h2>
          <p className="text-[20px] text-[#cbd5e1]">
            Trabalhamos em conjunto com as ferramentas que você já usa. Sem complicação.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Google Calendar Card */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            whileHover={{ y: -10, borderColor: '#39FF14' }}
            className="p-10 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 transition-all duration-300"
          >
            <Calendar className="w-14 h-14 text-[#39FF14] mb-6" strokeWidth={1.5} />
            <h3 className="text-[22px] font-bold text-white mb-4">Google Calendar</h3>
            <p className="text-[16px] text-[#cbd5e1] leading-[1.6]">
              Sincronização automática com seu calendário pessoal. Quando você marca um compromisso, a IA bloqueia esse horário instantaneamente.
            </p>
          </motion.div>

          {/* WhatsApp Card */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            whileHover={{ y: -10, borderColor: '#39FF14' }}
            className="p-10 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 transition-all duration-300"
          >
            <MessageCircle className="w-14 h-14 text-[#39FF14] mb-6" strokeWidth={1.5} />
            <h3 className="text-[22px] font-bold text-white mb-4">WhatsApp</h3>
            <p className="text-[16px] text-[#cbd5e1] leading-[1.6]">
              Sua IA responde direto no WhatsApp onde seus clientes já estão. Sem app extra, sem complicação, sem aprender nada novo.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default SyncSection;
