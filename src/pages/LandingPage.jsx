import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Bot, CheckCircle2 } from 'lucide-react';
import LandingHeader from '@/components/LandingHeader';
import BenefitsSection from '@/components/BenefitsSection';
import StatsSection from '@/components/StatsSection';

const LandingPage = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white overflow-x-hidden font-sans">
      <LandingHeader />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image with Gradient Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1608222351212-18fe0ec7b13b?q=80&w=2000&auto=format&fit=crop"
            alt="Futuristic Technology Background"
            className="w-full h-full object-cover"
          />
          {/* Dark blue to purple gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#0f172a]/95 via-[#0f172a]/90 to-[#581c87]/60"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-20 pb-16">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="flex flex-col items-center"
          >
            <motion.div variants={itemVariants} className="mb-8 inline-flex items-center space-x-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 backdrop-blur-sm shadow-lg shadow-purple-500/10">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <span className="text-sm font-medium text-green-300 tracking-wide uppercase">Nova Tecnologia de IA 2.0</span>
            </motion.div>

            <motion.h1 
              variants={itemVariants}
              className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-tight max-w-5xl mx-auto"
            >
              <span className="block text-white mb-2">Venda Enquanto Você Descansa</span>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#22c55e] via-[#4ade80] to-[#22c55e] bg-300% animate-gradient">
                IA Faz o Trabalho Pesado
              </span>
            </motion.h1>

            <motion.p 
              variants={itemVariants}
              className="text-lg sm:text-xl text-slate-200 max-w-3xl mx-auto mb-10 leading-relaxed font-light"
            >
              Responda leads automaticamente, agende reuniões e feche vendas enquanto dorme. 
              <span className="block mt-2 font-medium text-white">Sem código, sem complicação.</span>
            </motion.p>

            <motion.div variants={itemVariants} className="flex flex-col items-center justify-center w-full">
              <Link to="/dashboard" className="w-full sm:w-auto">
                <button className="w-full sm:w-auto bg-[#22c55e] hover:bg-[#16a34a] text-white px-8 py-5 rounded-xl font-bold text-lg transition-all duration-300 shadow-xl shadow-green-500/20 hover:shadow-green-500/40 hover:-translate-y-1 flex items-center justify-center gap-3 group">
                  Testar Grátis Agora
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
              <p className="mt-4 text-sm text-slate-400 font-medium">
                Não precisa de cartão de crédito
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="mt-16 flex flex-wrap justify-center gap-6 md:gap-12 text-sm font-medium text-slate-300">
              <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/5">
                <CheckCircle2 className="w-5 h-5 text-[#22c55e]" />
                <span>Configuração em 2 minutos</span>
              </div>
              <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/5">
                <CheckCircle2 className="w-5 h-5 text-[#22c55e]" />
                <span>IA Treinada em Vendas</span>
              </div>
              <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/5">
                <CheckCircle2 className="w-5 h-5 text-[#22c55e]" />
                <span>Suporte Brasileiro</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <StatsSection />

      {/* Benefits Section */}
      <BenefitsSection />

      {/* Footer */}
      <footer className="bg-[#0f172a] border-t border-white/10 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-[#22c55e] rounded-lg flex items-center justify-center shadow-lg shadow-green-900/20">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-white tracking-tight">SoloCEO</span>
          </div>
          
          <div className="flex space-x-8 text-sm text-slate-400 font-medium">
            <a href="#" className="hover:text-[#22c55e] transition-colors">Termos</a>
            <a href="#" className="hover:text-[#22c55e] transition-colors">Privacidade</a>
            <a href="#" className="hover:text-[#22c55e] transition-colors">Contato</a>
          </div>

          <p className="text-sm text-slate-500">
            &copy; {new Date().getFullYear()} SoloCEO. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
