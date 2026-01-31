import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

const HeroSectionV2 = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0f172a]">
      {/* Background Image with Gradient Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1555487525-ff7eb0ba00c0?q=80&w=2000&auto=format&fit=crop"
          alt="Busy Professional Background"
          className="w-full h-full object-cover opacity-40"
        />
        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0f172a]/90 via-[#0f172a]/80 to-[#0f172a]"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-20 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center"
        >
          <div className="mb-6 inline-flex items-center space-x-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 backdrop-blur-md shadow-lg">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span className="text-sm font-medium text-green-300 tracking-wide uppercase">IA de Vendas 24/7</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-tight max-w-5xl mx-auto text-white">
            Pare de Perder Vendas por <br className="hidden md:block" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-emerald-600">
              Estar Ocupado Demais.
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto mb-10 leading-relaxed font-light">
            Enquanto você atende um cliente, 5 outros desistem porque você não respondeu no WhatsApp. 
            O SoloCEO é a IA que captura, tira dúvidas e agenda seus clientes 24h por dia. 
            <span className="block mt-2 font-medium text-white">Recupere sua liberdade e nunca mais deixe dinheiro na mesa.</span>
          </p>

          <div className="flex flex-col items-center justify-center w-full">
            <Link to="/signup" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto bg-[#22c55e] hover:bg-[#16a34a] text-white px-8 py-5 rounded-xl font-bold text-lg transition-all duration-300 shadow-[0_0_20px_rgba(34,197,94,0.3)] hover:shadow-[0_0_30px_rgba(34,197,94,0.5)] hover:-translate-y-1 flex items-center justify-center gap-3 group">
                Testar Grátis Agora
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
            <div className="mt-4 flex flex-col sm:flex-row items-center gap-2 sm:gap-6 text-sm text-slate-400 font-medium">
              <span className="flex items-center gap-1"><CheckCircle2 className="w-4 h-4 text-green-500" /> Sem cartão de crédito</span>
              <span className="flex items-center gap-1"><CheckCircle2 className="w-4 h-4 text-green-500" /> Configuração em 2 minutos</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSectionV2;
