// src/components/hub/HubFeed.jsx
import { useEffect, useMemo, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Loader2, Users } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';
import { useLanguage } from '@/lib/LanguageContext';
import * as hubPosts from '@/lib/data/hubPosts';
import * as hubFollows from '@/lib/data/hubFollows';
import HubPostCard from './HubPostCard';

const PAGE_SIZE = 8;

export default function HubFeed({ feedTab, onAuthorClick }) {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [following, setFollowing] = useState([]);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const sentinelRef = useRef(null);

  // Reset visible count when switching tabs — start fresh at 8.
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [feedTab]);

  // Load following list once for Squad/Following filtering.
  useEffect(() => {
    if (!user?.email) return;
    hubFollows.listFollowing(user.email).then(setFollowing);
  }, [user?.email]);

  const { data: allPosts = [], isLoading } = useQuery({
    queryKey: ['hubFeed', feedTab, user?.email, following.length],
    queryFn: async () => {
      if (feedTab === 'pump') {
        return hubPosts.fetchGlobalWindow();
      } else {
        return hubPosts.fetchFollowingWindow(following);
      }
    },
    enabled: !!user?.email,
    staleTime: 30_000, // 30s — feed isn't live, lightly cached so navigation back doesn't always refetch
  });

  // Slice the fetched window to the visible page.
  const visiblePosts = useMemo(
    () => allPosts.slice(0, visibleCount),
    [allPosts, visibleCount]
  );

  const hasMore = visibleCount < allPosts.length;

  // Auto-load more when sentinel scrolls into view.
  useEffect(() => {
    if (!hasMore || !sentinelRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setVisibleCount(c => Math.min(c + PAGE_SIZE, allPosts.length));
        }
      },
      { rootMargin: '200px' } // pre-load slightly before the user reaches it
    );
    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [hasMore, allPosts.length]);

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (allPosts.length === 0) {
    const isSquadWithFollowing = feedTab === 'squad' && following.length > 0;
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-12 px-4"
      >
        <div className="w-16 h-16 mx-auto rounded-full bg-secondary flex items-center justify-center mb-3">
          <Users className="w-7 h-7 text-muted-foreground" />
        </div>
        <p className="font-heading font-bold text-base mb-1">
          {feedTab === 'pump' 
            ? t('hub.empty.pumpTitle') 
            : isSquadWithFollowing 
            ? t('hub.empty.squadNoPosts')
            : t('hub.empty.squadTitle')}
        </p>
        <p className="text-sm text-muted-foreground">
          {feedTab === 'pump' 
            ? t('hub.empty.pumpDesc') 
            : isSquadWithFollowing
            ? t('hub.empty.squadNoPostsDesc')
            : t('hub.empty.squadDesc')}
        </p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-3">
      {visiblePosts.map((post, idx) => (
        <motion.div
          key={post.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: Math.min(idx % PAGE_SIZE, 6) * 0.04 }}
        >
          <HubPostCard post={post} onAuthorClick={onAuthorClick} />
        </motion.div>
      ))}

      {/* Sentinel for auto-load */}
      {hasMore && (
        <div ref={sentinelRef} className="flex justify-center py-6">
          <button
            onClick={() => setVisibleCount(c => Math.min(c + PAGE_SIZE, allPosts.length))}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary/50 hover:bg-secondary text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <Loader2 className="w-4 h-4 animate-spin" />
            {t('hub.feed.loadingMore')}
          </button>
        </div>
      )}

      {/* End of window marker */}
      {!hasMore && allPosts.length >= PAGE_SIZE && (
        <p className="text-center text-xs text-muted-foreground py-6">
          {t('hub.feed.allCaughtUp')}
        </p>
      )}
    </div>
  );
}