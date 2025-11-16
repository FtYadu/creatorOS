'use client';

import { useState } from 'react';
import { useMarketingStore } from '@/lib/stores/marketing-store';
import type { SocialPlatform } from '@/types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Instagram, Youtube, Linkedin, Grid, Calendar, Sparkles, Hash, Send } from 'lucide-react';
import toast from 'react-hot-toast';
import { cn } from '@/lib/utils';

interface PostComposerProps {
  open: boolean;
  onClose: () => void;
}

const platformOptions: { value: SocialPlatform; label: string; icon: any; maxChars: number }[] = [
  { value: 'instagram', label: 'Instagram', icon: Instagram, maxChars: 2200 },
  { value: 'tiktok', label: 'TikTok', icon: Grid, maxChars: 2200 },
  { value: 'youtube', label: 'YouTube', icon: Youtube, maxChars: 5000 },
  { value: 'linkedin', label: 'LinkedIn', icon: Linkedin, maxChars: 3000 },
];

const captionTemplates = [
  {
    name: 'Professional Wedding',
    caption: '✨ Captured magic at {location} last weekend. Every moment was filled with love, laughter, and unforgettable memories. Congratulations to the beautiful couple! 💕',
    hashtags: ['#DubaiWedding', '#UAEWeddings', '#WeddingPhotography', '#DubaiPhotographer'],
  },
  {
    name: 'Corporate Event',
    caption: 'Professional corporate event photography for {client}. Creating compelling visual stories that showcase your brand\'s excellence. 📸',
    hashtags: ['#CorporatePhotography', '#UAEBusiness', '#DubaiEvents', '#ProfessionalPhotography'],
  },
  {
    name: 'Behind The Scenes',
    caption: 'Behind the scenes from our latest shoot! Love what we do and the amazing people we get to work with. 🎥✨',
    hashtags: ['#BehindTheScenes', '#PhotoshootLife', '#DubaiPhotographer', '#CreativeCommunity'],
  },
];

