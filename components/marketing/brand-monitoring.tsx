'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Avatar } from '@/components/ui/avatar';
import {
  MessageSquare,
  Star,
  TrendingUp,
  TrendingDown,
  Instagram,
  Facebook,
  Globe,
  Eye,
  ThumbsUp,
  AlertCircle,
  Reply,
  ExternalLink,
} from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';

const socialMentions = [
  {
    id: '1',
    platform: 'instagram',
    user: '@sarahabudhabi',
    content: 'Best wedding photographer in Dubai! Thank you for capturing our special day so beautifully 💕✨',
    timestamp: '2 hours ago',
    likes: 45,
    engagement: 'high',
  },
  {
    id: '2',
    platform: 'instagram',
    user: '@dubailifestyle',
    content: 'Stunning work as always! 📸',
    timestamp: '5 hours ago',
    likes: 23,
    engagement: 'medium',
  },
  {
    id: '3',
    platform: 'facebook',
    user: 'Mohammed Al Rashid',
    content: 'Professional corporate event coverage. Highly recommended for business events in UAE.',
    timestamp: '1 day ago',
    likes: 67,
    engagement: 'high',
  },
];

const reviews = [
  {
    id: '1',
    platform: 'google',
    author: 'Aisha & Omar',
    rating: 5,
    content:
      'Absolutely stunning photos! The team captured every special moment of our wedding day. We couldn\'t be happier with the results. Highly recommend for any couple looking for professional photography in Dubai.',
    date: '3 days ago',
    helpful: 12,
    responded: true,
  },
  {
    id: '2',
    platform: 'google',
    author: 'TechCorp UAE',
    rating: 5,
    content:
      'Professional, punctual, and produced exceptional corporate event photos. Our CEO was extremely pleased with the quality. Will definitely use again for future events.',
    date: '1 week ago',
    helpful: 8,
    responded: true,
  },
  {
    id: '3',
    platform: 'facebook',
    author: 'Sarah Thompson',
    rating: 4,
    content:
      'Great experience overall. The photographer was creative and made us feel comfortable. Minor delay in delivery but final photos were worth the wait.',
    date: '2 weeks ago',
    helpful: 5,
    responded: false,
  },
];

const competitorData = [
  {
    name: 'Dubai Wedding Studios',
    posts: 45,
    avgEngagement: 4.2,
    followers: 18500,
    trend: 'up',
  },
  {
    name: 'UAE Event Photographers',
    posts: 32,
    avgEngagement: 3.8,
    followers: 12300,
    trend: 'stable',
  },
  {
    name: 'Luxury Photo UAE',
    posts: 28,
    avgEngagement: 5.1,
    followers: 25600,
    trend: 'up',
  },
];

const responseTemplates = [
  {
    id: 'positive',
    name: 'Positive Review Response',
    template:
      'Thank you so much for your kind words! It was an absolute pleasure working with you. We\'re thrilled that you love the photos and we hope to capture more special moments for you in the future! 🙏✨',
  },
  {
    id: 'negative',
    name: 'Address Concerns',
    template:
      'Thank you for your feedback. We sincerely apologize for any inconvenience. We\'d love to discuss this further and make things right. Please contact us directly at [contact info] so we can resolve this promptly.',
  },
  {
    id: 'neutral',
    name: 'Thank You Response',
    template: 'Thank you for taking the time to leave a review! We appreciate your business and feedback. 🙏',
  },
];

