'use client';

import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, MapPin, Users, Video, ExternalLink, Clock } from 'lucide-react';
import { useNewsEventsStore } from '@/stores/newsEventsStore';
import { useEffect, useState } from 'react';
import { Event } from '@/types';

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { getEventById, fetchEvents } = useNewsEventsStore();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadEvent = async () => {
      await fetchEvents();
      const eventId = params.id as string;
      const foundEvent = getEventById(eventId);
      setEvent(foundEvent || null);
      setLoading(false);
    };

    loadEvent();
  }, [params.id, fetchEvents, getEventById]);

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
    const eventDate = typeof date === 'string' ? new Date(date) : date;
    return eventDate.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatTimeUntil = (date: Date | string) => {
    const now = new Date();
    const eventDate = typeof date === 'string' ? new Date(date) : date;
    const diffTime = eventDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Hoje';
    if (diffDays === 1) return 'Amanhã';
    if (diffDays < 0) return 'Evento já ocorreu';
    return `Em ${diffDays} dias`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-foreground">Carregando...</div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Evento não encontrado</h1>
          <button
            onClick={() => router.back()}
            className="text-primary hover:underline"
          >
            Voltar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-foreground-muted hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar</span>
          </button>

          <div className="flex items-center gap-2 mb-4">
            <span className={`text-sm px-3 py-1 rounded-full ${getEventTypeColor(event.type)}`}>
              {getEventTypeLabel(event.type)}
            </span>
            {event.isVirtual && (
              <span className="text-sm px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 flex items-center gap-1">
                <Video className="w-3 h-3" />
                Online
              </span>
            )}
          </div>

          <h1 className="text-4xl font-bold text-foreground mb-4 leading-tight">
            {event.title}
          </h1>

          <p className="text-xl text-foreground-muted mb-6">
            {event.description}
          </p>

          <div className="flex flex-wrap items-center gap-6 text-sm text-foreground-muted">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(event.date)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{formatTimeUntil(event.date)}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span>{event.location}</span>
            </div>
            {event.attendees && (
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>{event.attendees} participantes</span>
              </div>
            )}
          </div>
        </motion.div>

        {/* Event Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-8"
        >
          <h2 className="text-2xl font-bold text-foreground mb-6">Sobre o evento</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Descrição</h3>
              <p className="text-foreground leading-relaxed">
                {event.description}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <div className="bg-muted/30 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-foreground-muted mb-2">Organizador</h3>
                <p className="text-foreground">{event.organizer}</p>
              </div>

              <div className="bg-muted/30 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-foreground-muted mb-2">Localização</h3>
                <p className="text-foreground">{event.location}</p>
              </div>

              {event.attendees && (
                <div className="bg-muted/30 rounded-lg p-4">
                  <h3 className="text-sm font-semibold text-foreground-muted mb-2">Participantes esperados</h3>
                  <p className="text-foreground">{event.attendees} pessoas</p>
                </div>
              )}

              <div className="bg-muted/30 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-foreground-muted mb-2">Modalidade</h3>
                <p className="text-foreground">
                  {event.isVirtual ? 'Online (Remoto)' : 'Presencial'}
                </p>
              </div>
            </div>
          </div>

          {event.registrationUrl && (
            <div className="mt-8 pt-8 border-t border-border">
              <a
                href={event.registrationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Fazer inscrição</span>
              </a>
            </div>
          )}
        </motion.div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 bg-card/50 backdrop-blur-sm border border-border rounded-xl p-6"
        >
          <h3 className="text-lg font-semibold text-foreground mb-4">Informações adicionais</h3>
          <ul className="space-y-2 text-sm text-foreground-muted">
            <li>• Este evento é organizado por {event.organizer}</li>
            {event.isVirtual && (
              <li>• O evento será realizado online através de plataforma de videoconferência</li>
            )}
            {!event.isVirtual && (
              <li>• O evento será realizado presencialmente em {event.location}</li>
            )}
            <li>• Para mais informações, entre em contato com o organizador</li>
          </ul>
        </motion.div>
      </div>
    </div>
  );
}