'use client';

import { motion } from 'framer-motion';
import { Newspaper, Clock, ExternalLink } from 'lucide-react';
import { News } from '@/types';
import { useNewsEventsStore } from '@/stores/newsEventsStore';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface NewsWidgetProps {
  news?: News[];
}

export function NewsWidget({ news }: NewsWidgetProps) {
  const router = useRouter();
  const { news: storeNews, fetchNews } = useNewsEventsStore();
  
  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  const newsData = news || storeNews;

  const handleNewsClick = (newsItem: News) => {
    if (newsItem.externalUrl) {
      window.open(newsItem.externalUrl, '_blank');
    } else {
      router.push(`/news/${newsItem.id}`);
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'tecnologia': return 'bg-blue-500/10 text-blue-400';
      case 'meio ambiente': return 'bg-green-500/10 text-green-400';
      case 'clima': return 'bg-orange-500/10 text-orange-400';
      case 'política': return 'bg-purple-500/10 text-purple-400';
      default: return 'bg-gray-500/10 text-gray-400';
    }
  };

  const formatTimeAgo = (date: Date | string) => {
    const now = new Date();
    const newsDate = typeof date === 'string' ? new Date(date) : date;
    const diffTime = now.getTime() - newsDate.getTime();
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    
    if (diffHours < 1) return 'Agora';
    if (diffHours === 1) return '1h atrás';
    if (diffHours < 24) return `${diffHours}h atrás`;
    
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) return '1 dia atrás';
    return `${diffDays} dias atrás`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.4 }}
      className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-6 hover:border-primary/30 transition-all duration-300"
    >
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-1">Notícias</h3>
          <p className="text-sm text-foreground-muted">Atualizações ambientais</p>
        </div>
        <div className="p-3 bg-amber-500/10 rounded-lg">
          <Newspaper className="w-6 h-6 text-amber-500" />
        </div>
      </div>

      {/* News List */}
      <div className="space-y-4">
        {newsData.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
            className="group bg-muted/30 rounded-lg p-4 hover:bg-muted/50 transition-all cursor-pointer"
            onClick={() => handleNewsClick(item)}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${getCategoryColor(item.category)}`}>
                    {item.category}
                  </span>
                </div>
                <h4 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                  {item.title}
                </h4>
              </div>
              <ExternalLink className="w-4 h-4 text-foreground-muted opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 ml-2" />
            </div>

            <p className="text-xs text-foreground-muted line-clamp-2 mb-3">
              {item.summary}
            </p>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 text-xs text-foreground-muted">
                  <Clock className="w-3 h-3" />
                  <span>{formatTimeAgo(item.publishedAt)}</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-foreground-muted">
                  <span className="text-foreground">{item.source}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-1">
                {item.tags.slice(0, 2).map((tag) => (
                  <span key={tag} className="text-xs px-2 py-0.5 rounded bg-muted text-foreground-muted">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* View All Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full mt-4 py-2 text-sm text-primary hover:text-primary-foreground hover:bg-primary transition-colors rounded-lg flex items-center justify-center gap-2"
      >
        <span>Ver todas as notícias</span>
        <ExternalLink className="w-4 h-4" />
      </motion.button>
    </motion.div>
  );
}