import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation, Autoplay } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const TestimonialCard = ({ name, role, text, avatar, rating }) => (
  <div className="h-full p-8 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 flex flex-col justify-between">
    <div>
      <div className="flex gap-1 mb-6">
        {[...Array(rating)].map((_, i) => (
          <Star key={i} className="w-5 h-5 text-[#39FF14] fill-[#39FF14]" />
        ))}
      </div>
      <p className="text-[#cbd5e1] italic text-lg leading-relaxed mb-8">"{text}"</p>
    </div>
    
    <div className="flex items-center gap-4">
      <div className="w-16 h-16 rounded-full bg-slate-700 overflow-hidden shrink-0 border-2 border-[#39FF14]/20">
         {/* Placeholder avatars based on names using UI avatars API if no image provided */}
         <img src={avatar || `https://ui-avatars.com/api/?name=${name}&background=random`} alt={name} className="w-full h-full object-cover" />
      </div>
      <div>
        <h4 className="text-white font-bold text-lg">{name}</h4>
        <p className="text-[#cbd5e1] text-sm">{role}</p>
      </div>
    </div>
  </div>
);

const TestimonialsSection = () => {
  const testimonials = [
    {
      name: "Mariana Silva",
      role: "Esteticista",
      text: "Antes do SoloCEO, eu perdia metade do meu dia respondendo dúvidas repetitivas. Hoje, eu só abro o WhatsApp para ver os agendamentos confirmados. Mudou meu jogo!",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150&h=150",
      rating: 5
    },
    {
      name: "João Santos",
      role: "Advogado",
      text: "Meu escritório cresceu 300% em 3 meses. A IA responde consultas iniciais e agenda reuniões. Agora tenho tempo para focar nos casos importantes.",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150&h=150",
      rating: 5
    },
    {
      name: "Ana Costa",
      role: "Consultora",
      text: "Nunca pensei que uma IA poderia ser tão humana. Meus clientes nem percebem que é automático. Recomendo para todo mundo!",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150&h=150",
      rating: 5
    },
    {
      name: "Carlos Mendes",
      role: "Personal Trainer",
      text: "A gestão de horários era um pesadelo. Com o SoloCEO, meus alunos agendam e reagendam sozinhos. Minha taxa de ocupação subiu para 95%.",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150&h=150",
      rating: 5
    }
  ];

  return (
    <section className="py-24 bg-[#1a2332] border-t border-white/5">
      <div className="max-w-7xl mx-auto px-5 md:px-10 lg:px-12">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-[44px] font-bold text-white mb-4"
          >
            Histórias de Sucesso
          </motion.h2>
        </div>

        <div className="testimonial-slider-container relative">
          <Swiper
            modules={[Pagination, Navigation, Autoplay]}
            spaceBetween={32}
            slidesPerView={1}
            breakpoints={{
              640: { slidesPerView: 1 },
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            pagination={{ clickable: true, dynamicBullets: true }}
            navigation={true}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            className="pb-16 px-4"
          >
            {testimonials.map((testimonial, idx) => (
              <SwiperSlide key={idx} className="h-auto">
                <TestimonialCard {...testimonial} />
              </SwiperSlide>
            ))}
          </Swiper>
          
          <style>{`
            .swiper-pagination-bullet {
              background: #cbd5e1;
              opacity: 0.5;
            }
            .swiper-pagination-bullet-active {
              background: #39FF14;
              opacity: 1;
            }
            .swiper-button-next, .swiper-button-prev {
              color: #39FF14;
              background: rgba(255,255,255,0.05);
              width: 40px;
              height: 40px;
              border-radius: 50%;
              backdrop-filter: blur(4px);
            }
            .swiper-button-next:after, .swiper-button-prev:after {
              font-size: 18px;
              font-weight: bold;
            }
          `}</style>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
