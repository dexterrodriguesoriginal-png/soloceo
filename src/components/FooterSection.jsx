import React from 'react';
import { Link } from 'react-router-dom';
import { Linkedin, Twitter, Instagram, Facebook, Rocket, Lock, Headphones } from 'lucide-react';

const FooterSection = () => {
  const footerLinks = {
    PRODUTO: ['Funcionalidades', 'Preços', 'Segurança', 'Roadmap'],
    EMPRESA: ['Sobre Nós', 'Blog', 'Carreiras', 'Imprensa'],
    SUPORTE: ['Central de Ajuda', 'Documentação', 'Contato', 'Status'],
    LEGAL: ['Termos de Uso', 'Privacidade', 'Cookies', 'Compliance']
  };

  return (
    <footer className="bg-[#0a0f1a] border-t border-white/5 pt-16 pb-10">
      <div className="max-w-7xl mx-auto px-5 md:px-10 lg:px-12">
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 lg:gap-12 mb-16">
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-white font-bold text-base mb-6 tracking-wide">{category}</h4>
              <ul className="space-y-4">
                {links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-[#cbd5e1] text-sm hover:text-[#39FF14] transition-colors duration-200 block">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Credibility Seals */}
        <div className="border-t border-white/5 py-8">
           <div className="flex flex-wrap justify-center gap-10">
              <div className="flex items-center gap-3 group cursor-default">
                 <Rocket className="w-6 h-6 text-[#39FF14]" />
                 <span className="text-[#cbd5e1] text-sm font-medium group-hover:text-[#39FF14] transition-colors duration-300">
                    Tecnologia GPT-4o 2026
                 </span>
              </div>
              <div className="flex items-center gap-3 group cursor-default">
                 <Lock className="w-6 h-6 text-[#39FF14]" />
                 <span className="text-[#cbd5e1] text-sm font-medium group-hover:text-[#39FF14] transition-colors duration-300">
                    Dados 100% Criptografados
                 </span>
              </div>
              <div className="flex items-center gap-3 group cursor-default">
                 <Headphones className="w-6 h-6 text-[#39FF14]" />
                 <span className="text-[#cbd5e1] text-sm font-medium group-hover:text-[#39FF14] transition-colors duration-300">
                    Suporte Premium
                 </span>
              </div>
           </div>
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[#cbd5e1] text-xs">
            © {new Date().getFullYear()} SoloCEO. Todos os direitos reservados.
          </p>
          
          <div className="flex items-center gap-6">
            <a href="#" className="text-[#cbd5e1] hover:text-[#39FF14] transition-colors duration-200">
              <Linkedin className="w-5 h-5" />
            </a>
            <a href="#" className="text-[#cbd5e1] hover:text-[#39FF14] transition-colors duration-200">
              <Twitter className="w-5 h-5" />
            </a>
            <a href="#" className="text-[#cbd5e1] hover:text-[#39FF14] transition-colors duration-200">
              <Instagram className="w-5 h-5" />
            </a>
            <a href="#" className="text-[#cbd5e1] hover:text-[#39FF14] transition-colors duration-200">
              <Facebook className="w-5 h-5" />
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default FooterSection;
