import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, AlertTriangle, X, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AlertBanner = ({ alerts, onDismiss }) => {
  const navigate = useNavigate();
  // We'll show the top 3 alerts max to avoid clutter
  const visibleAlerts = alerts.slice(0, 3);

  if (visibleAlerts.length === 0) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex flex-col items-center pointer-events-none p-4 gap-2">
      <AnimatePresence>
        {visibleAlerts.map((alert) => (
          <motion.div
            key={alert.id}
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className={`pointer-events-auto w-full max-w-2xl rounded-lg shadow-lg border p-4 flex items-start gap-3 backdrop-blur-md ${
              alert.type === 'frustrated' || alert.type === 'conflict'
                ? 'bg-red-50/95 border-red-200 text-red-900'
                : 'bg-yellow-50/95 border-yellow-200 text-yellow-900'
            }`}
          >
            <div className="mt-0.5 shrink-0">
              {alert.type === 'frustrated' || alert.type === 'conflict' ? (
                <AlertCircle className="w-5 h-5 text-red-600" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-yellow-600" />
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-sm mb-1">
                {alert.type === 'frustrated' && 'Cliente Frustrado Detectado'}
                {alert.type === 'conflict' && 'Conflito de Agenda'}
                {alert.type === 'unconfident' && 'IA Precisa de Ajuda'}
              </h4>
              <p className="text-sm opacity-90 leading-relaxed">
                {alert.message}
              </p>
              
              {alert.lead_id && (
                <button
                  onClick={() => {
                    navigate('/leads');
                    // In a real app, this would filter for the specific lead or open the modal directly
                    // For now, navigating to the leads page is the first step
                  }}
                  className={`mt-2 text-xs font-semibold flex items-center hover:underline ${
                    alert.type === 'frustrated' ? 'text-red-700' : 'text-yellow-700'
                  }`}
                >
                  Ver Detalhes <ArrowRight className="w-3 h-3 ml-1" />
                </button>
              )}
            </div>

            <button
              onClick={() => onDismiss(alert.id)}
              className="p-1 rounded-md hover:bg-black/5 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default AlertBanner;
