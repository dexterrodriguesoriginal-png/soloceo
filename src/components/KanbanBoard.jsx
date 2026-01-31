import React, { useState, useEffect, useMemo } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Phone, MessageCircle, Gamepad2, Clock, Mail } from 'lucide-react';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import FilterBar from '@/components/FilterBar';
import FollowupModal from '@/components/FollowupModal';

// StrictModeDroppable wrapper
export const StrictModeDroppable = ({ children, ...props }) => {
  const [enabled, setEnabled] = useState(false);
  useEffect(() => {
    const animation = requestAnimationFrame(() => setEnabled(true));
    return () => {
      cancelAnimationFrame(animation);
      setEnabled(false);
    };
  }, []);
  if (!enabled) return null;
  return <Droppable {...props}>{children}</Droppable>;
};

const KanbanBoard = ({ leads, setLeads, onChatClick }) => {
  const { toast } = useToast();
  const [selectedFollowupLead, setSelectedFollowupLead] = useState(null);
  const [isFollowupModalOpen, setIsFollowupModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    priority: 'all',
    date: 'all',
    followup: 'all'
  });

  const columns = {
    'Interessado': {
      id: 'Interessado',
      title: 'Interessados',
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      textColor: 'text-blue-700'
    },
    'Agendado': {
      id: 'Agendado',
      title: 'Agendados',
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      textColor: 'text-green-700'
    },
    'Convertido': {
      id: 'Convertido',
      title: 'Convertidos',
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      textColor: 'text-purple-700'
    }
  };

  const filteredLeads = useMemo(() => {
    return leads.filter(lead => {
      // 1. Priority Filter
      if (filters.priority !== 'all') {
        const score = lead.priority_score || 0;
        if (filters.priority === 'high' && score < 7) return false;
        if (filters.priority === 'medium' && (score < 4 || score >= 7)) return false;
        if (filters.priority === 'low' && score >= 4) return false;
      }

      // 2. Date Filter
      if (filters.date !== 'all') {
        const created = new Date(lead.created_at);
        const now = new Date();
        const diffHours = (now - created) / (1000 * 60 * 60);
        
        if (filters.date === '24h' && diffHours > 24) return false;
        if (filters.date === '7d' && diffHours > 24 * 7) return false;
        if (filters.date === '30d' && diffHours > 24 * 30) return false;
      }

      // 3. Follow-up Filter
      if (filters.followup !== 'all') {
        if (filters.followup === 'needs' && !lead.needs_followup) return false;
        if (filters.followup === 'sent' && !lead.followup_sent) return false;
      }

      return true;
    });
  }, [leads, filters]);

  const getLeadsByStatus = (status) => {
    const targetStatus = status === 'Convertido' ? ['Convertido', 'Finalizado'] : [status];
    return filteredLeads.filter(lead => targetStatus.includes(lead.status)) || [];
  };

  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const newStatus = destination.droppableId;
    
    // Optimistic Update
    const updatedLeads = leads.map(lead => 
      lead.id === draggableId ? { ...lead, status: newStatus } : lead
    );
    setLeads(updatedLeads);

    try {
      const { error } = await supabase
        .from('leads')
        .update({ 
          status: newStatus === 'Convertido' ? 'Finalizado' : newStatus,
          updated_at: new Date().toISOString() 
        })
        .eq('id', draggableId);

      if (error) throw error;
      toast({ title: "Status atualizado", description: `Lead movido para ${columns[newStatus].title}` });
    } catch (error) {
      console.error("Error updating lead status:", error);
      toast({ variant: "destructive", title: "Erro ao atualizar", description: "Não foi possível salvar a alteração." });
    }
  };

  const handleFollowupClick = (lead) => {
    setSelectedFollowupLead(lead);
    setIsFollowupModalOpen(true);
  };

  return (
    <div className="h-full flex flex-col">
      <FilterBar 
        filters={filters} 
        setFilters={setFilters} 
        totalLeads={leads.length}
        filteredCount={filteredLeads.length} 
      />
      
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex flex-col md:flex-row gap-6 h-full overflow-x-auto pb-4">
          {Object.values(columns).map((column) => (
            <div key={column.id} className="flex-1 min-w-[300px] flex flex-col">
              <div className={`flex items-center justify-between p-4 rounded-t-xl border-b-2 ${column.bgColor} ${column.borderColor}`}>
                <h3 className={`font-bold ${column.textColor}`}>{column.title}</h3>
                <span className={`text-xs font-semibold px-2 py-1 rounded-full bg-white/50 ${column.textColor}`}>
                  {getLeadsByStatus(column.id).length}
                </span>
              </div>
              
              <StrictModeDroppable droppableId={column.id}>
                {(provided, snapshot) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className={`flex-1 p-3 rounded-b-xl border border-t-0 ${column.borderColor} bg-slate-50/50 min-h-[500px] transition-colors duration-200 ${
                      snapshot.isDraggingOver ? 'bg-slate-100' : ''
                    }`}
                  >
                    {getLeadsByStatus(column.id).map((lead, index) => (
                      <Draggable key={lead.id} draggableId={lead.id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`mb-3 bg-white p-4 rounded-xl shadow-sm border border-slate-100 group hover:shadow-md transition-all relative ${
                              snapshot.isDragging ? 'shadow-xl rotate-2 ring-2 ring-offset-2 ring-[#22c55e]' : ''
                            } ${
                              lead.needs_followup ? 'ring-1 ring-red-200 bg-red-50/30' : ''
                            }`}
                            style={provided.draggableProps.style}
                          >
                            {/* Badges */}
                            <div className="flex flex-wrap gap-1.5 absolute -top-2 -right-2 z-10 justify-end">
                              {lead.manual_mode && (
                                <div className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-1 rounded-full shadow-sm flex items-center gap-1 border border-blue-200">
                                  <Gamepad2 className="w-3 h-3" /> Manual
                                </div>
                              )}
                              {lead.needs_followup && (
                                <div className="bg-red-100 text-red-700 text-[10px] font-bold px-2 py-1 rounded-full shadow-sm flex items-center gap-1 border border-red-200 animate-pulse">
                                  <Clock className="w-3 h-3" /> Follow-up
                                </div>
                              )}
                            </div>

                            <div className="flex justify-between items-start mb-2 mt-1">
                              <div>
                                <h4 className="font-semibold text-slate-800">{lead.name}</h4>
                                <div className="flex items-center gap-2 mt-0.5">
                                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${
                                    (lead.priority_score || 0) >= 7 ? 'bg-red-50 text-red-700 border-red-100' :
                                    (lead.priority_score || 0) >= 4 ? 'bg-yellow-50 text-yellow-700 border-yellow-100' :
                                    'bg-green-50 text-green-700 border-green-100'
                                  }`}>
                                    Score: {lead.priority_score || 0}
                                  </span>
                                </div>
                              </div>
                              <span className="text-[10px] text-slate-400 font-medium bg-slate-100 px-1.5 py-0.5 rounded whitespace-nowrap ml-2">
                                {format(new Date(lead.created_at || new Date()), 'dd/MM', { locale: ptBR })}
                              </span>
                            </div>
                            
                            <div className="space-y-1.5 text-xs text-slate-500 mb-3">
                              <div className="flex items-center gap-2">
                                <Phone className="w-3 h-3 text-slate-400" />
                                <span>{lead.phone}</span>
                              </div>
                              {lead.notes && (
                                <div className="flex items-start gap-2 pt-1">
                                  <MessageCircle className="w-3 h-3 text-slate-400 mt-0.5" />
                                  <p className="line-clamp-2 italic">{lead.notes}</p>
                                </div>
                              )}
                            </div>

                            <div className="flex gap-2">
                              <Button 
                                onClick={() => onChatClick(lead)}
                                variant="outline" 
                                size="sm" 
                                className="flex-1 h-8 text-xs border-blue-200 text-blue-600 hover:bg-blue-50 hover:text-blue-700"
                              >
                                <Gamepad2 className="w-3 h-3 mr-1.5" /> Chat
                              </Button>
                              
                              {lead.needs_followup && (
                                <Button 
                                  onClick={() => handleFollowupClick(lead)}
                                  size="sm" 
                                  className="flex-1 h-8 text-xs bg-red-500 hover:bg-red-600 text-white border-0 shadow-sm"
                                >
                                  <Mail className="w-3 h-3 mr-1.5" /> Enviar
                                </Button>
                              )}
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </StrictModeDroppable>
            </div>
          ))}
        </div>
      </DragDropContext>

      <FollowupModal 
        isOpen={isFollowupModalOpen}
        onClose={() => setIsFollowupModalOpen(false)}
        lead={selectedFollowupLead}
      />
    </div>
  );
};

export default KanbanBoard;
