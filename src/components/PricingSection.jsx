import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { Link } from 'react-router-dom';

const PricingCard = ({ title, price, description, features, isPopular, buttonText }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`relative p-10 rounded-3xl backdrop-blur-md flex flex-col h-full transition-all duration-300
        ${isPopular 
          ? 'bg-[#1e293b]/80 border-2 border-[#39FF14] shadow-[0_0_30px_rgba(57,255,20,0.15)] transform lg:scale-105 z-10' 
          : 'bg-white/5 border border-white/10 hover:border-white/20'
        }`}
    >
      {isPopular && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#39FF14] text-[#0f172a] px-4 py-1 rounded-full text-sm font-bold shadow-lg">
          MAIS POPULAR
        </div>
      )}

      <div className="mb-8">
        <h3 className={`text-xl font-bold mb-2 ${isPopular ? 'text-[#39FF14]' : 'text-white'}`}>{title}</h3>
        <p className="text-[#cbd5e1] text-sm h-10">{description}</p>
      </div>

      <div className="mb-8">
        <div className="flex items-end gap-1 mb-2">
            <span className="text-sm text-slate-400 mb-1">R$</span>
            <span className="text-4xl font-bold text-white">{price}</span>
            <span className="text-sm text-slate-400 mb-1">/mês</span>
        </div>
        {isPopular && (
             <span className="inline-block px-2 py-0.5 rounded bg-green-900/50 text-green-400 text-xs font-semibold">
                Economize 50% no plano anual
             </span>
        )}
      </div>

      <ul className="space-y-4 mb-10 flex-grow">
        {features.map((feature, idx) => (
          <li key={idx} className="flex items-start gap-3 text-sm text-[#cbd5e1]">
            <Check className={`w-5 h-5 shrink-0 ${isPopular ? 'text-[#39FF14]' : 'text-slate-500'}`} />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <Link to="/signup" className="mt-auto">
        <button className={`w-full py-4 rounded-xl font-bold transition-all duration-300 
          ${isPopular 
            ? 'bg-[#39FF14] text-[#0f172a] hover:shadow-[0_0_20px_rgba(57,255,20,0.4)] hover:scale-[1.02]' 
            : 'bg-white/10 text-white hover:bg-white/20'
          }`}>
          {buttonText}
        </button>
      </Link>
    </motion.div>
  );
};

const PricingSection = () => {
  const concurrencyFeature = "Múltiplas conversas ao mesmo tempo (Sua IA atende 10 clientes de uma vez sem fila de espera)";

  const plans = [
    {
      title: "START SOLO",
      price: "49,90",
      description: "O essencial para começar a automatizar.",
      features: [
        "Até 100 leads/mês",
        "Respostas automáticas simples",
        concurrencyFeature,
        "Suporte por email"
      ],
      isPopular: false,
      buttonText: "Começar Agora"
    },
    {
      title: "CEO PRO",
      price: "97,90",
      description: "Automação total + IA avançada para escalar.",
      features: [
        "Leads ilimitados",
        "IA persuasiva avançada (GPT-4)",
        "Agendamentos ilimitados",
        concurrencyFeature,
        "Dashboard completo",
        "Suporte prioritário",
        "Integrações avançadas"
      ],
      isPopular: true,
      buttonText: "Começar Agora"
    },
    {
      title: "BUSINESS SCALE",
      price: "197,90",
      description: "Para equipes e alto volume de atendimento.",
      features: [
        "Tudo do CEO Pro",
        "Múltiplos usuários",
        "API customizada",
        "Relatórios avançados",
        "Suporte dedicado 24/7",
        "Treinamento personalizado"
      ],
      isPopular: false,
      buttonText: "Falar com Vendas"
    }
  ];

  return (
    <section className="py-24 bg-[#0f172a] relative border-t border-white/5">
      <div className="max-w-7xl mx-auto px-5 md:px-10 lg:px-12">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-[44px] font-bold text-white mb-4"
          >
            Escolha seu Plano
          </motion.h2>
          <p className="text-[18px] text-[#cbd5e1]">
            Comece grátis e escale conforme cresce
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-8 items-stretch">
          {plans.map((plan, idx) => (
            <PricingCard key={idx} {...plan} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
