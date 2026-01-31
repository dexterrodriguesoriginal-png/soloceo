import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Bot, Monitor, Gift, HelpCircle, Smartphone, Headphones } from 'lucide-react';

const FAQItem = ({ question, answer, icon: Icon }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mb-4 backdrop-blur-md bg-white/5 border border-white/10 rounded-xl overflow-hidden transition-all duration-300 hover:border-[#39FF14]/50 hover:bg-white/10 group">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
      >
        <div className="flex items-center gap-4">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors duration-300 ${isOpen ? 'bg-[#39FF14]/20 text-[#39FF14]' : 'bg-white/5 text-slate-400 group-hover:text-white'}`}>
                <Icon className="w-5 h-5" />
            </div>
            <span className="text-lg font-bold text-white pr-4">{question}</span>
        </div>
        <ChevronDown 
          className={`w-5 h-5 text-[#39FF14] shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 pl-[4.5rem] text-[#cbd5e1] leading-relaxed text-[16px]">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const FAQSection = () => {
  const faqs = [
    {
      icon: Bot,
      question: "A IA parece um robô?",
      answer: "Não. Utilizamos modelos GPT-4 de última geração (2026), treinados especificamente para soar humano, empático e persuasivo. A maioria dos clientes nem percebe que está falando com uma IA."
    },
    {
      icon: Monitor,
      question: "Preciso saber programar?",
      answer: "Absolutamente não. O SoloCEO foi feito para quem não entende de tecnologia. Nossa interface é visual e intuitiva. Se você sabe enviar um email ou usar o WhatsApp, você consegue configurar sua IA."
    },
    {
      icon: Gift,
      question: "O que ganho no teste grátis?",
      answer: "Você recebe acesso total a todas as funcionalidades e 5 agendamentos confirmados de cortesia. É a chance de ver o sistema se pagando antes mesmo de você investir um centavo."
    },
    {
      icon: HelpCircle,
      question: "E se o cliente fizer uma pergunta difícil?",
      answer: "A IA é treinada para encaminhar para você casos que exijam sua decisão humana, garantindo segurança total. Você sempre tem controle e pode intervir a qualquer momento."
    },
    {
      icon: Smartphone,
      question: "Funciona no meu celular?",
      answer: "Sim, é 100% otimizado para dispositivos móveis, para você gerenciar tudo na palma da mão. Dashboard, configurações e relatórios funcionam perfeitamente em qualquer smartphone."
    },
    {
      icon: Headphones,
      question: "Vou ter suporte?",
      answer: "Temos uma equipe pronta para te ajudar na configuração inicial para você não perder nenhum minuto. Suporte por email, chat e telefone disponível para todos os planos."
    }
  ];

  return (
    <section className="py-24 bg-[#0f172a] border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Dúvidas Frequentes
          </h2>
          <p className="text-[#cbd5e1] text-lg">
            Tudo que você precisa saber.
          </p>
        </div>

        <div className="max-w-[800px] mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <FAQItem key={index} question={faq.question} answer={faq.answer} icon={faq.icon} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