export function BrandMonitoring() {
  const [selectedReview, setSelectedReview] = useState<string | null>(null);
  const [responseText, setResponseText] = useState('');

  const sentimentData = {
    positive: 85,
    neutral: 12,
    negative: 3,
  };

  const platformStats = [
    { platform: 'Google', rating: 4.8, reviews: 45, icon: Globe },
    { platform: 'Facebook', rating: 4.9, reviews: 32, icon: Facebook },
    { platform: 'Instagram', rating: 4.7, mentions: 234, icon: Instagram },
  ];

  const handleApplyTemplate = (template: string) => {
    setResponseText(template);
    toast.success('Template applied');
  };

  const handleSendResponse = () => {
    toast.success('Response posted successfully!');
    setResponseText('');
    setSelectedReview(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Brand Monitoring</h2>
          <p className="text-muted-foreground">Track mentions, reviews, and brand sentiment</p>
        </div>
        <Button className="bg-[#00F5FF] hover:bg-[#00F5FF]/80 text-black">
          <Eye className="w-4 h-4 mr-2" />
          View All
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="glass-card border-white/10">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Average Rating</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <div className="text-4xl font-bold gradient-text">4.8</div>
              <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
            </div>
            <p className="text-xs text-muted-foreground mt-1">Across all platforms</p>
          </CardContent>
        </Card>

        <Card className="glass-card border-white/10">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Reviews</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">77</div>
            <div className="flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3 text-green-400" />
              <span className="text-xs text-green-400">+12 this month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-white/10">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Social Mentions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-[#00F5FF]">234</div>
            <p className="text-xs text-muted-foreground mt-1">Last 30 days</p>
          </CardContent>
        </Card>

        <Card className="glass-card border-white/10">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Response Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-green-400">94%</div>
            <p className="text-xs text-muted-foreground mt-1">Within 24 hours</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="glass-card border-white/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Brand Sentiment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-green-400">Positive</span>
                  <span className="text-lg font-bold">{sentimentData.positive}%</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-3">
                  <div
                    className="h-3 rounded-full bg-green-500"
                    style={{ width: `${sentimentData.positive}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-400">Neutral</span>
                  <span className="text-lg font-bold">{sentimentData.neutral}%</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-3">
                  <div
                    className="h-3 rounded-full bg-gray-500"
                    style={{ width: `${sentimentData.neutral}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-red-400">Negative</span>
                  <span className="text-lg font-bold">{sentimentData.negative}%</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-3">
                  <div
                    className="h-3 rounded-full bg-red-500"
                    style={{ width: `${sentimentData.negative}%` }}
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-white/10">
                <div className="text-center">
                  <div className="text-3xl font-bold gradient-text mb-1">Excellent</div>
                  <p className="text-xs text-muted-foreground">Brand Health Score</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-white/10 lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-400" />
              Platform Ratings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {platformStats.map((stat, idx) => {
                const Icon = stat.icon;
                return (
                  <div key={idx} className="glass-card border-white/10 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="font-semibold">{stat.platform}</div>
                          <div className="text-xs text-muted-foreground">
                            {stat.reviews ? `${stat.reviews} reviews` : `${stat.mentions} mentions`}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1 text-lg font-bold">
                          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                          {stat.rating}
                        </div>
                        <Button size="sm" variant="ghost" className="h-6 text-xs">
                          <ExternalLink className="w-3 h-3 mr-1" />
                          View
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass-card border-white/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Instagram className="w-5 h-5" />
              Recent Social Mentions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {socialMentions.map((mention) => (
                <div key={mention.id} className="glass-card border-white/10 p-4 rounded-lg">
                  <div className="flex items-start gap-3">
                    <Avatar className="w-10 h-10 bg-gradient-to-br from-[#00F5FF] to-[#B026FF]" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-sm">{mention.user}</span>
                        <Badge
                          variant="outline"
                          className={
                            mention.platform === 'instagram'
                              ? 'bg-pink-500/20 text-pink-400 border-pink-500/30'
                              : 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                          }
                        >
                          {mention.platform}
                        </Badge>
                      </div>
                      <p className="text-sm mb-2">{mention.content}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>{mention.timestamp}</span>
                        <span className="flex items-center gap-1">
                          <ThumbsUp className="w-3 h-3" />
                          {mention.likes}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-white/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-400" />
              Recent Reviews
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {reviews.map((review) => (
                <div key={review.id} className="glass-card border-white/10 p-4 rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="font-semibold text-sm">{review.author}</div>
                      <div className="flex items-center gap-1 my-1">
                        {Array.from({ length: review.rating }).map((_, i) => (
                          <Star key={i} className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                        ))}
                      </div>
                    </div>
                    <Badge variant="outline" className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                      {review.platform}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{review.content}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">{review.date}</span>
                    {review.responded ? (
                      <Badge variant="outline" className="bg-green-500/20 text-green-400 border-green-500/30">
                        <Reply className="w-3 h-3 mr-1" />
                        Responded
                      </Badge>
                    ) : (
                      <Button
                        size="sm"
                        onClick={() => setSelectedReview(review.id)}
                        className="bg-[#00F5FF] hover:bg-[#00F5FF]/80 text-black h-6 text-xs"
                      >
                        <Reply className="w-3 h-3 mr-1" />
                        Respond
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {selectedReview && (
        <Card className="glass-card border-[#00F5FF]/30">
          <CardHeader>
            <CardTitle>Respond to Review</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="text-sm font-medium mb-2">Quick Templates</div>
              <div className="flex gap-2">
                {responseTemplates.map((template) => (
                  <Button
                    key={template.id}
                    size="sm"
                    variant="outline"
                    onClick={() => handleApplyTemplate(template.template)}
                    className="glass-card border-white/10"
                  >
                    {template.name}
                  </Button>
                ))}
              </div>
            </div>

            <Textarea
              value={responseText}
              onChange={(e) => setResponseText(e.target.value)}
              placeholder="Write your response..."
              className="glass-card border-white/10 min-h-[120px]"
            />

            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setSelectedReview(null)} className="glass-card border-white/10">
                Cancel
              </Button>
              <Button onClick={handleSendResponse} className="bg-[#00F5FF] hover:bg-[#00F5FF]/80 text-black">
                <Reply className="w-4 h-4 mr-2" />
                Send Response
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="glass-card border-white/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Competitor Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Competitor</th>
                  <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Posts/Month</th>
                  <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Avg Engagement</th>
                  <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Followers</th>
                  <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Trend</th>
                </tr>
              </thead>
              <tbody>
                {competitorData.map((competitor, idx) => (
                  <tr key={idx} className="border-b border-white/10 hover:bg-white/5">
                    <td className="py-3 px-2 font-medium">{competitor.name}</td>
                    <td className="py-3 px-2">{competitor.posts}</td>
                    <td className="py-3 px-2">{competitor.avgEngagement}%</td>
                    <td className="py-3 px-2">{competitor.followers.toLocaleString()}</td>
                    <td className="py-3 px-2">
                      {competitor.trend === 'up' ? (
                        <TrendingUp className="w-4 h-4 text-green-400" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-gray-400" />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
