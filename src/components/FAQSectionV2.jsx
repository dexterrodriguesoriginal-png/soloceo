import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, MessageSquare } from 'lucide-react';

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mb-4 backdrop-blur-md bg-white/5 border border-white/10 rounded-xl overflow-hidden transition-all duration-300 hover:border-white/20">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
      >
        <span className="text-lg font-medium text-white">{question}</span>
        <ChevronDown 
          className={`w-5 h-5 text-[#22c55e] transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 text-slate-300 leading-relaxed">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const FAQSectionV2 = () => {
  const faqs = [
    {
      question: "A IA parece um robô?",
      answer: "Não. Ela usa tecnologia GPT-4 de 2026, treinada para ser humana, empática e focada em vendas."
    },
    {
      question: "É difícil configurar?",
      answer: "Se você sabe usar o WhatsApp, você sabe usar o SoloCEO. Em 2 minutos sua IA está pronta."
    }
  ];

  return (
    <section className="py-24 bg-[#0f172a]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#22c55e]/10 text-[#22c55e] mb-6">
            <MessageSquare className="w-6 h-6" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Dúvidas Frequentes
          </h2>
          <p className="text-slate-400">
            Tudo o que você precisa saber antes de começar.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <FAQItem key={index} question={faq.question} answer={faq.answer} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSectionV2;
