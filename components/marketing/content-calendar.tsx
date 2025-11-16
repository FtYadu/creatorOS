'use client';

import { useState } from 'react';
import { useMarketingStore } from '@/lib/stores/marketing-store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PostComposer } from './post-composer';
import { Calendar, Grid, List, Plus, Instagram, Youtube, Linkedin } from 'lucide-react';
import { cn } from '@/lib/utils';

const platformColors = {
  instagram: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
  tiktok: 'bg-black/20 text-white border-white/30',
  youtube: 'bg-red-500/20 text-red-400 border-red-500/30',
  linkedin: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
};

const platformIcons = {
  instagram: Instagram,
  tiktok: Grid,
  youtube: Youtube,
  linkedin: Linkedin,
};

export function ContentCalendar() {
  const { socialPosts } = useMarketingStore();
  const [composerOpen, setComposerOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('list');

  const scheduledPosts = socialPosts.filter(p => p.status === 'scheduled');
  const draftPosts = socialPosts.filter(p => p.status === 'draft');
  const publishedPosts = socialPosts.filter(p => p.status === 'published');

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Social Media Calendar</h2>
          <p className="text-muted-foreground">
            {scheduledPosts.length} scheduled • {draftPosts.length} drafts • {publishedPosts.length} published
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 glass-card border-white/10 rounded-lg p-1">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setViewMode('calendar')}
              className={cn(viewMode === 'calendar' && 'bg-white/10')}
            >
              <Calendar className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setViewMode('list')}
              className={cn(viewMode === 'list' && 'bg-white/10')}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
          <Button onClick={() => setComposerOpen(true)} className="bg-[#00F5FF] hover:bg-[#00F5FF]/80 text-black">
            <Plus className="w-4 h-4 mr-2" />
            Create Post
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="glass-card border-white/10">
          <CardHeader>
            <CardTitle className="text-sm flex items-center justify-between">
              <span>Drafts</span>
              <Badge variant="secondary">{draftPosts.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {draftPosts.map((post) => {
              const Icon = platformIcons[post.platform];
              return (
                <div key={post.id} className="glass-card border-white/10 p-3 rounded-lg">
                  <div className="flex items-start gap-2">
                    <Icon className="w-4 h-4 mt-1 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm line-clamp-2">{post.caption || 'No caption'}</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {post.hashtags.slice(0, 2).map((tag) => (
                          <span key={tag} className="text-xs text-[#00F5FF]">{tag}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            {draftPosts.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">No drafts</p>
            )}
          </CardContent>
        </Card>

        <Card className="glass-card border-white/10">
          <CardHeader>
            <CardTitle className="text-sm flex items-center justify-between">
              <span>Scheduled</span>
              <Badge variant="secondary" className="bg-blue-500/20 text-blue-400">
                {scheduledPosts.length}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {scheduledPosts.map((post) => {
              const Icon = platformIcons[post.platform];
              return (
                <div key={post.id} className="glass-card border-white/10 p-3 rounded-lg">
                  <div className="flex items-start gap-2">
                    <Icon className="w-4 h-4 mt-1 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm line-clamp-2">{post.caption || 'No caption'}</p>
                      {post.scheduledDate && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(post.scheduledDate).toLocaleDateString()} at{' '}
                          {new Date(post.scheduledDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
            {scheduledPosts.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">No scheduled posts</p>
            )}
          </CardContent>
        </Card>

        <Card className="glass-card border-white/10">
          <CardHeader>
            <CardTitle className="text-sm flex items-center justify-between">
              <span>Recently Published</span>
              <Badge variant="secondary" className="bg-green-500/20 text-green-400">
                {publishedPosts.length}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {publishedPosts.slice(0, 5).map((post) => {
              const Icon = platformIcons[post.platform];
              return (
                <div key={post.id} className="glass-card border-white/10 p-3 rounded-lg">
                  <div className="flex items-start gap-2">
                    <Icon className="w-4 h-4 mt-1 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm line-clamp-2">{post.caption || 'No caption'}</p>
                      <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                        <span>{post.views.toLocaleString()} views</span>
                        <span>{post.likes.toLocaleString()} likes</span>
                        <span>{post.comments} comments</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            {publishedPosts.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">No published posts</p>
            )}
          </CardContent>
        </Card>
      </div>

      <PostComposer open={composerOpen} onClose={() => setComposerOpen(false)} />
    </div>
  );
}
