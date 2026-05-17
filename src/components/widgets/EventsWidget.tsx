'use client';

import { motion } from 'framer-motion';
import { Calendar, MapPin, Users, Video, ChevronRight } from 'lucide-react';
import { Event } from '@/types';
import { useNewsEventsStore } from '@/stores/newsEventsStore';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface EventsWidgetProps {
  events?: Event[];
}

export function EventsWidget({ events }: EventsWidgetProps) {
  const router = useRouter();
  const { events: storeEvents, fetchEvents } = useNewsEventsStore();
  
  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const eventsData = events || storeEvents;

  const handleEventClick = (event: Event) => {
    if (event.registrationUrl) {
      window.open(event.registrationUrl, '_blank');
    } else {
      router.push(`/events/${event.id}`);
    }
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'conference': return 'bg-blue-500/10 text-blue-400';
      case 'workshop': return 'bg-purple-500/10 text-purple-400';
      case 'meeting': return 'bg-green-500/10 text-green-400';
      case 'course': return 'bg-orange-500/10 text-orange-400';
      default: return 'bg-gray-500/10 text-gray-400';
    }
  };

  const getEventTypeLabel = (type: string) => {
    switch (type) {
      case 'conference': return 'Conferência';
      case 'workshop': return 'Workshop';
      case 'meeting': return 'Encontro';
      case 'course': return 'Curso';
      default: return 'Outro';
    }
  };

  const formatDate = (date: Date | string) => {
    const now = new Date();
    const eventDate = typeof date === 'string' ? new Date(date) : date;
    const diffTime = eventDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Hoje';
    if (diffDays === 1) return 'Amanhã';
    if (diffDays === 7) return 'Próxima semana';
    return `Em ${diffDays} dias`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-6 hover:border-primary/30 transition-all duration-300"
    >
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-1">Eventos</h3>
          <p className="text-sm text-foreground-muted">Agroflorestais e ambientais</p>
        </div>
        <div className="p-3 bg-purple-500/10 rounded-lg">
          <Calendar className="w-6 h-6 text-purple-500" />
        </div>
      </div>

      {/* Events List */}
      <div className="space-y-4">
        {eventsData.map((event, index) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
            className="group bg-muted/30 rounded-lg p-4 hover:bg-muted/50 transition-all cursor-pointer"
            onClick={() => handleEventClick(event)}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${getEventTypeColor(event.type)}`}>
                    {getEventTypeLabel(event.type)}
                  </span>
                  {event.isVirtual && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 flex items-center gap-1">
                      <Video className="w-3 h-3" />
                      Online
                    </span>
                  )}
                </div>
                <h4 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                  {event.title}
                </h4>
                <p className="text-xs text-foreground-muted mt-1 line-clamp-2">
                  {event.description}
                </p>
              </div>
              <ChevronRight className="w-4 h-4 text-foreground-muted opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 ml-2" />
            </div>

            <div className="flex items-center gap-4 text-xs text-foreground-muted">
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span>{formatDate(event.date)}</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                <span className="truncate max-w-24">{event.location}</span>
              </div>
              {event.attendees && (
                <div className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  <span>{event.attendees}</span>
                </div>
              )}
            </div>

            <div className="mt-2 pt-2 border-t border-border/50">
              <p className="text-xs text-foreground-muted">
                <span className="text-foreground">Organizador:</span> {event.organizer}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* View All Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full mt-4 py-2 text-sm text-primary hover:text-primary-foreground hover:bg-primary transition-colors rounded-lg"
      >
        Ver todos os eventos
      </motion.button>
    </motion.div>
  );
}