export function PostComposer({ open, onClose }: PostComposerProps) {
  const { addSocialPost } = useMarketingStore();
  const [selectedPlatforms, setSelectedPlatforms] = useState<SocialPlatform[]>(['instagram']);
  const [caption, setCaption] = useState('');
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [hashtagInput, setHashtagInput] = useState('');
  const [scheduledDate, setScheduledDate] = useState('');
  const [showAIGenerator, setShowAIGenerator] = useState(false);

  const maxChars = Math.min(...selectedPlatforms.map(p => platformOptions.find(opt => opt.value === p)?.maxChars || 2200));
  const remainingChars = maxChars - caption.length;

  const handlePlatformToggle = (platform: SocialPlatform) => {
    setSelectedPlatforms((prev) =>
      prev.includes(platform)
        ? prev.filter((p) => p !== platform)
        : [...prev, platform]
    );
  };

  const handleAddHashtag = () => {
    const tag = hashtagInput.trim();
    if (!tag) return;
    const formatted = tag.startsWith('#') ? tag : `#${tag}`;
    if (!hashtags.includes(formatted)) {
      setHashtags([...hashtags, formatted]);
    }
    setHashtagInput('');
  };

  const handleRemoveHashtag = (tag: string) => {
    setHashtags(hashtags.filter((t) => t !== tag));
  };

  const handleApplyTemplate = (template: typeof captionTemplates[0]) => {
    setCaption(template.caption);
    setHashtags(template.hashtags);
    setShowAIGenerator(false);
  };

  const handleSchedulePost = () => {
    if (!caption.trim()) {
      toast.error('Please add a caption');
      return;
    }

    if (selectedPlatforms.length === 0) {
      toast.error('Please select at least one platform');
      return;
    }

    selectedPlatforms.forEach((platform) => {
      addSocialPost({
        platform,
        caption,
        hashtags,
        mediaUrls: [],
        scheduledDate: scheduledDate ? new Date(scheduledDate) : undefined,
        status: scheduledDate ? 'scheduled' : 'draft',
        postType: 'showcase',
        views: 0,
        likes: 0,
        comments: 0,
        shares: 0,
      });
    });

    toast.success(`Post ${scheduledDate ? 'scheduled' : 'saved as draft'}!`);
    onClose();
    setCaption('');
    setHashtags([]);
    setScheduledDate('');
    setSelectedPlatforms(['instagram']);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="glass-card border-white/10 max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Social Media Post</DialogTitle>
          <DialogDescription>
            Compose and schedule your content across multiple platforms
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label>Select Platforms</Label>
            <div className="flex flex-wrap gap-2">
              {platformOptions.map((platform) => {
                const Icon = platform.icon;
                const isSelected = selectedPlatforms.includes(platform.value);
                return (
                  <Button
                    key={platform.value}
                    variant="outline"
                    onClick={() => handlePlatformToggle(platform.value)}
                    className={cn(
                      'glass-card border-white/10',
                      isSelected && 'bg-[#00F5FF]/20 border-[#00F5FF]/50'
                    )}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {platform.label}
                  </Button>
                );
              })}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="caption">Caption</Label>
              <div className="flex items-center gap-2">
                <span className={cn(
                  'text-xs',
                  remainingChars < 0 ? 'text-red-400' : 'text-muted-foreground'
                )}>
                  {remainingChars} / {maxChars}
                </span>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => setShowAIGenerator(!showAIGenerator)}
                  className="glass-card border-white/10"
                >
                  <Sparkles className="w-3 h-3 mr-1" />
                  AI Templates
                </Button>
              </div>
            </div>
            <Textarea
              id="caption"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Write your caption here..."
              className="glass-card border-white/10 min-h-[120px]"
            />
          </div>

          {showAIGenerator && (
            <Card className="glass-card border-[#00F5FF]/30">
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#00F5FF]" />
                  Caption Templates
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {captionTemplates.map((template) => (
                  <Button
                    key={template.name}
                    variant="outline"
                    onClick={() => handleApplyTemplate(template)}
                    className="w-full justify-start text-left glass-card border-white/10 h-auto py-3"
                  >
                    <div>
                      <div className="font-medium text-sm mb-1">{template.name}</div>
                      <div className="text-xs text-muted-foreground line-clamp-2">
                        {template.caption.substring(0, 100)}...
                      </div>
                    </div>
                  </Button>
                ))}
              </CardContent>
            </Card>
          )}

          <div className="space-y-2">
            <Label>Hashtags</Label>
            <div className="flex gap-2">
              <Input
                value={hashtagInput}
                onChange={(e) => setHashtagInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddHashtag())}
                placeholder="Add hashtag (e.g., DubaiWedding)"
                className="glass-card border-white/10"
              />
              <Button type="button" onClick={handleAddHashtag} variant="outline" className="glass-card border-white/10">
                <Hash className="w-4 h-4" />
              </Button>
            </div>
            {hashtags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {hashtags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="cursor-pointer hover:bg-red-500/20"
                    onClick={() => handleRemoveHashtag(tag)}
                  >
                    {tag} ×
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="scheduledDate">Schedule (Optional)</Label>
            <Input
              id="scheduledDate"
              type="datetime-local"
              value={scheduledDate}
              onChange={(e) => setScheduledDate(e.target.value)}
              className="glass-card border-white/10"
            />
            <p className="text-xs text-muted-foreground">
              Leave empty to save as draft. Set a date to schedule for later.
            </p>
          </div>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={onClose} className="glass-card border-white/10">
              Cancel
            </Button>
            <Button onClick={handleSchedulePost} className="bg-[#00F5FF] hover:bg-[#00F5FF]/80 text-black">
              <Send className="w-4 h-4 mr-2" />
              {scheduledDate ? 'Schedule Post' : 'Save as Draft'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
