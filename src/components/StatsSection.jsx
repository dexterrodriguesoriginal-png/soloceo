import React from 'react';
import { motion } from 'framer-motion';

const StatsSection = () => {
  const stats = [
    { value: "10.000+", label: "Usuários já automatizaram", color: "from-blue-400 to-blue-600" },
    { value: "2M+", label: "Leads respondidos", color: "from-green-400 to-green-600" },
    { value: "R$ 50M+", label: "Em vendas geradas", color: "from-purple-400 to-purple-600" }
  ];

  return (
    <section className="py-16 bg-[#0f172a] border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="p-6"
            >
              <div className={`text-4xl md:text-5xl font-extrabold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-2`}>
                {stat.value}
              </div>
              <div className="text-slate-400 font-medium text-lg">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
