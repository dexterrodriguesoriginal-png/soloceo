import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Bot } from 'lucide-react';

const FooterSectionV2 = () => {
  return (
    <footer className="bg-[#0f172a] border-t border-white/5 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main CTA Box */}
        <div className="bg-gradient-to-br from-[#1e293b] to-[#0f172a] rounded-3xl p-8 md:p-16 text-center border border-white/10 relative overflow-hidden mb-20 shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#22c55e]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
          
          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
              O seu 'Eu de Amanhã' vai te agradecer por isso.
            </h2>
            <p className="text-lg text-slate-300 mb-10">
              Comece seu teste grátis agora e veja a diferença em 7 dias.
            </p>
            
            <Link to="/signup">
              <button className="bg-[#22c55e] hover:bg-[#16a34a] text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 shadow-[0_0_20px_rgba(34,197,94,0.3)] hover:shadow-[0_0_30px_rgba(34,197,94,0.5)] hover:-translate-y-1 flex items-center justify-center gap-3 mx-auto group w-full md:w-auto">
                Começar meu Teste Grátis (5 Agendamentos de cortesia)
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
          </div>
        </div>

        {/* Footer Links */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 border-t border-white/5 pt-10">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-[#22c55e] rounded-lg flex items-center justify-center shadow-lg shadow-green-900/20">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-white tracking-tight">SoloCEO</span>
          </div>
          
          <div className="flex flex-wrap justify-center gap-6 text-sm text-slate-400 font-medium">
            <a href="#" className="hover:text-[#22c55e] transition-colors">Termos de Uso</a>
            <span className="hidden md:inline text-slate-700">|</span>
            <a href="#" className="hover:text-[#22c55e] transition-colors">Privacidade</a>
            <span className="hidden md:inline text-slate-700">|</span>
            <a href="#" className="hover:text-[#22c55e] transition-colors">Suporte 2026</a>
          </div>

          <p className="text-sm text-slate-500">
            &copy; {new Date().getFullYear()} SoloCEO.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default FooterSectionV2;
