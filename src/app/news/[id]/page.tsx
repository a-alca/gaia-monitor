'use client';

import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Tag, ExternalLink, User } from 'lucide-react';
import { useNewsEventsStore } from '@/stores/newsEventsStore';
import { useEffect, useState } from 'react';
import { News } from '@/types';

export default function NewsDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { getNewsById, fetchNews } = useNewsEventsStore();
  const [news, setNews] = useState<News | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadNews = async () => {
      await fetchNews();
      const newsId = params.id as string;
      const foundNews = getNewsById(newsId);
      setNews(foundNews || null);
      setLoading(false);
    };

    loadNews();
  }, [params.id, fetchNews, getNewsById]);

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'tecnologia': return 'bg-blue-500/10 text-blue-400';
      case 'meio ambiente': return 'bg-green-500/10 text-green-400';
      case 'clima': return 'bg-orange-500/10 text-orange-400';
      case 'política': return 'bg-purple-500/10 text-purple-400';
      case 'sustentabilidade': return 'bg-cyan-500/10 text-cyan-400';
      case 'energia': return 'bg-yellow-500/10 text-yellow-400';
      default: return 'bg-gray-500/10 text-gray-400';
    }
  };

  const formatDate = (date: Date | string) => {
    const newsDate = typeof date === 'string' ? new Date(date) : date;
    return newsDate.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-foreground">Carregando...</div>
      </div>
    );
  }

  if (!news) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Notícia não encontrada</h1>
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
            <span className={`text-sm px-3 py-1 rounded-full ${getCategoryColor(news.category)}`}>
              {news.category}
            </span>
            {news.tags.map((tag) => (
              <span key={tag} className="text-sm px-3 py-1 rounded-full bg-muted text-foreground-muted">
                #{tag}
              </span>
            ))}
          </div>

          <h1 className="text-4xl font-bold text-foreground mb-4 leading-tight">
            {news.title}
          </h1>

          <p className="text-xl text-foreground-muted mb-6">
            {news.summary}
          </p>

          <div className="flex flex-wrap items-center gap-6 text-sm text-foreground-muted">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(news.publishedAt)}</span>
            </div>
            {news.author && (
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>{news.author}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4" />
              <span>{news.source}</span>
            </div>
          </div>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-8"
        >
          <div className="prose prose-invert max-w-none">
            <p className="text-foreground leading-relaxed whitespace-pre-line">
              {news.content}
            </p>
          </div>

          {news.externalUrl && (
            <div className="mt-8 pt-8 border-t border-border">
              <a
                href={news.externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-primary hover:text-primary-foreground transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Ler fonte original</span>
              </a>
            </div>
          )}
        </motion.div>

        {/* Related Tags */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8"
        >
          <h3 className="text-lg font-semibold text-foreground mb-4">Tags relacionadas</h3>
          <div className="flex flex-wrap gap-2">
            {news.tags.map((tag) => (
              <span
                key={tag}
                className="text-sm px-3 py-1 rounded-full bg-muted text-foreground-muted hover:bg-muted/80 transition-colors cursor-pointer"
              >
                #{tag}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}