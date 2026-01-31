import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Rocket, Headphones, ArrowRight } from 'lucide-react';

const CredibilityFooter = () => {
  return (
    <footer className="bg-[#0f172a] border-t border-white/5 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1 bg-gradient-to-r from-transparent via-[#39FF14]/50 to-transparent"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-10">
        
        {/* SECTION 1: CTA */}
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight">
            Não deixe seu próximo cliente esperando.
          </h2>
          <p className="text-xl text-[#cbd5e1] mb-10 max-w-2xl mx-auto font-light">
            Comece seu teste grátis agora e veja a diferença em 7 dias.
          </p>
          
          <Link to="/signup">
            <button className="w-full sm:w-[280px] h-[56px] bg-[#39FF14] text-[#0f172a] rounded-xl text-[18px] font-bold inline-flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(57,255,20,0.3)] hover:shadow-[0_0_40px_rgba(57,255,20,0.5)] hover:scale-105 transition-all duration-300">
              COMEÇAR AGORA
              <ArrowRight className="w-5 h-5" />
            </button>
          </Link>
        </div>

        {/* SECTION 2: TRUST BADGES */}
        <div className="flex flex-col md:flex-row justify-center items-center gap-10 md:gap-16 mb-20 border-b border-white/5 pb-16">
            <div className="flex flex-col items-center gap-3 group">
                <ShieldCheck className="w-12 h-12 text-[#cbd5e1] group-hover:text-[#39FF14] transition-colors duration-300" strokeWidth={1.5} />
                <span className="text-sm font-medium text-[#cbd5e1] group-hover:text-white transition-colors">Site Seguro (SSL)</span>
            </div>
            <div className="flex flex-col items-center gap-3 group">
                <Rocket className="w-12 h-12 text-[#cbd5e1] group-hover:text-[#39FF14] transition-colors duration-300" strokeWidth={1.5} />
                <span className="text-sm font-medium text-[#cbd5e1] group-hover:text-white transition-colors">Tecnologia 2026</span>
            </div>
            <div className="flex flex-col items-center gap-3 group">
                <Headphones className="w-12 h-12 text-[#cbd5e1] group-hover:text-[#39FF14] transition-colors duration-300" strokeWidth={1.5} />
                <span className="text-sm font-medium text-[#cbd5e1] group-hover:text-white transition-colors">Suporte 24/7</span>
            </div>
        </div>

        {/* SECTION 3: LEGAL LINKS */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-[#cbd5e1]">
          <div className="text-sm">
            &copy; {new Date().getFullYear()} SoloCEO. Todos os direitos reservados.
          </div>
          
          <div className="flex flex-wrap justify-center gap-5 text-sm font-medium">
            <a href="#" className="hover:text-[#39FF14] transition-colors">Suporte</a>
            <span className="text-slate-700">|</span>
            <a href="#" className="hover:text-[#39FF14] transition-colors">Termos de Uso</a>
            <span className="text-slate-700">|</span>
            <a href="#" className="hover:text-[#39FF14] transition-colors">Privacidade</a>
            <span className="text-slate-700">|</span>
            <a href="#" className="hover:text-[#39FF14] transition-colors">Contato</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default CredibilityFooter;
