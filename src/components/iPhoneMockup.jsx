import React from 'react';
import { motion } from 'framer-motion';
import WhatsAppChat from './WhatsAppChat';

const iPhoneMockup = () => {
  return (
    <motion.div 
        className="relative w-[300px] sm:w-[340px] h-[600px] sm:h-[680px] mx-auto"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
    >
      {/* Shadow */}
      <div className="absolute inset-0 bg-black/40 blur-3xl translate-y-10 rounded-[60px]"></div>

      {/* Frame */}
      <div className="relative h-full w-full bg-[#1a1a1a] rounded-[55px] p-4 shadow-[0_0_0_2px_#3d3d3d,0_0_0_8px_#121212,0_20px_50px_rgba(0,0,0,0.5)] border-4 border-[#333] overflow-hidden z-10">
        
        {/* Screen */}
        <div className="w-full h-full bg-black rounded-[40px] overflow-hidden relative border border-white/5">
            {/* Dynamic Island / Notch */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[100px] h-[28px] bg-black rounded-b-[18px] z-30 flex items-center justify-center gap-2">
                <div className="w-12 h-1.5 rounded-full bg-[#1a1a1a]/50"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-[#111]/80 shadow-[inset_0_0_2px_rgba(255,255,255,0.2)]"></div>
            </div>

            {/* Content */}
            <div className="w-full h-full pt-8 pb-2 bg-white">
                <WhatsAppChat />
            </div>

            {/* Home Indicator */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-black/90 rounded-full z-30"></div>
        </div>

        {/* Side Buttons (Mock) */}
        <div className="absolute top-28 -left-[14px] w-[6px] h-10 bg-[#2a2a2a] rounded-l-md border-l border-t border-b border-[#444]"></div>
        <div className="absolute top-44 -left-[14px] w-[6px] h-16 bg-[#2a2a2a] rounded-l-md border-l border-t border-b border-[#444]"></div>
        <div className="absolute top-36 -right-[14px] w-[6px] h-24 bg-[#2a2a2a] rounded-r-md border-r border-t border-b border-[#444]"></div>
      </div>
    </motion.div>
  );
};

export default iPhoneMockup;
